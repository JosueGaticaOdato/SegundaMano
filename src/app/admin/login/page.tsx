"use client";

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldAlert } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Contraseña incorrecta');
      }
    } catch (err) {
      console.error(err);
      setError('Error de red al intentar ingresar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow w-full purple-dot-bg flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md bg-white border-4 border-on-background p-8 brutal-shadow relative">
        {/* Decorative Badge */}
        <div className="absolute -top-5 left-6 bg-secondary-fixed text-on-background font-headline text-xs font-black uppercase tracking-wider px-4 py-2 border-2 border-on-background shadow-[3px_3px_0px_rgba(0,0,0,1)] -rotate-2">
          ZONA RESTRINGIDA
        </div>

        <div className="text-center mt-4 mb-8">
          <h1 className="font-headline text-3xl font-black uppercase tracking-tight text-on-background">
            Panel de Control
          </h1>
          <p className="font-sans text-sm text-on-surface-variant font-medium mt-1">
            Ingresa la clave de administrador para continuar
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="font-label text-xs uppercase font-bold text-on-background" htmlFor="password">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border-4 border-on-background p-4 pl-12 font-sans font-medium focus:bg-white focus:outline-none transition-colors"
                required
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
            </div>
          </div>

          {error && (
            <div className="bg-tertiary text-white border-2 border-on-background p-4 font-sans text-xs font-semibold flex items-center gap-2 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary-fixed hover:bg-secondary-fixed/90 text-on-background font-headline text-sm font-black uppercase border-4 border-on-background py-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer text-center font-bold"
          >
            {loading ? 'INGRESANDO...' : 'INGRESAR AL PANEL'}
          </button>
        </form>
      </div>
    </div>
  );
}
