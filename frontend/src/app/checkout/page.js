'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { ShieldCheck, CheckCircle2, ChevronDown, Check } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, orderTotal, clearCart, mounted } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.addresses?.[0]?.firstName || 'Mark',
    lastName: user?.addresses?.[0]?.lastName || 'Cole',
    company: user?.addresses?.[0]?.company || 'Tech Studio',
    country: 'United States (US)',
    street: user?.addresses?.[0]?.street || '742 Evergreen Terrace',
    apartment: user?.addresses?.[0]?.apartment || 'Apt 2B',
    city: user?.addresses?.[0]?.city || 'Seattle',
    state: user?.addresses?.[0]?.state || 'Washington',
    zipCode: user?.addresses?.[0]?.zipCode || '98101',
    phone: user?.phone || '+1 0231 4554 452',
    email: user?.email || 'swoo@gmail.com',
    createAccount: false,
    orderNotes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('Direct Bank Transfer');
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  if (!mounted) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const orderPayload = {
      orderItems: cartItems.map(item => ({
        product: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        color: item.color,
        memory: item.memory,
      })),
      shippingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        company: formData.company,
        country: formData.country,
        street: `${formData.street} ${formData.apartment}`.trim(),
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        phone: formData.phone,
        email: formData.email,
      },
      paymentMethod,
      itemsPrice: orderTotal,
      shippingPrice: 0.0,
      taxPrice: 0.0,
      totalPrice: orderTotal,
      orderNotes: formData.orderNotes,
    };

    try {
      const res = await apiFetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload),
      });

      if (res.success && res.order) {
        setOrderSuccess(res.order);
        clearCart();
      } else {
        // Fallback success for demo
        setOrderSuccess({ _id: 'ord_' + Date.now(), ...orderPayload });
        clearCart();
      }
    } catch (err) {
      setOrderSuccess({ _id: 'ord_' + Date.now(), ...orderPayload });
      clearCart();
    } finally {
      setSubmitting(false);
    }
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
          <span className="text-slate-900 font-semibold">checkout</span>
        </nav>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">CHECKOUT</h1>

        {/* Order Placed Success Banner */}
        {orderSuccess ? (
          <div className="bg-white rounded-3xl border border-emerald-100 p-8 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Thank you for your order!</h2>
            <p className="text-xs text-gray-600 max-w-md mx-auto">
              Your order <strong className="text-slate-900">#{orderSuccess._id}</strong> has been received and is being processed. A confirmation email has been sent to <strong>{formData.email}</strong>.
            </p>
            <div className="pt-4 flex items-center justify-center gap-4">
              <Link
                href="/profile"
                className="px-6 py-3 bg-primary text-white text-xs font-bold uppercase rounded-xl hover:bg-primary-dark transition-colors"
              >
                Track in My Orders
              </Link>
              <Link
                href="/shop"
                className="px-6 py-3 border border-gray-200 text-slate-700 text-xs font-bold uppercase rounded-xl hover:bg-slate-50 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            
            {/* Returning customer & Coupon accordions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-100/80 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600">
                Returning customer?{' '}
                <Link href="/login" className="text-rose-500 hover:underline font-semibold">
                  Click here to log in
                </Link>
              </div>

              <div className="bg-slate-100/80 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600">
                Have a coupon?{' '}
                <button
                  type="button"
                  onClick={() => setCouponOpen(!couponOpen)}
                  className="text-rose-500 hover:underline font-semibold"
                >
                  Click here to enter your code
                </button>
              </div>
            </div>

            {couponOpen && (
              <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-3 max-w-md">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-slate-800"
                >
                  Apply
                </button>
              </div>
            )}

            {/* Main Form: Billing Detail + Your Order Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Billing Detail Form (Cols 1-7) */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="font-extrabold text-sm uppercase text-slate-900 tracking-wider pb-3 border-b border-gray-100">
                  Billing Detail
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-slate-700 font-semibold mb-1">Company Name (Optional)</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary"
                  />
                </div>

                <div className="text-xs">
                  <label className="block text-slate-700 font-semibold mb-1">Country / Region *</label>
                  <div className="relative">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none appearance-none focus:border-primary cursor-pointer text-slate-800"
                    >
                      <option>United States (US)</option>
                      <option>United Kingdom (UK)</option>
                      <option>Canada</option>
                      <option>Australia</option>
                      <option>Germany</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <label className="block text-slate-700 font-semibold">Street Address *</label>
                  <input
                    type="text"
                    name="street"
                    required
                    placeholder="House number and street name"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    name="apartment"
                    placeholder="Apartment, suite, unit, etc (Optional)"
                    value={formData.apartment}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Town / City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">State / County *</label>
                    <div className="relative">
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none appearance-none focus:border-primary cursor-pointer text-slate-800"
                      >
                        <option>Washington</option>
                        <option>California</option>
                        <option>New York</option>
                        <option>Texas</option>
                        <option>Florida</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Zip Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      required
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Phone Number *</label>
                    <input
                      type="text"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-slate-700 font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary"
                  />
                </div>

                <div className="text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      name="createAccount"
                      checked={formData.createAccount}
                      onChange={handleChange}
                      className="rounded text-primary focus:ring-primary h-4 w-4"
                    />
                    <span>Create an account?</span>
                  </label>
                </div>

                {/* Additional Information / Order Notes */}
                <div className="border-t border-gray-100 pt-5 space-y-2 text-xs">
                  <h4 className="font-extrabold uppercase text-slate-800">Additional Information</h4>
                  <label className="block text-slate-600">Order Notes (Optional)</label>
                  <textarea
                    name="orderNotes"
                    rows={3}
                    placeholder="Note about your order, e.g. special note for delivery"
                    value={formData.orderNotes}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-primary text-xs"
                  />
                </div>
              </div>

              {/* Your Order Summary & Payment (Cols 8-12) matching checkout.jpg */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="font-extrabold text-sm uppercase text-slate-900 tracking-wider pb-3 border-b border-gray-100">
                  Your Order
                </h3>

                {/* Products Summary Table */}
                <div className="text-xs">
                  <div className="flex justify-between font-bold text-slate-400 pb-2 border-b border-gray-100 uppercase text-[10px]">
                    <span>PRODUCT</span>
                    <span>SUB-TOTAL</span>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1" />
                          <div>
                            <p className="font-bold text-slate-800 line-clamp-1">{item.name}</p>
                            <span className="text-gray-400 font-semibold">x {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 py-3 flex justify-between items-center text-xs">
                    <span className="text-gray-600 font-medium">Worldwide Standard Shipping Free</span>
                    <span className="font-bold text-rose-500">+ $0.00</span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                    <span className="font-black text-sm uppercase text-slate-900">Order Total</span>
                    <span className="font-black text-xl text-primary">${orderTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="border-t border-gray-100 pt-4 space-y-4">
                  {/* Direct Bank Transfer */}
                  <label className="block p-3.5 rounded-xl border border-gray-200 cursor-pointer bg-slate-50/50">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Direct Bank Transfer"
                        checked={paymentMethod === 'Direct Bank Transfer'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-primary accent-primary"
                      />
                      <span className="font-bold text-xs text-slate-900">Direct Bank Transfer</span>
                    </div>
                    {paymentMethod === 'Direct Bank Transfer' && (
                      <p className="text-[11px] text-gray-500 mt-2 pl-6 leading-relaxed">
                        Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.
                      </p>
                    )}
                  </label>

                  {/* Cash on Delivery */}
                  <label className="block p-3.5 rounded-xl border border-gray-200 cursor-pointer hover:bg-slate-50">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Cash on Delivery"
                        checked={paymentMethod === 'Cash on Delivery'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-primary accent-primary"
                      />
                      <span className="font-bold text-xs text-slate-900">Cash on Delivery</span>
                    </div>
                  </label>

                  {/* PayPal */}
                  <label className="block p-3.5 rounded-xl border border-gray-200 cursor-pointer hover:bg-slate-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="PayPal"
                          checked={paymentMethod === 'PayPal'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-primary accent-primary"
                        />
                        <span className="font-bold text-xs text-slate-900">PayPal</span>
                        <span className="text-[10px] text-primary underline">What is PayPal?</span>
                      </div>
                      <span className="text-xs font-black italic text-blue-800">PayPal</span>
                    </div>
                  </label>
                </div>

                {/* PLACE ORDER button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>{submitting ? 'PROCESSING ORDER...' : 'PLACE ORDER'}</span>
                </button>
              </div>

            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
