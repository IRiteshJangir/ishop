'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { initialCategories } from '@/lib/mockData';
import { apiFetch } from '@/lib/api';
import { Plus, Edit2, Trash2, Smartphone, Monitor, Headphones, Mouse } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiFetch('/api/categories')
      .then(res => {
        if (res.categories) setCategories(res.categories);
      })
      .catch(() => {
        setCategories(initialCategories);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await apiFetch(`/api/categories/${id}`, { method: 'DELETE' });
      } catch (e) {
        // Fallback local deletion
      }
      setCategories(prev => prev.filter(c => c._id !== id));
    }
  };

  const getCategoryIcon = (slug) => {
    if (slug.includes('mobile')) return <Smartphone className="w-5 h-5 text-gray-500" />;
    if (slug.includes('desktop')) return <Monitor className="w-5 h-5 text-gray-500" />;
    if (slug.includes('headphone')) return <Headphones className="w-5 h-5 text-gray-500" />;
    return <Mouse className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar matching admin_category.png */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Categories</h1>
        <Link
          href="/admin/categories/add"
          className="px-5 py-2.5 bg-admin-primary hover:bg-admin-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Category</span>
        </Link>
      </div>

      {/* Table Card */}
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
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center overflow-hidden p-1">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
                      ) : (
                        getCategoryIcon(cat.slug)
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-6 font-bold text-slate-900 text-sm">
                    {cat.name}
                  </td>

                  <td className="py-4 px-6 text-gray-400 font-mono text-xs">
                    {cat.slug}
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
                      onClick={() => handleDelete(cat._id)}
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
