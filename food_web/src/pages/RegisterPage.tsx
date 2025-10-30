import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

function normalizePhoneMasked(masked: string): string {
  return masked.replace(/\D/g, '');
}

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+90 (5');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await authAPI.register({ fullName, phone: normalizePhoneMasked(phone), password });
      localStorage.setItem('token', res.data.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Kayıt başarısız');
    }
  };

  const onPhoneChange = (v: string) => {
    const raw = (v || '').replace(/\D/g, '');
    if (raw.length === 0 || raw === '90') {
      setPhone('');
      return;
    }
    let digits = raw;
    if (digits.startsWith('5')) digits = '90' + digits;
    if (digits.startsWith('0')) digits = '90' + digits.slice(1);
    if (!digits.startsWith('90')) digits = '90' + digits.replace(/^90?/, '');
    digits = digits.slice(0, 12);
    const rest = digits.slice(2);
    let res = '+90 ';
    if (rest.length > 0) res += '(' + rest.slice(0, 3);
    if (rest.length >= 3) res += ') ' + rest.slice(3, 6);
    if (rest.length >= 6) res += ' ' + rest.slice(6, 10);
    setPhone(res);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Kayıt Ol</h1>
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ad Soyad</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Telefon</label>
            <input value={phone} onChange={(e) => onPhoneChange(e.target.value)} placeholder="+90 (555) 555 5555" className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Parola</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-3 rounded-2xl font-bold">Kayıt Ol</button>
        </form>
        <p className="mt-4 text-sm">Hesabın var mı? <Link to="/login" className="text-primary">Giriş yap</Link></p>
      </div>
    </div>
  );
}


