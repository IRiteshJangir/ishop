'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initialCategories, initialBrands, initialColors } from '@/lib/mockData';
import { apiFetch, uploadImage, getImageUrl } from '@/lib/api';
import { 
  UploadCloud, Bold, Italic, Underline, Strikethrough, AlignLeft, 
  AlignCenter, AlignRight, List, ListOrdered, Link2, Image as ImageIcon, 
  Code, Undo, Redo, Table, CheckCircle2, ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';

export default function CreateNewProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState(initialCategories);
  const [brands, setBrands] = useState(initialBrands);
  const [colors, setColors] = useState(initialColors);

  // Form fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [originalPrice, setOriginalPrice] = useState(200);
  const [discount, setDiscount] = useState(5);
  const [categoryName, setCategoryName] = useState('Mobile phone');
  const [brandName, setBrandName] = useState('Apple');
  const [selectedColor, setSelectedColor] = useState('Space Gray');
  const [teaserText, setTeaserText] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto calculate final price
  const calculatedFinalPrice = (originalPrice * (1 - discount / 100)).toFixed(2);

  const handleNameChange = (val) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadingImage(true);
      setErrorMsg('');
      try {
        const url = await uploadImage(file);
        if (url) {
          setThumbnail(url);
        }
      } catch (err) {
        setErrorMsg('Failed to upload image. Please try again.');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    const payload = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      originalPrice: Number(originalPrice),
      discount: Number(discount),
      finalPrice: Number(calculatedFinalPrice),
      categoryName,
      brandName,
      colorNames: [selectedColor],
      teaserText,
      description,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    };

    try {
      await apiFetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setSuccess(true);
      setTimeout(() => router.push('/admin/products'), 1000);
    } catch (e) {
      setErrorMsg(e.message || 'Failed to create product');
    } finally {
      setSaving(false);
    }
  };

  const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;
  const charCount = description.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/admin/products" className="text-xs text-gray-500 hover:text-admin-primary flex items-center gap-1.5 font-semibold">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Products List
      </Link>

      {/* Main Container matching create_new_products.png */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 shadow-sm space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-slate-800">Create New Product</h1>
          <p className="text-xs text-gray-400 mt-1">
            Fill in the details below to add a new product to your digital catalog
          </p>
        </div>

        {success && (
          <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Product published to catalog successfully!
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          
          {/* Top 2-Column: Left Inputs + Right Thumbnail */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Left Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="eg. Wireless Noise Canceling Headphones"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-admin-primary text-slate-800"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">Slug (URL Friendly)</label>
                <input
                  type="text"
                  required
                  placeholder="eg. wireless-headphones-anc"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-admin-primary text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    required
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-admin-primary text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Discount (%)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-admin-primary text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">Calculated Final Price ($)</label>
                <input
                  type="text"
                  readOnly
                  value={`$${calculatedFinalPrice}`}
                  className="w-full bg-slate-100 border border-gray-200 rounded-xl px-4 py-2.5 outline-none font-bold text-slate-900 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Right Thumbnail Upload Box */}
            <div>
              <label className="block text-gray-600 font-semibold mb-1">Product Thumbnail Image</label>
              <label className="border-2 border-dashed border-gray-200 hover:border-admin-primary rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 min-h-[220px]">
                <input type="file" accept="image/*" disabled={uploadingImage} onChange={handleImageUpload} className="hidden" />
                {uploadingImage ? (
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="w-8 h-8 border-2 border-admin-primary border-t-transparent rounded-full animate-spin mb-2" />
                    <p className="text-xs font-semibold text-admin-primary">Uploading image...</p>
                  </div>
                ) : thumbnail ? (
                  <img src={getImageUrl(thumbnail)} alt="Preview" className="h-40 object-contain rounded-xl" />
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-slate-700 text-xs">Click to upload</p>
                    <p className="text-[10px] text-gray-400 text-center mt-1">
                      PNG, JPG, or WEBP accepted. Drag and drop also works. (Max 10MB)
                    </p>
                  </>
                )}
              </label>
            </div>

          </div>

          {/* 3 Dropdowns Row: Category, Brand, Available Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-600 font-semibold mb-1">Category</label>
              <select
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-admin-primary text-slate-800 cursor-pointer"
              >
                {categories.map(c => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Brand</label>
              <select
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-admin-primary text-slate-800 cursor-pointer"
              >
                {brands.map(b => (
                  <option key={b._id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Available Product Colors</label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-admin-primary text-slate-800 cursor-pointer"
              >
                {colors.map(col => (
                  <option key={col._id} value={col.name}>{col.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Listing Teaser Text */}
          <div>
            <label className="block text-gray-600 font-semibold mb-1">Listing Teaser Text (Short Description)</label>
            <textarea
              rows={2}
              placeholder="A punchy 1-2 sentence hook (Max 200 chars)"
              value={teaserText}
              onChange={(e) => setTeaserText(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-admin-primary text-slate-800"
            />
          </div>

          {/* Detailed Product Specifications & Story with Rich Editor Toolbar */}
          <div className="space-y-2">
            <label className="block text-gray-600 font-semibold">Detailed Product Specifications &amp; Story</label>
            
            {/* Rich Editor Toolbar matching create_new_products.png */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-slate-50 text-gray-600 text-xs">
                <button type="button" className="p-1.5 hover:bg-white rounded hover:text-slate-900 font-bold"><Bold className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1.5 hover:bg-white rounded hover:text-slate-900 italic"><Italic className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1.5 hover:bg-white rounded hover:text-slate-900 underline"><Underline className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1.5 hover:bg-white rounded hover:text-slate-900 line-through"><Strikethrough className="w-3.5 h-3.5" /></button>
                <span className="w-px h-4 bg-gray-300 mx-1" />
                <button type="button" className="p-1.5 hover:bg-white rounded hover:text-slate-900"><AlignLeft className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1.5 hover:bg-white rounded hover:text-slate-900"><AlignCenter className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1.5 hover:bg-white rounded hover:text-slate-900"><AlignRight className="w-3.5 h-3.5" /></button>
                <span className="w-px h-4 bg-gray-300 mx-1" />
                <button type="button" className="p-1.5 hover:bg-white rounded hover:text-slate-900"><List className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1.5 hover:bg-white rounded hover:text-slate-900"><ListOrdered className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1.5 hover:bg-white rounded hover:text-slate-900"><Table className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1.5 hover:bg-white rounded hover:text-slate-900"><Link2 className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1.5 hover:bg-white rounded hover:text-slate-900"><ImageIcon className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1.5 hover:bg-white rounded hover:text-slate-900"><Code className="w-3.5 h-3.5" /></button>
                <span className="w-px h-4 bg-gray-300 mx-1" />
                <button type="button" className="p-1.5 hover:bg-white rounded hover:text-slate-900"><Undo className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1.5 hover:bg-white rounded hover:text-slate-900"><Redo className="w-3.5 h-3.5" /></button>
              </div>

              {/* Textarea */}
              <textarea
                rows={6}
                placeholder="Start writing detailed product specifications, highlights, warranty, and features..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-4 outline-none text-xs text-slate-800 resize-y"
              />

              {/* Bottom status bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-t border-gray-100 text-[10px] text-gray-400 font-mono">
                <span>CHARS {charCount} | WORDS {wordCount}</span>
                <span>POWERED BY EDIT</span>
              </div>
            </div>
          </div>

          {/* Action buttons matching create_new_products.png */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="px-6 py-2.5 border border-gray-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold text-xs transition-colors"
            >
              Discard Draft
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-admin-primary hover:bg-admin-hover text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md"
            >
              {saving ? 'Saving...' : 'Confirm & Save Product'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
