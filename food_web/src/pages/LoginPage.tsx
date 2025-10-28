import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

function normalizePhoneMasked(masked: string): string {
  return masked.replace(/\D/g, '');
}

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await authAPI.login({ phone: normalizePhoneMasked(phone), password });
      localStorage.setItem('token', res.data.data.token);
      window.location.href  = "/";
    } catch (err: any) {
      setError(err.response?.data?.error || 'Giriş başarısız');
    }
  };

  const onPhoneChange = (v: string) => {
    const raw = (v || '').replace(/\D/g, '');
    // Treat lone country code as empty during backspace
    if (raw.length === 0 || raw === '90') {
      setPhone('');
      return;
    }
    let digits = raw;
    // User starts with 5 -> prepend country code
    if (digits.startsWith('5')) digits = '90' + digits;
    // Leading 0 -> convert to 90 prefix
    if (digits.startsWith('0')) digits = '90' + digits.slice(1);
    // Ensure 90 prefix
    if (!digits.startsWith('90')) digits = '90' + digits.replace(/^90?/, '');
    digits = digits.slice(0, 12); // 90 + 10 digits
    const rest = digits.slice(2);
    let res = '+90 ';
    if (rest.length > 0) res += '(' + rest.slice(0, 3);
    if (rest.length >= 3) res += ') ' + rest.slice(3, 6);
    if (rest.length >= 6) res += ' ' + rest.slice(6, 10);
    setPhone(res);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-6">
        <h1 className="text-2xl font-bold mb-4">Giriş Yap</h1>
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Telefon</label>
            <input value={phone} onChange={(e) => onPhoneChange(e.target.value)} placeholder="+90 (555) 555 5555" className="w-full px-4 py-3 border rounded-2xl" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Parola</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border rounded-2xl" />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-3 rounded-2xl font-bold">Giriş Yap</button>
        </form>
        <p className="mt-4 text-sm">Hesabın yok mu? <Link to="/register" className="text-primary">Kayıt ol</Link></p>
      </div>
    </div>
  );
}


