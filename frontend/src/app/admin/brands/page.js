'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { initialBrands } from '@/lib/mockData';
import { apiFetch } from '@/lib/api';
import { Plus } from 'lucide-react';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState(initialBrands);

  useEffect(() => {
    apiFetch('/api/brands')
      .then(res => {
        if (res.brands) setBrands(res.brands);
      })
      .catch(() => setBrands(initialBrands));
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this brand?')) {
      try {
        await apiFetch(`/api/brands/${id}`, { method: 'DELETE' });
      } catch (e) {}
      setBrands(prev => prev.filter(b => b._id !== id));
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar matching brands.png */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Brands</h1>
        <Link
          href="/admin/brands/add"
          className="px-5 py-2.5 bg-admin-primary hover:bg-admin-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Brand</span>
        </Link>
      </div>

      {/* Table Card matching brands.png */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <th className="py-4 px-6">IMAGE</th>
                <th className="py-4 px-6">NAME</th>
                <th className="py-4 px-6">SLUG</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {brands.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="w-12 h-10 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center overflow-hidden p-2">
                      {b.image ? (
                        <img src={b.image} alt={b.name} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <span className="font-black text-slate-400 text-xs">{b.name.charAt(0)}</span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-6 font-bold text-slate-900 text-sm">
                    {b.name}
                  </td>

                  <td className="py-4 px-6 text-gray-400 font-mono text-xs">
                    {b.slug}
                  </td>

                  <td className="py-4 px-6 text-right space-x-3">
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Active</span>
                    </span>

                    <button className="text-blue-600 hover:underline font-semibold text-xs ml-3">
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(b._id)}
                      className="text-rose-500 hover:underline font-semibold text-xs ml-3"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
