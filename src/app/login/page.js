"use client";
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { refresh } = useAuth();
  const router = useRouter();

  async function onSubmit(e) {
    e.preventDefault();
    setMessage('');
    if (!email || !password) {
      setMessage('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth?action=login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) setMessage(data.message || 'Login failed');
      else {
        setMessage('Logged in');
        await refresh();
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-black text-white px-4 py-2 disabled:opacity-60" disabled={loading}>{loading ? 'Logging in…' : 'Login'}</button>
      </form>
      {message && <p className="mt-4 text-sm" role="status">{message}</p>}
    </div>
  );
}
