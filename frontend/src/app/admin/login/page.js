'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Shield, Lock, Eye, EyeOff, LayoutDashboard, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@ishop.com');
  const [password, setPassword] = useState('adminpassword123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      router.push('/admin');
    } else {
      setError(result.message || 'Invalid administrator credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 selection:bg-indigo-500 selection:text-white">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/5">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Admin Portal</h1>
            <p className="text-xs text-gray-400 mt-1">
              Secure Administrative Access &amp; Store Management
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 font-semibold mb-1.5">Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ishop.com"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-white placeholder-gray-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-white placeholder-gray-500 pr-10 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-admin-primary hover:bg-admin-hover text-white rounded-xl font-bold uppercase text-xs tracking-wider transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'AUTHENTICATING...' : 'SIGN IN TO DASHBOARD'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick preset credentials button for convenience */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-gray-400">
            <span>Preset Credentials:</span>
            <button
              type="button"
              onClick={() => { setEmail('admin@ishop.com'); setPassword('adminpassword123'); }}
              className="text-amber-400 hover:underline font-mono"
            >
              admin@ishop.com
            </button>
          </div>
        </div>

        {/* Back to storefront link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-white transition-colors underline"
          >
            ← Return to Customer Storefront
          </Link>
        </div>

      </div>
    </div>
  );
}
