'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { initialColors } from '@/lib/mockData';
import { apiFetch } from '@/lib/api';
import { Plus } from 'lucide-react';

export default function AdminColorsPage() {
  const [colors, setColors] = useState(initialColors);

  useEffect(() => {
    apiFetch('/api/colors')
      .then(res => {
        if (res.colors) setColors(res.colors);
      })
      .catch(() => setColors(initialColors));
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this color?')) {
      try {
        await apiFetch(`/api/colors/${id}`, { method: 'DELETE' });
      } catch (e) {}
      setColors(prev => prev.filter(c => c._id !== id));
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar matching product_color.png */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Colors</h1>
        <Link
          href="/admin/colors/add"
          className="px-5 py-2.5 bg-admin-primary hover:bg-admin-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Color</span>
        </Link>
      </div>

      {/* Table Card matching product_color.png */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <th className="py-4 px-6">HEXCOLOR</th>
                <th className="py-4 px-6">NAME</th>
                <th className="py-4 px-6">SLUG</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {colors.map((col) => (
                <tr key={col._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div
                        style={{ backgroundColor: col.hexColor }}
                        className="w-6 h-6 rounded-md shadow-sm border border-gray-200"
                      />
                      <span className="font-mono text-gray-400 text-xs">{col.hexColor}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6 font-bold text-slate-900 text-sm">
                    {col.name}
                  </td>

                  <td className="py-4 px-6 text-gray-400 font-mono text-xs">
                    {col.slug}
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
                      onClick={() => handleDelete(col._id)}
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
