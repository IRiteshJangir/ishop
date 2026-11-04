'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { initialColors } from '@/lib/mockData';
import { apiFetch } from '@/lib/api';
import { Plus, X, Check, Palette } from 'lucide-react';

export default function AdminColorsPage() {
  const [colors, setColors] = useState(initialColors);
  const [editingColor, setEditingColor] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', slug: '', hex: '#000000', isActive: true });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    apiFetch('/api/colors')
      .then(res => {
        if (res.colors) setColors(res.colors);
      })
      .catch(() => setColors(initialColors));
  }, []);

  const openEditModal = (col) => {
    setEditingColor(col);
    setErrorMsg('');
    setEditForm({
      name: col.name || '',
      slug: col.slug || '',
      hex: col.hexColor || col.hex || '#000000',
      isActive: col.isActive !== false,
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingColor) return;
    setSaving(true);
    setErrorMsg('');

    try {
      const payload = {
        name: editForm.name,
        slug: editForm.slug,
        hexColor: editForm.hex,
        hex: editForm.hex,
        isActive: editForm.isActive,
      };

      const res = await apiFetch(`/api/colors/${editingColor._id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      const updated = res.color || { ...editingColor, ...payload };
      setColors(prev => prev.map(c => c._id === editingColor._id ? updated : c));
      setSuccessMsg('Color updated successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        setEditingColor(null);
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update color on server');
    } finally {
      setSaving(false);
    }
  };

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
                        className="w-7 h-7 rounded-full border border-gray-200 shadow-inner"
                        style={{ backgroundColor: col.hexColor || col.hex }}
                      />
                      <span className="font-mono text-xs font-bold text-slate-700">{col.hexColor || col.hex}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6 font-bold text-slate-900 text-sm">
                    {col.name}
                  </td>

                  <td className="py-4 px-6 text-gray-400 font-mono text-xs">
                    {col.slug}
                  </td>

                  <td className="py-4 px-6 text-right space-x-3">
                    <span className={`inline-flex items-center gap-1 font-semibold px-2.5 py-1 rounded-full text-[10px] ${
                      col.isActive !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${col.isActive !== false ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      <span>{col.isActive !== false ? 'Active' : 'Inactive'}</span>
                    </span>

                    <button
                      onClick={() => openEditModal(col)}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-xs ml-3 transition-colors cursor-pointer"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(col._id)}
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

      {/* Edit Color Modal */}
      {editingColor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Edit Color</h3>
                <p className="text-xs text-gray-400">Update color swatch and hex code</p>
              </div>
              <button
                onClick={() => setEditingColor(null)}
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

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Color Name</label>
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
                <label className="block text-slate-700 font-semibold mb-1">Color Slug</label>
                <input
                  type="text"
                  required
                  value={editForm.slug}
                  onChange={(e) => setEditForm(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-admin-primary text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Hex Color Code</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={editForm.hex}
                    onChange={(e) => setEditForm(prev => ({ ...prev, hex: e.target.value }))}
                    className="w-12 h-12 rounded-xl border border-gray-200 cursor-pointer p-0.5 bg-transparent"
                  />
                  <input
                    type="text"
                    required
                    value={editForm.hex}
                    onChange={(e) => setEditForm(prev => ({ ...prev, hex: e.target.value }))}
                    className="flex-1 bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-admin-primary text-slate-800 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="colorActive"
                  checked={editForm.isActive}
                  onChange={(e) => setEditForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-admin-primary rounded border-gray-300"
                />
                <label htmlFor="colorActive" className="text-slate-700 font-semibold cursor-pointer">
                  Color is Active &amp; Selectable in Storefront
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingColor(null)}
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
