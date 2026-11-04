'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { 
  PhoneCall, Heart, ShoppingBag, User, Search, ChevronDown, 
  Menu, X, ShieldCheck, RefreshCw, Truck, LogOut 
} from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const { user, logout, isAdmin } = useAuth();
  const { cartItems, orderTotal, totalItemsCount } = useCart();
  const { wishlist } = useWishlist();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    apiFetch('/api/categories')
      .then(res => {
        if (res.categories && res.categories.length > 0) {
          setCategories(res.categories);
        }
      })
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('keyword', searchQuery.trim());
    if (selectedCategory && selectedCategory !== 'All Categories') params.set('category', selectedCategory);
    const qs = params.toString();
    router.push(qs ? `/shop?${qs}` : '/shop');
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 text-slate-800">
      {/* 1. TOP UTILITY BAR */}
      <div className="border-b border-gray-100 text-xs py-2 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center text-gray-500">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Hotline 24/7</span>
            <span className="font-bold text-gray-900 tracking-wide">(025) 3886 25 16</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-primary transition-colors">Sell on Swoo</Link>
            <Link href="/track-order" className="hover:text-primary transition-colors">Order Tracking</Link>
            <div className="flex items-center gap-1 cursor-pointer hover:text-primary">
              <span>USD</span>
              <ChevronDown className="w-3 h-3" />
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-primary">
              <span className="flex items-center gap-1">🇺🇸 Eng</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="py-4 px-4 max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black text-xl shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight leading-none text-slate-900">SWOO</span>
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase leading-tight">TECH MART</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-[13px] font-bold tracking-wide uppercase text-slate-800">
          <Link href="/" className="hover:text-primary flex items-center gap-1 transition-colors">
            HOMES <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </Link>
          <Link href="/about" className="hover:text-primary flex items-center gap-1 transition-colors">
            PAGES <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </Link>
          <Link href="/shop" className="hover:text-primary flex items-center gap-1 transition-colors">
            PRODUCTS <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </Link>
          <Link href="/contact" className="hover:text-primary transition-colors">
            CONTACT
          </Link>
        </nav>

        {/* User, Wishlist, Cart Actions */}
        <div className="flex items-center gap-5">
          {/* Wishlist */}
          <Link href="/shop" className="relative p-2.5 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-700">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* User Account */}
          <div className="relative">
            {user ? (
              <div 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-xs text-slate-700">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-[10px] text-gray-400 font-medium leading-none">HELLO</span>
                  <span className="text-xs font-bold text-slate-800 leading-tight">{user.name.split(' ')[0]}</span>
                </div>
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-2 hover:text-primary">
                <div className="p-2.5 bg-gray-50 rounded-full text-gray-700">
                  <User className="w-5 h-5" />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-[10px] text-gray-400 font-medium leading-none">WELCOME</span>
                  <span className="text-xs font-bold text-slate-800 leading-tight">LOG IN / REGISTER</span>
                </div>
              </Link>
            )}

            {/* Dropdown Menu */}
            {userDropdownOpen && user && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-900">{user.name}</p>
                  <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                </div>
                <Link 
                  href="/profile" 
                  onClick={() => setUserDropdownOpen(false)}
                  className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
                >
                  My Profile & Orders
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" /> Log Out
                </button>
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <Link href="/cart" className="flex items-center gap-2">
            <div className="relative p-2.5 bg-emerald-50 text-primary rounded-full hover:bg-emerald-100 transition-colors">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItemsCount}
              </span>
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[10px] text-gray-400 font-medium leading-none">CART</span>
              <span className="text-xs font-extrabold text-slate-900 leading-tight">
                ${orderTotal ? orderTotal.toFixed(2) : '1,689.00'}
              </span>
            </div>
          </Link>

          {/* Mobile hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 3. TEAL SEARCH & GUARANTEES BAR */}
      <div className="bg-primary text-white py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search form */}
          <form onSubmit={handleSearch} className="w-full md:w-auto flex-1 max-w-xl flex items-center bg-white rounded-lg overflow-hidden p-1 shadow-sm">
            <div className="relative border-r border-gray-200 hidden sm:flex items-center px-3 text-xs text-gray-700 font-medium">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent pr-4 outline-none appearance-none cursor-pointer text-gray-700 max-w-[130px] truncate"
              >
                <option value="All Categories">All Categories</option>
                {categories.length > 0 ? (
                  categories.map(c => (
                    <option key={c._id || c.slug} value={c.name}>{c.name}</option>
                  ))
                ) : (
                  <>
                    <option value="Mobile phone">Mobile phone</option>
                    <option value="Desktop">Desktop</option>
                    <option value="Headphone">Headphone</option>
                    <option value="Mouse">Mouse</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Tablets">Tablets</option>
                    <option value="Gaming & VR">Gaming &amp; VR</option>
                  </>
                )}
              </select>
              <ChevronDown className="w-3 h-3 text-gray-400 pointer-events-none absolute right-1" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anything..."
              className="flex-1 px-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 outline-none"
            />

            <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-4 py-1.5 rounded flex items-center justify-center transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Trust Guarantees */}
          <div className="hidden lg:flex items-center gap-8 text-[12px] font-medium tracking-wide">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 opacity-90" />
              <span>FREE SHIPPING OVER $199</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 opacity-90" />
              <span>30 DAYS MONEY BACK</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 opacity-90" />
              <span>100% SECURE PAYMENT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-6 py-4 space-y-3">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-gray-800">
            Home
          </Link>
          <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-gray-800">
            Products Catalog
          </Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-gray-800">
            About Us
          </Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-gray-800">
            Contact
          </Link>
          <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-gray-800">
            Cart ({totalItemsCount})
          </Link>
          <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-gray-800">
            My Account
          </Link>
        </div>
      )}
    </header>
  );
}
