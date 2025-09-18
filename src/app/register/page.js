"use client";
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', middleName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { refresh } = useAuth();
  const router = useRouter();

  async function sendOtp(e) {
    e.preventDefault();
    setMessage('');
    const required = ['firstName','lastName','email','phone','password','confirmPassword'];
    for (const k of required) {
      if (!form[k]) { setMessage(`Please fill ${k}`); return; }
    }
    if (form.password !== form.confirmPassword) { setMessage('Passwords do not match'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth?action=register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) setMessage(data.message || 'Failed to send OTP');
      else setStage(2);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    setMessage('');
    if (!otp) { setMessage('Please enter the OTP'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth?action=verifyOTP', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: form.phone, otp }) });
      const data = await res.json();
      if (!res.ok) setMessage(data.message || 'Verification failed');
      else {
        setMessage('Registered successfully. You can login now.');
        await refresh();
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {stage === 1 ? (
        <form className="grid grid-cols-1 gap-3" onSubmit={sendOtp}>
          {['firstName','middleName','lastName','email','phone','password','confirmPassword'].map((k) => (
            <input key={k} className="w-full border p-2" placeholder={k} type={k.toLowerCase().includes('password') ? 'password' : (k==='email'?'email':(k==='phone'?'tel':'text'))} value={form[k]} onChange={(e)=>setForm({...form,[k]:e.target.value})} required={['firstName','lastName','email','phone','password','confirmPassword'].includes(k)} />
          ))}
          <button className="bg-black text-white px-4 py-2 disabled:opacity-60" disabled={loading}>{loading ? 'Sending…' : 'Send OTP'}</button>
        </form>
      ) : (
        <form className="space-y-3" onSubmit={verifyOtp}>
          <input className="w-full border p-2" placeholder="Enter OTP" value={otp} onChange={(e)=>setOtp(e.target.value)} required />
          <button className="bg-black text-white px-4 py-2 disabled:opacity-60" disabled={loading}>{loading ? 'Verifying…' : 'Verify OTP'}</button>
        </form>
      )}
      {message && <p className="mt-4 text-sm" role="status">{message}</p>}
    </div>
  );
}
