'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { apiFetch, getImageUrl } from '@/lib/api';
import { 
  Search, Package, Truck, CheckCircle2, Clock, 
  MapPin, AlertCircle, ArrowRight, ShieldCheck, 
  PhoneCall, ExternalLink, RefreshCw, Box
} from 'lucide-react';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams?.get('orderId') || '';

  const [orderIdInput, setOrderIdInput] = useState(initialOrderId);
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState(null);

  // Stepper milestones
  const steps = [
    { key: 'placed', label: 'Order Placed', desc: 'Order details received' },
    { key: 'processing', label: 'Processing', desc: 'Quality checked & packed' },
    { key: 'shipped', label: 'Shipped', desc: 'In transit with courier' },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'With local delivery agent' },
    { key: 'delivered', label: 'Delivered', desc: 'Successfully delivered' },
  ];

  const getStepIndex = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('deliver')) return 4;
    if (s.includes('out')) return 3;
    if (s.includes('ship') || s.includes('transit')) return 2;
    if (s.includes('process') || s.includes('pack')) return 1;
    return 0;
  };

  const fetchOrder = async (idToFetch) => {
    if (!idToFetch || !idToFetch.trim()) {
      setError('Please enter a valid Order ID');
      return;
    }
    const cleanId = idToFetch.trim().replace('#', '');
    setLoading(true);
    setError('');

    try {
      const res = await apiFetch(`/api/orders/${cleanId}`);
      if (res && res.order) {
        setOrderData(res.order);
      } else {
        setError(`We could not locate any order with ID "${idToFetch}". Please verify and try again.`);
        setOrderData(null);
      }
    } catch (err) {
      // Demo order fallback for common lookups
      if (cleanId === 'ord_1001' || cleanId.toLowerCase() === 'demo') {
        setOrderData({
          _id: 'ord_1001',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          status: 'Processing',
          totalPrice: 1746.50,
          paymentMethod: 'Direct Bank Transfer',
          shippingAddress: {
            firstName: 'Mark',
            lastName: 'Cole',
            street: '742 Evergreen Terrace',
            apartment: 'Apt 2B',
            city: 'Seattle',
            state: 'Washington',
            zipCode: '98101',
            country: 'United States (US)',
            phone: '+1 0231 4554 452',
            email: emailInput || 'swoo@gmail.com'
          },
          orderItems: [
            {
              name: 'Pinneaple Macbook Pro 2022 M1/512GB',
              price: 1746.50,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
            }
          ]
        });
      } else if (cleanId === 'ord_1002') {
        setOrderData({
          _id: 'ord_1002',
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          status: 'Shipped',
          totalPrice: 1259.10,
          paymentMethod: 'Credit Card (Stripe)',
          shippingAddress: {
            firstName: 'Sarah',
            lastName: 'Connor',
            street: '104 Ocean Drive',
            city: 'Miami',
            state: 'Florida',
            zipCode: '33101',
            country: 'United States (US)',
            phone: '+1 305 555 0199',
            email: 'sarah@example.com'
          },
          orderItems: [
            {
              name: 'iPhone 15 Pro Max (256GB) - Deep Purple',
              price: 1259.10,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
            }
          ]
        });
      } else {
        setError(err.message || `No active order found with ID #${cleanId}. Please check your order confirmation email.`);
        setOrderData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      setOrderIdInput(initialOrderId);
      fetchOrder(initialOrderId);
    }
  }, [initialOrderId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchOrder(orderIdInput);
  };

  const currentStatus = orderData?.orderStatus || orderData?.status || 'Pending';
  const currentStep = getStepIndex(currentStatus);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 flex items-center gap-2">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-400">Pages</span>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Track Order</span>
        </nav>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 shadow-sm space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
              Real-Time Tracking
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Track Your Order Status
            </h1>
            <p className="text-xs text-gray-500 leading-relaxed">
              To check the real-time shipping status of your parcel, please enter your Order ID and the Billing Email address you provided during checkout below.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Order ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ord_1001 or MongoDB Order ID"
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-primary text-xs font-mono text-slate-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Billing Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="email you used during checkout"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-primary text-xs text-slate-900 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              {/* Quick sample pills */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400">
                <span className="font-semibold">Quick test:</span>
                <button
                  type="button"
                  onClick={() => { setOrderIdInput('ord_1001'); fetchOrder('ord_1001'); }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-mono transition-colors"
                >
                  #ord_1001 (Processing)
                </button>
                <button
                  type="button"
                  onClick={() => { setOrderIdInput('ord_1002'); fetchOrder('ord_1002'); }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-mono transition-colors"
                >
                  #ord_1002 (Shipped)
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-primary hover:bg-primary-dark text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Locating Parcel...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Track Order</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Tracking Details View */}
        {orderData && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Top Order Overview Banner */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-black text-slate-900 font-mono">
                    Order #{orderData._id}
                  </h2>
                  <span className={`text-[11px] font-black uppercase px-3 py-1 rounded-full ${
                    currentStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                    currentStatus === 'Shipped' ? 'bg-sky-100 text-sky-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {currentStatus}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Placed on {new Date(orderData.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <div className="flex items-center gap-6 text-xs">
                <div className="border-l pl-4 border-gray-100">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Estimated Delivery</span>
                  <span className="font-extrabold text-slate-900">
                    {new Date(new Date(orderData.createdAt).getTime() + 86400000 * 4).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="border-l pl-4 border-gray-100">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Carrier</span>
                  <span className="font-extrabold text-primary flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> FedEx Express
                  </span>
                </div>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-8">
                Shipment Progress
              </h3>

              <div className="relative">
                {/* Horizontal Connector Line for Desktop */}
                <div className="hidden sm:block absolute top-5 left-10 right-10 h-1 bg-gray-100 -z-0">
                  <div
                    className="h-full bg-primary transition-all duration-700"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
                  {steps.map((st, idx) => {
                    const isCompleted = idx <= currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <div key={st.key} className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                          isCompleted
                            ? 'bg-primary text-white ring-4 ring-primary/20'
                            : 'bg-slate-100 text-gray-400'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>
                        <div className="space-y-0.5">
                          <p className={`text-xs font-bold ${isCurrent ? 'text-primary' : isCompleted ? 'text-slate-900' : 'text-gray-400'}`}>
                            {st.label}
                          </p>
                          <p className="text-[10px] text-gray-400 sm:max-w-[120px] mx-auto">
                            {st.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2-Column: Ordered Items & Shipping Details */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Ordered Items (Cols 1-7) */}
              <div className="md:col-span-7 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="font-extrabold text-xs uppercase text-slate-900 tracking-wider">
                    Package Items ({orderData.orderItems?.length || 0})
                  </h3>
                  <span className="text-xs font-mono font-bold text-slate-900">
                    Total: ${orderData.totalPrice?.toFixed(2)}
                  </span>
                </div>

                <div className="divide-y divide-gray-100">
                  {orderData.orderItems?.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-slate-50 border border-gray-100 rounded-xl p-1.5 flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{item.name}</h4>
                          <p className="text-[11px] text-gray-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-xs text-slate-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address & Help (Cols 8-12) */}
              <div className="md:col-span-5 space-y-6">
                <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-xs uppercase text-slate-900 tracking-wider pb-3 border-b border-gray-100 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> Delivery Address
                  </h3>

                  {orderData.shippingAddress ? (
                    <div className="text-xs space-y-1.5 text-slate-700 leading-relaxed">
                      <p className="font-bold text-slate-900">
                        {orderData.shippingAddress.firstName} {orderData.shippingAddress.lastName}
                      </p>
                      <p className="text-gray-500">
                        {orderData.shippingAddress.street} {orderData.shippingAddress.apartment || ''}
                      </p>
                      <p className="text-gray-500">
                        {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}
                      </p>
                      <p className="text-gray-500">{orderData.shippingAddress.country}</p>
                      {orderData.shippingAddress.phone && (
                        <p className="text-gray-400 pt-2 font-mono text-[11px]">
                          Contact: {orderData.shippingAddress.phone}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">Standard Delivery</p>
                  )}
                </div>

                {/* Need Assistance Card */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-sm space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-400">Need Assistance?</span>
                  <h4 className="text-sm font-bold leading-snug">Have a question regarding your delivery or shipment?</h4>
                  <div className="flex items-center gap-4 pt-1 text-xs">
                    <Link
                      href="/contact"
                      className="text-primary hover:underline font-bold flex items-center gap-1"
                    >
                      Contact Support <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}
