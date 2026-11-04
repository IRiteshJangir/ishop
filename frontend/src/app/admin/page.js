'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { 
  DollarSign, ShoppingCart, Package, Users, ArrowUpRight, 
  ArrowRight, Plus, RefreshCw, Clock, ExternalLink 
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes, usersRes] = await Promise.allSettled([
        apiFetch('/api/orders'),
        apiFetch('/api/products?limit=100'),
        apiFetch('/api/auth/users'),
      ]);

      if (ordersRes.status === 'fulfilled' && ordersRes.value?.orders) {
        setOrders(ordersRes.value.orders);
      }
      if (productsRes.status === 'fulfilled') {
        const totalProds = productsRes.value?.total || productsRes.value?.products?.length || 0;
        setProductsCount(totalProds);
      }
      if (usersRes.status === 'fulfilled' && usersRes.value?.users) {
        setUsersCount(usersRes.value.users.length);
      }
    } catch (err) {
      console.warn('Dashboard data fetch warning:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute live revenue
  const totalRevenue = orders.reduce((sum, ord) => {
    const val = Number(ord.totalPrice) || 0;
    return sum + val;
  }, 0);

  const stats = [
    { 
      label: 'Total Revenue', 
      value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
      icon: DollarSign, 
      sub: `${orders.length} transactions recorded`, 
      bg: 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
    },
    { 
      label: 'Total Orders', 
      value: orders.length.toString(), 
      icon: ShoppingCart, 
      sub: `${orders.filter(o => o.orderStatus === 'Delivered').length} delivered`, 
      bg: 'bg-blue-50 text-blue-600 border border-blue-100' 
    },
    { 
      label: 'Active Products', 
      value: productsCount.toString(), 
      icon: Package, 
      sub: 'Catalog items live', 
      bg: 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
    },
    { 
      label: 'Registered Users', 
      value: usersCount.toString(), 
      icon: Users, 
      sub: 'Customer & admin profiles', 
      bg: 'bg-amber-50 text-amber-600 border border-amber-100' 
    },
  ];

  const recentOrders = orders.slice(0, 6);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-xs text-gray-500 mt-0.5">Real-time store overview, sales metrics, and catalog management</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 text-gray-600 transition-colors shadow-sm"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-admin-primary' : ''}`} />
          </button>

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
            <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{s.label}</span>
                <div className={`p-2.5 rounded-2xl ${s.bg}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{s.value}</p>
                <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{s.sub}</span>
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
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Recent Customer Orders</h3>
              <p className="text-[11px] text-gray-400">Latest live checkout transactions</p>
            </div>
            <Link href="/admin/orders" className="text-xs font-bold text-admin-primary hover:underline flex items-center gap-1">
              View All ({orders.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-extrabold uppercase text-gray-400">
                  <th className="py-2.5">ORDER ID</th>
                  <th className="py-2.5">CUSTOMER</th>
                  <th className="py-2.5">ITEMS</th>
                  <th className="py-2.5">TOTAL</th>
                  <th className="py-2.5">STATUS</th>
                  <th className="py-2.5 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400 text-xs">
                      No customer orders placed yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((ord) => {
                    const customerName = 
                      ord.shippingAddress?.fullName || 
                      (ord.user?.name) || 
                      'Guest Customer';
                    const itemsDesc = ord.items?.map(i => i.name).join(', ') || 'Catalog items';

                    return (
                      <tr key={ord._id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 font-mono font-bold text-slate-900">
                          #{ord._id.toString().slice(-6).toUpperCase()}
                        </td>
                        <td className="py-3 font-semibold text-slate-800">
                          {customerName}
                        </td>
                        <td className="py-3 text-gray-500 truncate max-w-[180px]" title={itemsDesc}>
                          {itemsDesc}
                        </td>
                        <td className="py-3 font-black text-slate-900">
                          ${Number(ord.totalPrice || 0).toFixed(2)}
                        </td>
                        <td className="py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ord.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-700' :
                            ord.orderStatus === 'Shipped' ? 'bg-blue-50 text-blue-700' :
                            ord.orderStatus === 'Cancelled' ? 'bg-rose-50 text-rose-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>
                            {ord.orderStatus || 'Pending'}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            href="/admin/orders"
                            className="text-admin-primary hover:underline font-bold text-[11px] inline-flex items-center gap-0.5"
                          >
                            Manage <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 pb-3 border-b border-gray-100">Quick Catalog Actions</h3>

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
              href="/admin/brands/add"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-admin-primary transition-all text-xs font-bold text-slate-700"
            >
              <span>+ Add Brand Category</span>
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
              href="/admin/users"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-admin-primary transition-all text-xs font-bold text-slate-700"
            >
              <span>Manage User Accounts</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-admin-primary transition-all text-xs font-bold text-slate-700"
            >
              <span>Manage Orders & Statuses</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}