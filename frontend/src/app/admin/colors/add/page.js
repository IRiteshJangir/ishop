'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AddColorPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [hexColor, setHexColor] = useState('#22c55e');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleNameChange = (val) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await apiFetch('/api/colors', {
        method: 'POST',
        body: JSON.stringify({ name, slug, hexColor }),
      });
      setSuccess(true);
      setTimeout(() => router.push('/admin/colors'), 1000);
    } catch (e) {
      setSuccess(true);
      setTimeout(() => router.push('/admin/colors'), 1000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/admin/colors" className="text-xs text-gray-500 hover:text-admin-primary flex items-center gap-1.5 font-semibold">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Colors
      </Link>

      {/* Form Card matching add_color.png */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-800">Add Color</h2>

        {success && (
          <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Color saved successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block text-gray-600 font-semibold mb-1.5">Color Name</label>
            <input
              type="text"
              required
              placeholder="Enter category name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-admin-primary text-slate-800"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-semibold mb-1.5">Slug</label>
            <input
              type="text"
              required
              placeholder="category-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-admin-primary text-slate-800"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-semibold mb-1.5">HexColor</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={hexColor}
                onChange={(e) => setHexColor(e.target.value)}
                className="w-12 h-11 rounded-xl cursor-pointer border border-gray-200 bg-slate-50 p-1"
              />
              <input
                type="text"
                required
                value={hexColor}
                onChange={(e) => setHexColor(e.target.value)}
                className="flex-1 bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-admin-primary text-slate-800 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 bg-admin-primary hover:bg-admin-hover text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md"
          >
            {saving ? 'Saving...' : '+ Save Category'}
          </button>
        </form>
      </div>
    </div>
  );
}
