'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { initialProducts } from '@/lib/mockData';
import { apiFetch } from '@/lib/api';
import { Plus, Eye, Trash2, Edit2, Image as ImageIcon } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    apiFetch('/api/products')
      .then(res => {
        if (res.products) setProducts(res.products);
      })
      .catch(() => setProducts(initialProducts));
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
      } catch (e) {}
      setProducts(prev => prev.filter(p => p._id !== id));
    }
  };

  const toggleTopSelling = (id) => {
    setProducts(prev => prev.map(p => {
      if (p._id === id) return { ...p, isTopSelling: !p.isTopSelling };
      return p;
    }));
  };

  const toggleActive = (id) => {
    setProducts(prev => prev.map(p => {
      if (p._id === id) return { ...p, isActive: !p.isActive };
      return p;
    }));
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
                      <img src={p.thumbnail} alt={p.name} className="w-full h-full object-contain" />
                    </div>
                  </td>

                  <td className="py-4 px-6 font-bold text-slate-900 text-sm">
                    {p.name}
                  </td>

                  {/* PRICE format: original | discount% | final */}
                  <td className="py-4 px-6 font-mono text-xs text-slate-700">
                    {p.originalPrice} | {p.discount}% |{p.finalPrice}
                  </td>

                  {/* Action Badges matching admin_product.png */}
                  <td className="py-4 px-6 text-right space-x-2">
                    {/* Active / Inactive badge */}
                    <button
                      onClick={() => toggleActive(p._id)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded transition-colors ${
                        p.isActive !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {p.isActive !== false ? 'Active' : 'Inactive'}
                    </button>

                    {/* Stock badge */}
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      Stock
                    </span>

                    {/* Top Selling / Not Top Selling badge */}
                    <button
                      onClick={() => toggleTopSelling(p._id)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded transition-colors ${
                        p.isTopSelling ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {p.isTopSelling ? 'Top Selling' : 'Not Top Selling'}
                    </button>

                    {/* Edit button */}
                    <button className="text-blue-600 hover:underline font-semibold text-xs ml-2">
                      Edit
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-rose-500 hover:underline font-semibold text-xs ml-2"
                    >
                      Delete
                    </button>

                    {/* View storefront link */}
                    <Link
                      href={`/product/${p.slug}`}
                      className="text-gray-500 hover:text-slate-800 font-semibold text-xs ml-2"
                    >
                      View
                    </Link>

                    {/* Image icon link */}
                    <button
                      onClick={() => alert(`Product image URL:\n${p.thumbnail}`)}
                      className="text-gray-400 hover:text-slate-800 text-xs ml-2"
                    >
                      Image
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
