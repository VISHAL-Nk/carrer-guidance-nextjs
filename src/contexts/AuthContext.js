"use client";
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useToast } from './ToastContext';

const AuthCtx = createContext({ user: null, loading: true, completion: null, refresh: async () => {}, signout: async () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completion, setCompletion] = useState(null); // { isComplete, percentage }
  const { notify } = useToast();

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session', { cache: 'no-store' });
      const data = await res.json();
      if (data.authenticated) {
        setUser(data.user);
        // fetch profile completion if authenticated - but don't let it block the auth flow
        try {
          const c = await fetch('/api/profile?v=completion', { cache: 'no-store' });
          if (c.ok) {
            const cd = await c.json();
            setCompletion(cd.profileCompletion);
            if (!cd.profileCompletion?.isComplete) {
              notify('Please complete your profile to access all features.');
            }
          } else {
            console.warn('Failed to fetch profile completion:', c.status);
            setCompletion(null);
          }
        } catch (error) {
          console.warn('Error fetching profile completion:', error);
          setCompletion(null);
        }
      } else {
        setUser(null);
        setCompletion(null);
      }
    } catch (error) {
      console.error('Error in auth refresh:', error);
      setUser(null);
      setCompletion(null);
    } finally {
      setLoading(false);
    }
  }, [notify]);

  const signout = useCallback(async () => {
    await fetch('/api/auth?action=signout', { method: 'POST' });
    setUser(null);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return <AuthCtx.Provider value={{ user, loading, completion, refresh, signout }}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
