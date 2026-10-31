'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { CheckCircle2, Clock, Truck, Eye } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([
    {
      _id: 'ord_1001',
      createdAt: '2026-10-28T14:30:00Z',
      shippingAddress: { firstName: 'Mark', lastName: 'Cole', email: 'swoo@gmail.com', city: 'Seattle', country: 'United States (US)' },
      totalPrice: 1746.5,
      paymentMethod: 'Direct Bank Transfer',
      status: 'Processing',
      orderItems: [
        { name: 'Pinneaple Macbook Pro 2022 M1/512GB', quantity: 1, price: 1746.5 }
      ]
    },
    {
      _id: 'ord_1002',
      createdAt: '2026-10-27T09:15:00Z',
      shippingAddress: { firstName: 'Sarah', lastName: 'Jenkins', email: 'sarah@example.com', city: 'New York', country: 'United States (US)' },
      totalPrice: 1169.1,
      paymentMethod: 'PayPal',
      status: 'Shipped',
      orderItems: [
        { name: 'Samsung Galaxy S24 Ultra', quantity: 1, price: 1169.1 }
      ]
    },
    {
      _id: 'ord_1003',
      createdAt: '2026-10-26T18:45:00Z',
      shippingAddress: { firstName: 'Alex', lastName: 'Rivera', email: 'alex@example.com', city: 'Austin', country: 'United States (US)' },
      totalPrice: 398.0,
      paymentMethod: 'Cash on Delivery',
      status: 'Delivered',
      orderItems: [
        { name: 'Sony WH-1000XM5 Wireless Headphones', quantity: 1, price: 398.0 }
      ]
    }
  ]);

  useEffect(() => {
    apiFetch('/api/orders')
      .then(res => {
        if (res.orders && res.orders.length > 0) setOrders(res.orders);
      })
      .catch(() => {});
  }, []);

  const updateStatus = async (id, status) => {
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    try {
      await apiFetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    } catch (e) {}
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Customer Orders</h1>
        <span className="text-xs text-gray-500 font-semibold">Total Orders: {orders.length}</span>
      </div>

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
                <th className="py-4 px-6 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {orders.map((ord) => (
                <tr key={ord._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-slate-900">
                    #{ord._id}
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-800">{ord.shippingAddress?.firstName} {ord.shippingAddress?.lastName}</p>
                    <p className="text-[10px] text-gray-400">{ord.shippingAddress?.email}</p>
                  </td>
                  <td className="py-4 px-6 text-gray-600 max-w-xs truncate">
                    {ord.orderItems?.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                  </td>
                  <td className="py-4 px-6 text-gray-400 text-[11px]">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 font-black text-slate-900 text-sm">
                    ${ord.totalPrice?.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {ord.paymentMethod}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <select
                      value={ord.status}
                      onChange={(e) => updateStatus(ord._id, e.target.value)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full outline-none cursor-pointer border-0 ${
                        ord.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' :
                        ord.status === 'Shipped' ? 'bg-blue-50 text-blue-700' :
                        ord.status === 'Cancelled' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
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
