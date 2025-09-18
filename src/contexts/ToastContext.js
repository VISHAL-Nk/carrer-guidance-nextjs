"use client";
import { createContext, useContext, useMemo, useState } from "react";

const ToastCtx = createContext({ notify: () => {} });

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function notify(message, opts = {}) {
    const id = Math.random().toString(36).slice(2);
    const ttl = opts.ttl ?? 3500;
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ttl);
  }

  const value = useMemo(() => ({ notify }), []);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="bg-black text-white px-4 py-2 rounded shadow">
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() { return useContext(ToastCtx); }
