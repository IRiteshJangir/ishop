'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { useCart } from '@/context/CartContext';
import { getImageUrl } from '@/lib/api';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, subTotal, shippingTotal, taxTotal, orderTotal, mounted } = useCart();

  if (!mounted) return null;

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
          <span className="text-slate-900 font-semibold">cart</span>
        </nav>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-4 shadow-sm">
            <h2 className="text-xl font-black text-slate-900">Your Cart is Currently Empty</h2>
            <p className="text-xs text-gray-500">Looks like you haven&apos;t added any tech items to your shopping cart yet.</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-xs font-bold uppercase rounded-xl hover:bg-primary-dark transition-colors shadow-sm"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT CART ITEMS LIST (Cols 1-8) */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={`${item._id}-${index}`}
                  className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 relative"
                >
                  {/* Left: Thumbnail & Badges */}
                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    <div className="relative w-28 h-28 bg-slate-50 rounded-2xl p-2 flex items-center justify-center flex-shrink-0">
                      {item.badge && (
                        <span className={`absolute -top-2 -left-2 text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm ${
                          item.badge.includes('SAVE') ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Title, rating, price, shipping badges */}
                    <div className="space-y-1.5 flex-1">
                      {item.reviewsCount && (
                        <span className="text-[11px] text-gray-400 font-semibold">({item.reviewsCount})</span>
                      )}
                      <Link href={`/product/${item.slug}`}>
                        <h3 className="text-sm font-bold text-slate-900 hover:text-primary transition-colors line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>

                      <div className="flex items-baseline gap-2 pt-0.5">
                        <span className="text-base font-black text-slate-900">${item.price.toFixed(2)}</span>
                        {item.originalPrice > item.price && (
                          <span className="text-xs text-gray-400 line-through">${item.originalPrice.toFixed(2)}</span>
                        )}
                      </div>

                      {/* Badges: Free shipping, in stock */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded uppercase">
                          {item.shippingText || 'FREE SHIPPING'}
                        </span>
                        {item.freeGift && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded uppercase">
                            FREE GIFT
                          </span>
                        )}
                        <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> In stock
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Quantity increment/decrement & Remove */}
                  <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="flex items-center bg-slate-50 border border-gray-200 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(index, -1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(index, 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-gray-400 hover:text-rose-500 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT ORDER SUMMARY (Cols 9-12) matching cart.jpg */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
              <h3 className="font-extrabold text-sm uppercase text-slate-900 tracking-wider pb-3 border-b border-gray-100">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex justify-between items-center">
                  <span>Sub Total:</span>
                  <span className="font-bold text-slate-900">${subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping estimate:</span>
                  <span className="font-bold text-slate-900">
                    {shippingTotal === 0 ? 'FREE' : `$${shippingTotal.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tax estimate:</span>
                  <span className="font-bold text-slate-900">${taxTotal.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                  <span className="font-black text-slate-900 text-sm uppercase">ORDER TOTAL:</span>
                  <span className="font-black text-slate-900 text-lg">${orderTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-400 space-y-2">
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>Secure 256-bit encrypted checkout</span>
                </p>
                <p>30 days unconditional return guarantee.</p>
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
