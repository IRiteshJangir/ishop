'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, ShieldCheck, Lock, CreditCard } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password);
    if (result.success) {
      router.push('/profile');
    } else {
      setError(result.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-6">
        
        {/* Breadcrumbs */}
        <nav className="text-xs text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-gray-400">pages</span>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Register</span>
        </nav>

        {/* 2-Column Split: Illustration + Form */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-14 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
          
          {/* Left: Graphic Illustration matching registration.jpg */}
          <div className="bg-gradient-to-br from-teal-50/60 to-emerald-50/40 rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden border border-teal-100/50 min-h-[380px]">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner">
              <ShieldCheck className="w-12 h-12 text-primary" />
            </div>

            <div className="flex items-center gap-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-sm border border-gray-100 mb-4">
              <CreditCard className="w-5 h-5 text-teal-600" />
              <span className="font-mono text-xs font-bold text-slate-800">XXXX - XXXX - XXXX - XXXX</span>
            </div>

            <h4 className="font-extrabold text-sm text-slate-800">Fast 1-Minute Registration</h4>
            <p className="text-[11px] text-gray-500 mt-1 max-w-xs">
              Join thousands of members enjoying free shipping, verified warranty, and priority customer service.
            </p>

            <div className="mt-4 flex items-center gap-2 text-[10px] text-primary font-bold bg-white px-3 py-1 rounded-full border border-teal-100">
              <Lock className="w-3 h-3" />
              <span>Safe Data Protection Guarantee</span>
            </div>
          </div>

          {/* Right: Register Form */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-primary tracking-tight">Register</h2>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-0.5">
                JOIN TO US
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Your name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jhon Deo"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Example@gmail.com"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary text-slate-800 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary text-slate-800"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold uppercase text-xs tracking-wider transition-all shadow-md"
              >
                {loading ? 'REGISTERING...' : 'REGISTER'}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-xs font-bold text-slate-500 hover:text-primary transition-colors"
                >
                  ALREADY USER ? <span className="text-primary underline">LOGIN</span>
                </Link>
              </div>
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
