'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiFetch, getImageUrl } from '@/lib/api';
import { 
  CheckCircle2, Clock, Truck, Eye, Trash2, 
  ExternalLink, Search, RefreshCw, X, MapPin, 
  Phone, Mail, Package, AlertCircle 
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/orders');
      if (res.orders) {
        setOrders(res.orders);
      }
    } catch (e) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    if (selectedOrder && selectedOrder._id === id) {
      setSelectedOrder(prev => ({ ...prev, status }));
    }
    try {
      await apiFetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      setSuccessMsg(`Order #${id} status updated to ${status}`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e) {}
  };

  const handleDelete = async (id) => {
    if (confirm(`Are you sure you want to permanently delete order #${id}?`)) {
      setOrders(prev => prev.filter(o => o._id !== id));
      if (selectedOrder && selectedOrder._id === id) setSelectedOrder(null);
      try {
        await apiFetch(`/api/orders/${id}`, { method: 'DELETE' });
        setSuccessMsg(`Order #${id} deleted successfully`);
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (e) {}
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const curStatus = (o.orderStatus || o.status || 'Pending').toUpperCase();
    const matchesTab = activeTab === 'ALL' || curStatus === activeTab;
    const q = searchQuery.toLowerCase();
    const fullName = `${o.shippingAddress?.firstName || ''} ${o.shippingAddress?.lastName || ''}`.trim() || o.user?.name || '';
    const email = o.shippingAddress?.email || o.user?.email || '';
    const matchesSearch = !q || 
      (o._id && o._id.toString().toLowerCase().includes(q)) ||
      fullName.toLowerCase().includes(q) ||
      email.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const statusTabs = ['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Customer Orders</h1>
          <p className="text-xs text-gray-400">Manage real-time customer shipments, status, and invoices</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <span className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-xl">
            Total Orders: {orders.length}
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tabs & Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          {statusTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === tab 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'text-gray-400 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search order ID, email, name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs outline-none focus:border-admin-primary font-mono text-slate-800"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <th className="py-4 px-6">ORDER ID</th>
                <th className="py-4 px-6">CUSTOMER</th>
                <th className="py-4 px-6">PRODUCTS</th>
                <th className="py-4 px-6">DATE</th>
                <th className="py-4 px-6">TOTAL</th>
                <th className="py-4 px-6">PAYMENT</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">
                      #{ord._id}
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-800">
                        {ord.shippingAddress?.firstName} {ord.shippingAddress?.lastName}
                      </p>
                      <p className="text-[10px] text-gray-400">{ord.shippingAddress?.email}</p>
                    </td>

                    <td className="py-4 px-6 text-gray-600 max-w-xs truncate">
                      {ord.orderItems?.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                    </td>

                    <td className="py-4 px-6 text-gray-400 text-[11px] font-mono">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-6 font-black text-slate-900 text-sm">
                      ${ord.totalPrice?.toFixed(2)}
                    </td>

                    <td className="py-4 px-6 text-gray-600">
                      {ord.paymentMethod}
                    </td>

                    <td className="py-4 px-6">
                      <select
                        value={ord.orderStatus || ord.status || 'Pending'}
                        onChange={(e) => updateStatus(ord._id, e.target.value)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full outline-none cursor-pointer border-0 ${
                          (ord.orderStatus || ord.status) === 'Delivered' ? 'bg-emerald-50 text-emerald-700' :
                          (ord.orderStatus || ord.status) === 'Shipped' ? 'bg-blue-50 text-blue-700' :
                          (ord.orderStatus || ord.status) === 'Cancelled' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="text-blue-600 hover:text-blue-800 font-bold text-xs p-1"
                        title="View Order Details"
                      >
                        <Eye className="w-4 h-4 inline" />
                      </button>

                      <Link
                        href={`/track-order?orderId=${ord._id}`}
                        target="_blank"
                        className="text-teal-600 hover:text-teal-800 font-bold text-xs p-1 inline-block"
                        title="Live Tracking Page"
                      >
                        <Truck className="w-4 h-4 inline" />
                      </Link>

                      <button
                        onClick={() => handleDelete(ord._id)}
                        className="text-rose-500 hover:text-rose-700 font-bold text-xs p-1"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-black text-slate-900 font-mono">
                  Order Details: #{selectedOrder._id}
                </h3>
                <p className="text-xs text-gray-400">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-gray-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Control */}
            <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-gray-400 block">Current Status</span>
                <span className="font-extrabold text-sm text-slate-900">{selectedOrder.orderStatus || selectedOrder.status}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-semibold">Change to:</span>
                <select
                  value={selectedOrder.orderStatus || selectedOrder.status || 'Pending'}
                  onChange={(e) => updateStatus(selectedOrder._id, e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="border border-gray-100 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-gray-400">Customer Info</h4>
                <p className="font-bold text-slate-900 text-sm">
                  {selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}
                </p>
                <p className="text-gray-600 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>{selectedOrder.shippingAddress?.email}</span>
                </p>
                {selectedOrder.shippingAddress?.phone && (
                  <p className="text-gray-600 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{selectedOrder.shippingAddress?.phone}</span>
                  </p>
                )}
              </div>

              <div className="border border-gray-100 rounded-2xl p-4 space-y-1.5">
                <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-gray-400">Shipping Address</h4>
                <p className="text-gray-700">{selectedOrder.shippingAddress?.street} {selectedOrder.shippingAddress?.apartment || ''}</p>
                <p className="text-gray-700">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}</p>
                <p className="text-gray-700 font-bold">{selectedOrder.shippingAddress?.country}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-gray-400">
                Purchased Products ({selectedOrder.orderItems?.length || 0})
              </h4>
              <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
                {selectedOrder.orderItems?.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center p-1 overflow-hidden flex-shrink-0">
                        <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{item.name}</p>
                        <p className="text-[11px] text-gray-400">Qty: {item.quantity} | Unit: ${item.price}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-xs text-slate-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Summary */}
            <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-semibold">Payment Method: {selectedOrder.paymentMethod}</span>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 block uppercase">Total Amount</span>
                <span className="text-xl font-black text-primary">${selectedOrder.totalPrice?.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <Link
                href={`/track-order?orderId=${selectedOrder._id}`}
                target="_blank"
                className="px-5 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <span>Open Live Tracker</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
