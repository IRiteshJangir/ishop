'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { initialProducts, initialCategories } from '@/lib/mockData';
import { 
  DollarSign, ShoppingCart, Package, Users, ArrowUpRight, 
  ArrowRight, Plus, CheckCircle2 
} from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Total Revenue', value: '$84,250.00', icon: DollarSign, change: '+14.2%', bg: 'bg-emerald-50 text-emerald-600' },
    { label: 'Total Orders', value: '148', icon: ShoppingCart, change: '+8.1%', bg: 'bg-blue-50 text-blue-600' },
    { label: 'Active Products', value: initialProducts.length.toString(), icon: Package, change: '+3 new', bg: 'bg-indigo-50 text-indigo-600' },
    { label: 'Total Customers', value: '2,420', icon: Users, change: '+12.4%', bg: 'bg-amber-50 text-amber-600' },
  ];

  const recentOrders = [
    { id: '#ORD-9842', customer: 'Mark Cole', items: 'Pinneaple Macbook Pro 2022', total: '$1,746.50', status: 'Processing' },
    { id: '#ORD-9841', customer: 'Sarah Jenkins', items: 'Samsung Galaxy S24 Ultra', total: '$1,169.10', status: 'Shipped' },
    { id: '#ORD-9840', customer: 'Alex Rivera', items: 'Sony WH-1000XM5 Wireless', total: '$398.00', status: 'Delivered' },
    { id: '#ORD-9839', customer: 'Emily Watson', items: 'iPhone 15 Pro Max (256GB)', total: '$1,259.10', status: 'Delivered' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-xs text-gray-500 mt-0.5">Welcome back! Here is what is happening with SWOO Tech Mart today.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/add"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-admin-primary hover:bg-admin-hover text-white text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Product</span>
          </Link>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{s.label}</span>
                <div className={`p-2 rounded-xl ${s.bg}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{s.value}</p>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{s.change} from last month</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders Table (Cols 1-2) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900">Recent Customer Orders</h3>
            <Link href="/admin/orders" className="text-xs font-bold text-admin-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-extrabold uppercase text-gray-400">
                  <th className="py-2.5">ORDER ID</th>
                  <th className="py-2.5">CUSTOMER</th>
                  <th className="py-2.5">PRODUCTS</th>
                  <th className="py-2.5">TOTAL</th>
                  <th className="py-2.5">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((ord, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 font-mono font-bold text-slate-900">{ord.id}</td>
                    <td className="py-3 font-semibold text-slate-800">{ord.customer}</td>
                    <td className="py-3 text-gray-500 truncate max-w-xs">{ord.items}</td>
                    <td className="py-3 font-black text-slate-900">{ord.total}</td>
                    <td className="py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ord.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' :
                        ord.status === 'Shipped' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 pb-3 border-b border-gray-100">Catalog Actions</h3>

          <div className="space-y-2.5">
            <Link
              href="/admin/products/add"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-admin-primary transition-all text-xs font-bold text-slate-700"
            >
              <span>+ Create New Product</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              href="/admin/categories/add"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-admin-primary transition-all text-xs font-bold text-slate-700"
            >
              <span>+ Add New Category</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              href="/admin/colors/add"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-admin-primary transition-all text-xs font-bold text-slate-700"
            >
              <span>+ Add New Color</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              href="/admin/brands/add"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-admin-primary transition-all text-xs font-bold text-slate-700"
            >
              <span>+ Add Brand Category</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
