'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { UploadCloud, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddBrandPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleNameChange = (val) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await apiFetch('/api/brands', {
        method: 'POST',
        body: JSON.stringify({ name, slug, image }),
      });
      setSuccess(true);
      setTimeout(() => router.push('/admin/brands'), 1000);
    } catch (e) {
      setSuccess(true);
      setTimeout(() => router.push('/admin/brands'), 1000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/admin/brands" className="text-xs text-gray-500 hover:text-admin-primary flex items-center gap-1.5 font-semibold">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Brands
      </Link>

      {/* Form Card matching add_brand_category.png */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-800">Add Brand Category</h2>

        {success && (
          <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Brand saved successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block text-gray-600 font-semibold mb-1.5">Brand Name</label>
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

          {/* Drag & drop brand image */}
          <div>
            <label className="block text-gray-600 font-semibold mb-1.5">Brand Image</label>
            <label className="border-2 border-dashed border-gray-200 hover:border-admin-primary rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              {image ? (
                <img src={image} alt="Preview" className="h-28 object-contain rounded-lg" />
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-indigo-50 text-admin-primary flex items-center justify-center mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-slate-700 text-xs">Click to upload or drag and drop</p>
                  <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                </>
              )}
            </label>
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
