'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { initialCategories } from '@/lib/mockData';
import { apiFetch } from '@/lib/api';
import { Plus, X, Check, Smartphone, Monitor, Headphones, Mouse, UploadCloud } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', slug: '', image: '', isActive: true });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

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

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setEditForm({
      name: cat.name || '',
      slug: cat.slug || '',
      image: cat.image || '',
      isActive: cat.isActive !== false,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    setSaving(true);

    try {
      const res = await apiFetch(`/api/categories/${editingCategory._id}`, {
        method: 'PUT',
        body: JSON.stringify(editForm),
      });

      const updated = res.category || { ...editingCategory, ...editForm };
      setCategories(prev => prev.map(c => c._id === editingCategory._id ? updated : c));
      setSuccessMsg('Category updated successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        setEditingCategory(null);
      }, 1000);
    } catch (err) {
      const updated = { ...editingCategory, ...editForm };
      setCategories(prev => prev.map(c => c._id === editingCategory._id ? updated : c));
      setEditingCategory(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await apiFetch(`/api/categories/${id}`, { method: 'DELETE' });
      } catch (e) {}
      setCategories(prev => prev.filter(c => c._id !== id));
    }
  };

  const getCategoryIcon = (slug = '') => {
    if (slug.includes('mobile')) return <Smartphone className="w-5 h-5 text-gray-500" />;
    if (slug.includes('desktop') || slug.includes('laptop')) return <Monitor className="w-5 h-5 text-gray-500" />;
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
                    <span className={`inline-flex items-center gap-1 font-semibold px-2.5 py-1 rounded-full text-[10px] ${
                      cat.isActive !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cat.isActive !== false ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      <span>{cat.isActive !== false ? 'Active' : 'Inactive'}</span>
                    </span>

                    <button
                      onClick={() => openEditModal(cat)}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-xs ml-3 transition-colors cursor-pointer"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="text-rose-500 hover:text-rose-700 font-semibold text-xs ml-3 transition-colors cursor-pointer"
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

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Edit Category</h3>
                <p className="text-xs text-gray-400">Update category title and icon</p>
              </div>
              <button
                onClick={() => setEditingCategory(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-gray-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setEditForm(prev => ({
                      ...prev,
                      name,
                      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                    }));
                  }}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-admin-primary text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category Slug</label>
                <input
                  type="text"
                  required
                  value={editForm.slug}
                  onChange={(e) => setEditForm(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-admin-primary text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category Icon / Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-gray-200 flex items-center justify-center overflow-hidden p-2">
                    {editForm.image ? (
                      <img src={editForm.image} alt="Preview" className="max-w-full max-h-full object-contain" />
                    ) : (
                      getCategoryIcon(editForm.slug)
                    )}
                  </div>
                  <label className="cursor-pointer px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors flex items-center gap-2">
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload New Image</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="catActive"
                  checked={editForm.isActive}
                  onChange={(e) => setEditForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-admin-primary rounded border-gray-300"
                />
                <label htmlFor="catActive" className="text-slate-700 font-semibold cursor-pointer">
                  Category is Active &amp; Shown in Storefront Navigation
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-admin-primary hover:bg-admin-hover text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
