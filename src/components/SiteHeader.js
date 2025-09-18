"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";

export default function SiteHeader() {
  const { user, loading, signout, completion } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    function onClick(e){ if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false); }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return (
    <header className="p-4 border-b">
      <div className="max-w-5xl mx-auto flex items-center justify-between text-sm">
        <nav className="flex gap-4">
          <Link href="/">Home</Link>
          <Link href="/colleges">Colleges</Link>
          <Link href="/guidance">Career Guidance</Link>
          <Link href="/interest">Interest</Link>
          <Link href="/scholarships">Scholarships</Link>
          <Link href="/roadmap">Roadmap</Link>
          <Link href="/profile">Profile</Link>
        </nav>
        <div>
          {loading ? (
            <span>Loading...</span>
          ) : user ? (
            <div className="relative" ref={menuRef}>
              <button className="flex items-center gap-2 border px-3 py-1 rounded" onClick={() => setOpen((v)=>!v)}>
                <span className="inline-flex size-6 items-center justify-center rounded-full bg-gray-200 font-medium">
                  {user.firstName?.[0]?.toUpperCase() || 'U'}
                </span>
                <span className="hidden sm:inline">{user.firstName}</span>
                {completion && (
                  <span className="ml-2 text-xs text-gray-500">{Math.round(completion.percentage)}% complete</span>
                )}
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-56 rounded border bg-white shadow-lg z-50">
                  <div className="p-3 border-b">
                    <div className="font-medium">{user.firstName} {user.lastName}</div>
                    {completion && <div className="text-xs text-gray-500">Profile {Math.round(completion.percentage)}% complete</div>}
                  </div>
                  <div className="p-2 flex flex-col">
                    <Link href="/profile" className="px-3 py-2 hover:bg-gray-50 rounded">Update Profile</Link>
                    <button className="text-left px-3 py-2 hover:bg-gray-50 rounded" onClick={signout}>Sign out</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <Link className="underline" href="/login">Login</Link>
              <Link className="underline" href="/register">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
