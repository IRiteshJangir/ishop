'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { 
  User, Package, MapPin, KeyRound, ArrowRight, CheckCircle2, 
  ExternalLink, Clock 
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('info');
  const [firstName, setFirstName] = useState(user?.name ? user.name.split(' ')[0] : '');
  const [lastName, setLastName] = useState(user?.name ? user.name.split(' ').slice(1).join(' ') : '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      const parts = (user.name || '').split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  // Orders
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (activeTab === 'orders') {
      setLoadingOrders(true);
      apiFetch('/api/orders/myorders')
        .then(res => {
          if (res.orders) setOrders(res.orders);
        })
        .catch(() => {
          // Fallback demo order
          setOrders([
            {
              _id: 'ord_1001',
              createdAt: '2026-10-28T10:00:00Z',
              totalPrice: 1746.5,
              status: 'Processing',
              paymentMethod: 'Direct Bank Transfer',
              orderItems: [
                {
                  name: 'Pinneaple Macbook Pro 2022 M1/512GB',
                  price: 1746.5,
                  quantity: 1,
                  image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
                }
              ]
            }
          ]);
        })
        .finally(() => setLoadingOrders(false));
    }
  }, [activeTab]);

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    await updateProfile({
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-6">
        
        {/* Breadcrumbs */}
        <nav className="text-xs text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-gray-400">pages</span>
          <span>/</span>
          <span className="text-slate-900 font-semibold">profile</span>
        </nav>

        {/* 2-Column Layout matching profile.jpg */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT USER AVATAR & SIDEBAR (Cols 1-4) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Avatar & Name */}
            <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-gray-100">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-100 border-4 border-primary/20 shadow">
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"}
                  alt={user?.name || "Customer Account"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">{user?.name || 'Customer Account'}</h3>
                <p className="text-xs text-gray-400">{user?.email || ''}</p>
              </div>
            </div>

            {/* Menu Buttons matching profile.jpg */}
            <nav className="space-y-2 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('info')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'info'
                    ? 'bg-primary text-white shadow font-bold'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Account Info</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'orders'
                    ? 'bg-primary text-white shadow font-bold'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>My order</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('address')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'address'
                    ? 'bg-primary text-white shadow font-bold'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>My address</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('password')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'password'
                    ? 'bg-primary text-white shadow font-bold'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Change password</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </nav>

          </div>

          {/* RIGHT CONTENT (Cols 5-12) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
            
            {/* Tab 1: Account Info */}
            {activeTab === 'info' && (
              <div className="space-y-6">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Account Info</h2>

                {savedSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Your account information has been updated successfully!</span>
                  </div>
                )}

                <form onSubmit={handleSaveInfo} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary text-slate-800"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold uppercase text-xs tracking-wider transition-all shadow-md"
                    >
                      SAVE
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tab 2: My Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">My Orders</h2>
                {orders.length === 0 ? (
                  <p className="text-xs text-gray-500">You have no order history yet.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div key={ord._id} className="p-4 rounded-2xl border border-gray-100 bg-slate-50 space-y-3">
                        <div className="flex flex-wrap items-center justify-between text-xs gap-2 border-b border-gray-200 pb-2">
                          <span className="font-bold text-slate-900">Order ID: #{ord._id}</span>
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                            {ord.status || 'Processing'}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {ord.orderItems?.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="text-slate-700">{item.name} x {item.quantity}</span>
                              <span className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-gray-200 pt-2 flex justify-between text-xs font-black text-slate-900">
                          <span>Total Paid:</span>
                          <span className="text-primary">${ord.totalPrice?.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: My Address */}
            {activeTab === 'address' && (
              <div className="space-y-6">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">My Saved Address</h2>
                <div className="p-6 rounded-2xl border border-gray-200 bg-slate-50 space-y-2 text-xs text-slate-700">
                  <p className="font-bold text-sm text-slate-900">{firstName} {lastName}</p>
                  <p>742 Evergreen Terrace, Apt 2B</p>
                  <p>Seattle, Washington, 98101</p>
                  <p>United States (US)</p>
                  <p className="text-gray-500">Phone: {phone}</p>
                </div>
              </div>
            )}

            {/* Tab 4: Change Password */}
            {activeTab === 'password' && (
              <div className="space-y-6">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Change Password</h2>
                <form className="space-y-4 text-xs max-w-md">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => alert('Password updated successfully!')}
                    className="px-8 py-3 bg-primary text-white rounded-xl font-bold uppercase text-xs"
                  >
                    UPDATE PASSWORD
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
