'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { initialProducts, initialCategories, initialBrands } from '@/lib/mockData';
import { apiFetch, uploadImage, getImageUrl } from '@/lib/api';
import { Plus, Eye, Trash2, Edit2, Image as ImageIcon, X, Check, UploadCloud } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [brands, setBrands] = useState(initialBrands);

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    slug: '',
    originalPrice: 0,
    discount: 0,
    finalPrice: 0,
    categoryName: '',
    brandName: '',
    countInStock: 25,
    thumbnail: '',
    description: '',
    isActive: true,
    isTopSelling: false,
  });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    apiFetch('/api/products')
      .then(res => {
        if (res.products) setProducts(res.products);
      })
      .catch(() => setProducts(initialProducts));

    apiFetch('/api/categories')
      .then(res => {
        if (res.categories) setCategories(res.categories);
      })
      .catch(() => {});

    apiFetch('/api/brands')
      .then(res => {
        if (res.brands) setBrands(res.brands);
      })
      .catch(() => {});
  }, []);

  const openEditModal = (p) => {
    setEditingProduct(p);
    setErrorMsg('');
    const orig = Number(p.originalPrice) || 0;
    const disc = Number(p.discount) || 0;
    const fin = p.finalPrice !== undefined ? Number(p.finalPrice) : Number((orig * (1 - disc / 100)).toFixed(2));

    setEditForm({
      name: p.name || '',
      slug: p.slug || '',
      originalPrice: orig,
      discount: disc,
      finalPrice: fin,
      categoryName: p.categoryName || '',
      brandName: p.brandName || '',
      countInStock: p.countInStock !== undefined ? p.countInStock : 25,
      thumbnail: p.thumbnail || '',
      description: p.description || '',
      isActive: p.isActive !== false,
      isTopSelling: !!p.isTopSelling,
    });
  };

  const handlePriceChange = (orig, disc) => {
    const o = Number(orig) || 0;
    const d = Number(disc) || 0;
    const fin = Number((o * (1 - d / 100)).toFixed(2));
    setEditForm(prev => ({
      ...prev,
      originalPrice: o,
      discount: d,
      finalPrice: fin,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadingImage(true);
      setErrorMsg('');
      try {
        const url = await uploadImage(file);
        if (url) {
          setEditForm(prev => ({ ...prev, thumbnail: url }));
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
    if (!editingProduct) return;
    setSaving(true);
    setErrorMsg('');

    try {
      const res = await apiFetch(`/api/products/${editingProduct._id}`, {
        method: 'PUT',
        body: JSON.stringify(editForm),
      });

      const updated = res.product || { ...editingProduct, ...editForm };
      setProducts(prev => prev.map(p => p._id === editingProduct._id ? updated : p));
      setSuccessMsg('Product updated successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        setEditingProduct(null);
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update product on server');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
      } catch (e) {}
      setProducts(prev => prev.filter(p => p._id !== id));
    }
  };

  const toggleTopSelling = async (p) => {
    const nextVal = !p.isTopSelling;
    setProducts(prev => prev.map(item => item._id === p._id ? { ...item, isTopSelling: nextVal } : item));
    try {
      await apiFetch(`/api/products/${p._id}`, {
        method: 'PUT',
        body: JSON.stringify({ isTopSelling: nextVal }),
      });
    } catch (e) {}
  };

  const toggleActive = async (p) => {
    const nextVal = p.isActive === false ? true : false;
    setProducts(prev => prev.map(item => item._id === p._id ? { ...item, isActive: nextVal } : item));
    try {
      await apiFetch(`/api/products/${p._id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: nextVal }),
      });
    } catch (e) {}
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar matching admin_product.png */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Products</h1>
        <Link
          href="/admin/products/add"
          className="px-5 py-2.5 bg-admin-primary hover:bg-admin-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Product</span>
        </Link>
      </div>

      {/* Table Card matching admin_product.png */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <th className="py-4 px-6">IMAGE</th>
                <th className="py-4 px-6">NAME</th>
                <th className="py-4 px-6">PRICE</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center overflow-hidden p-1">
                      <img src={getImageUrl(p.thumbnail)} alt={p.name} className="w-full h-full object-contain" />
                    </div>
                  </td>

                  <td className="py-4 px-6 font-bold text-slate-900 text-sm max-w-xs truncate">
                    {p.name}
                  </td>

                  {/* PRICE format: original | discount% | final */}
                  <td className="py-4 px-6 font-mono text-xs text-slate-700 whitespace-nowrap">
                    ${p.originalPrice} | {p.discount}% | ${p.finalPrice}
                  </td>

                  {/* Action Badges matching admin_product.png */}
                  <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                    {/* Active / Inactive badge */}
                    <button
                      onClick={() => toggleActive(p)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded transition-colors cursor-pointer ${
                        p.isActive !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {p.isActive !== false ? 'Active' : 'Inactive'}
                    </button>

                    {/* Stock badge */}
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      Stock ({p.countInStock !== undefined ? p.countInStock : 25})
                    </span>

                    {/* Top Selling / Not Top Selling badge */}
                    <button
                      onClick={() => toggleTopSelling(p)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded transition-colors cursor-pointer ${
                        p.isTopSelling ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {p.isTopSelling ? 'Top Selling' : 'Not Top Selling'}
                    </button>

                    {/* Edit button */}
                    <button
                      onClick={() => openEditModal(p)}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-xs ml-2 cursor-pointer transition-colors"
                    >
                      Edit
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-rose-500 hover:text-rose-700 font-semibold text-xs ml-2 cursor-pointer transition-colors"
                    >
                      Delete
                    </button>

                    {/* View storefront link */}
                    <Link
                      href={`/product/${p.slug}`}
                      className="text-gray-500 hover:text-slate-800 font-semibold text-xs ml-2 transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-base font-bold text-slate-900">Edit Product</h3>
                <p className="text-xs text-gray-400">Update specifications, pricing, and catalog details</p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
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
                <label className="block text-slate-700 font-semibold mb-1">Product Title</label>
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
                <label className="block text-slate-700 font-semibold mb-1">Slug (URL friendly)</label>
                <input
                  type="text"
                  required
                  value={editForm.slug}
                  onChange={(e) => setEditForm(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-admin-primary text-slate-800 font-mono"
                />
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/70 p-4 rounded-2xl border border-gray-100">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editForm.originalPrice}
                    onChange={(e) => handlePriceChange(e.target.value, editForm.discount)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-admin-primary text-slate-800 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editForm.discount}
                    onChange={(e) => handlePriceChange(editForm.originalPrice, e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-admin-primary text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Final Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    readOnly
                    value={editForm.finalPrice}
                    className="w-full bg-slate-100 border border-gray-200 rounded-xl px-3 py-2 outline-none text-emerald-600 font-mono font-bold cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Category, Brand, Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={editForm.categoryName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, categoryName: e.target.value }))}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-admin-primary text-slate-800 cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c._id || c.slug} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Brand</label>
                  <select
                    value={editForm.brandName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, brandName: e.target.value }))}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-admin-primary text-slate-800 cursor-pointer"
                  >
                    <option value="">Select Brand</option>
                    {brands.map(b => (
                      <option key={b._id || b.slug} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={editForm.countInStock}
                    onChange={(e) => setEditForm(prev => ({ ...prev, countInStock: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-admin-primary text-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Image Upload / Preview */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Thumbnail Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-gray-200 flex items-center justify-center overflow-hidden p-1.5 flex-shrink-0">
                    {editForm.thumbnail ? (
                      <img src={getImageUrl(editForm.thumbnail)} alt="Preview" className="w-full h-full object-contain" />
                    ) : (
                      <UploadCloud className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      placeholder="Image URL (https://... or /uploads/...)"
                      value={editForm.thumbnail}
                      onChange={(e) => setEditForm(prev => ({ ...prev, thumbnail: e.target.value }))}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-admin-primary text-slate-800 font-mono text-[11px]"
                    />
                    <label className="inline-flex items-center gap-1.5 text-[11px] text-admin-primary font-bold cursor-pointer hover:underline">
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Uploading image...' : 'Or upload image file'}</span>
                      <input type="file" accept="image/*" disabled={uploadingImage} onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-admin-primary text-slate-800"
                />
              </div>

              {/* Status Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editForm.isActive}
                    onChange={(e) => setEditForm(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-admin-primary rounded border-gray-300"
                  />
                  <span>Active in Store</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editForm.isTopSelling}
                    onChange={(e) => setEditForm(prev => ({ ...prev, isTopSelling: e.target.checked }))}
                    className="w-4 h-4 text-purple-600 rounded border-gray-300"
                  />
                  <span>Top Selling Badge</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
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
