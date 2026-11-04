'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { initialBrands } from '@/lib/mockData';
import { apiFetch, uploadImage, getImageUrl } from '@/lib/api';
import { Plus, X, Check, UploadCloud } from 'lucide-react';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState(initialBrands);
  const [editingBrand, setEditingBrand] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', slug: '', image: '', isActive: true });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    apiFetch('/api/brands')
      .then(res => {
        if (res.brands) setBrands(res.brands);
      })
      .catch(() => setBrands(initialBrands));
  }, []);

  const openEditModal = (brand) => {
    setEditingBrand(brand);
    setErrorMsg('');
    setEditForm({
      name: brand.name || '',
      slug: brand.slug || '',
      image: brand.image || '',
      isActive: brand.isActive !== false,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadingImage(true);
      setErrorMsg('');
      try {
        const url = await uploadImage(file);
        if (url) {
          setEditForm(prev => ({ ...prev, image: url }));
        }
      } catch (err) {
        setErrorMsg('Failed to upload image. Please try again.');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingBrand) return;
    setSaving(true);
    setErrorMsg('');

    try {
      const res = await apiFetch(`/api/brands/${editingBrand._id}`, {
        method: 'PUT',
        body: JSON.stringify(editForm),
      });

      const updated = res.brand || { ...editingBrand, ...editForm };
      setBrands(prev => prev.map(b => b._id === editingBrand._id ? updated : b));
      setSuccessMsg('Brand updated successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        setEditingBrand(null);
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update brand on server');
    } finally {
      setSaving(false);
    }
  };

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
                        <img src={getImageUrl(b.image)} alt={b.name} className="max-w-full max-h-full object-contain" />
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
                    <span className={`inline-flex items-center gap-1 font-semibold px-2.5 py-1 rounded-full text-[10px] ${
                      b.isActive !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${b.isActive !== false ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      <span>{b.isActive !== false ? 'Active' : 'Inactive'}</span>
                    </span>

                    <button
                      onClick={() => openEditModal(b)}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-xs ml-3 transition-colors cursor-pointer"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(b._id)}
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

      {/* Edit Brand Modal */}
      {editingBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Edit Brand</h3>
                <p className="text-xs text-gray-400">Update brand details and logo</p>
              </div>
              <button
                onClick={() => setEditingBrand(null)}
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
                <label className="block text-slate-700 font-semibold mb-1">Brand Name</label>
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
                <label className="block text-slate-700 font-semibold mb-1">Brand Slug</label>
                <input
                  type="text"
                  required
                  value={editForm.slug}
                  onChange={(e) => setEditForm(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-admin-primary text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Brand Logo / Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-gray-200 flex items-center justify-center overflow-hidden p-2">
                    {editForm.image ? (
                      <img src={getImageUrl(editForm.image)} alt="Preview" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <UploadCloud className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <label className="cursor-pointer px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors flex items-center gap-2">
                    <UploadCloud className="w-4 h-4" />
                    <span>{uploadingImage ? 'Uploading Logo...' : 'Upload New Logo'}</span>
                    <input type="file" accept="image/*" disabled={uploadingImage} onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="brandActive"
                  checked={editForm.isActive}
                  onChange={(e) => setEditForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-admin-primary rounded border-gray-300"
                />
                <label htmlFor="brandActive" className="text-slate-700 font-semibold cursor-pointer">
                  Brand is Active &amp; Visible in Storefront
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingBrand(null)}
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
