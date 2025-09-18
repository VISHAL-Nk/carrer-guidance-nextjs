"use client";
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');

  async function load() {
    const res = await fetch('/api/profile');
    const data = await res.json();
    if (res.ok) setProfile(data.profile);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    const res = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) });
    const data = await res.json();
    setMessage(res.ok ? 'Saved' : data.message || 'Error');
  }

  if (!profile) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-bold">Profile</h1>
      {['dob','gender','location','class','stream'].map((k) => (
        <div key={k} className="flex gap-2 items-center">
          <label className="w-24 capitalize">{k}</label>
          <input className="flex-1 border p-2" value={profile[k] || ''} onChange={(e)=>setProfile({...profile,[k]:e.target.value})} />
        </div>
      ))}
      <button className="bg-black text-white px-4 py-2" onClick={save}>Save</button>
      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}
