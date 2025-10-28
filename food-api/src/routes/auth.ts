import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../index';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_change_me';

function normalizePhone(phone: string): string {
  // keep digits only
  return phone.replace(/\D/g, '');
}

router.post('/register', async (req, res) => {
  try {
    const { fullName, phone, password } = req.body;
    if (!fullName || !phone || !password) {
      return res.status(400).json({ success: false, error: 'Required fields missing' });
    }
    const normalizedPhone = normalizePhone(phone);
    const existing = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Phone already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { fullName, phone: normalizedPhone, passwordHash } });
    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, data: { token, user: { id: user.id, fullName: user.fullName, phone: user.phone, role: user.role } } });
  } catch (e) {
    console.error('Register error', e);
    res.status(500).json({ success: false, error: 'Failed to register' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, password, username } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Phone/username and password required' });
    }
    let user = null as any;
    if (phone) {
      const normalizedPhone = normalizePhone(phone);
      user = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
    } else if (username) {
      user = await prisma.user.findFirst({ where: { fullName: username } });
    }
    if (!user) return res.status(400).json({ success: false, error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ success: false, error: 'Invalid credentials' });
    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, data: { token, user: { id: user.id, fullName: user.fullName, phone: user.phone, role: user.role } } });
  } catch (e) {
    console.error('Login error', e);
    res.status(500).json({ success: false, error: 'Failed to login' });
  }
});

export function authMiddleware(req: any, res: any, next: any) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ success: false, error: 'Unauthorized' });
  const token = header.replace('Bearer ', '');
  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    req.userRole = payload.role;
    return next();
  } catch {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
}

router.get('/me', async (req: any, res) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ success: false, error: 'Unauthorized' });
    const token = header.replace('Bearer ', '');
    const payload: any = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });
    res.json({ success: true, data: { id: user.id, fullName: user.fullName, phone: user.phone, role: user.role, address: user.address } });
  } catch {
    res.status(401).json({ success: false, error: 'Unauthorized' });
  }
});

router.put('/me', async (req: any, res) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ success: false, error: 'Unauthorized' });
    const token = header.replace('Bearer ', '');
    const payload: any = jwt.verify(token, JWT_SECRET);
    const { address, fullName } = req.body;
    const user = await prisma.user.update({ where: { id: payload.sub }, data: { address, fullName } });
    res.json({ success: true, data: { id: user.id, fullName: user.fullName, phone: user.phone, role: user.role, address: user.address } });
  } catch (e) {
    res.status(400).json({ success: false, error: 'Failed to update profile' });
  }
});

export default router;


