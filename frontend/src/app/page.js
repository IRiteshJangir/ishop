'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { initialProducts } from '@/lib/mockData';
import { apiFetch, getImageUrl } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { 
  Laptop, Smartphone, Headphones, Mouse, Monitor, Gamepad2, 
  Camera, Printer, ChevronRight, ChevronLeft, Star, Heart, 
  ShoppingBag, Check, Clock, Zap, ArrowRight, ShieldCheck, 
  MoreHorizontal, ChevronDown, Flame, Sparkles, Watch, Wifi, 
  Speaker, Shield, RefreshCw, Cpu
} from 'lucide-react';

export default function HomePage() {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [addedItem, setAddedItem] = useState(null);
  const [activeBestSellerTab, setActiveBestSellerTab] = useState('TOP 20');
  const [heroNewsletter, setHeroNewsletter] = useState('');
  const [subscribedNotice, setSubscribedNotice] = useState(false);

  // Live products & categories fetched from MongoDB
  const [liveProducts, setLiveProducts] = useState(initialProducts);
  const [liveCategories, setLiveCategories] = useState([]);

  useEffect(() => {
    apiFetch('/api/products')
      .then(res => {
        if (res.products && res.products.length > 0) {
          setLiveProducts(res.products);
        }
      })
      .catch(() => {});

    apiFetch('/api/categories')
      .then(res => {
        if (res.categories && res.categories.length > 0) {
          setLiveCategories(res.categories);
        }
      })
      .catch(() => {});
  }, []);

  // Check on the Day thumbnail selector
  const dealThumbnails = [
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&auto=format&fit=crop&q=80',
  ];
  const [selectedDealImg, setSelectedDealImg] = useState(dealThumbnails[0]);

  // Countdown timer for Check on the Day
  const [timeLeft, setTimeLeft] = useState({
    days: 102,
    hours: 8,
    mins: 3,
    secs: 4,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: 59, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (product, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    addToCart(product, 1);
    setAddedItem(product._id || product.name);
    setTimeout(() => setAddedItem(null), 2200);
  };

  const handleHeroSubscribe = (e) => {
    e.preventDefault();
    if (heroNewsletter) {
      setSubscribedNotice(true);
      setHeroNewsletter('');
      setTimeout(() => setSubscribedNotice(false), 4000);
    }
  };

  // Brands matching screenshot
  const featuredBrands = [
    { name: 'lenovo', color: 'text-red-600 font-black' },
    { name: 'logitech', color: 'text-slate-800 font-bold' },
    { name: 'Bose', color: 'text-slate-900 font-black italic' },
    { name: 'JBL', color: 'text-orange-600 font-black' },
    { name: 'msi', color: 'text-red-700 font-black tracking-widest' },
    { name: 'ASUS', color: 'text-blue-700 font-black tracking-wider' },
    { name: 'SONY', color: 'text-slate-900 font-black' },
    { name: 'acer', color: 'text-emerald-600 font-bold' },
    { name: 'SENNHEISER', color: 'text-slate-700 font-semibold text-[10px]' },
    { name: 'CORSAIR', color: 'text-slate-900 font-black text-[11px]' },
  ];

  // Top categories circle icons matching screenshot
  const topCategoryIcons = [
    { name: 'Laptops', count: '12 Items', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&auto=format&fit=crop&q=80', slug: 'laptops' },
    { name: 'PC Gaming', count: '8 Items', img: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=200&auto=format&fit=crop&q=80', slug: 'desktop' },
    { name: 'Headphones', count: '15 Items', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80', slug: 'headphone' },
    { name: 'Monitors', count: '9 Items', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&auto=format&fit=crop&q=80', slug: 'desktop' },
  ];

  // Dynamic product formatting helper for homepage shelves
  const formatItem = (p) => ({
    _id: p._id,
    name: p.name,
    slug: p.slug,
    price: Number(p.finalPrice !== undefined ? p.finalPrice : p.originalPrice || 0),
    originalPrice: Number(p.originalPrice || p.finalPrice || 0),
    badge: p.isTopSelling ? 'TOP SELLING' : p.discount > 0 ? `SAVE ${p.discount}%` : 'NEW',
    badgeType: p.isTopSelling ? 'top' : p.discount > 0 ? 'save' : 'new',
    rating: p.rating || 5.0,
    reviews: p.numReviews || 88,
    image: getImageUrl(p.thumbnail),
    shipping: 'FREE SHIPPING',
    stock: (p.countInStock !== undefined ? p.countInStock > 0 : true) ? 'In stock' : 'Out of stock',
    colors: p.colorHexes && p.colorHexes.length ? p.colorHexes : ['#ffffff', '#1f2937'],
  });

  // Best sellers items dynamically computed from MongoDB live products
  const bestSellers = useMemo(() => {
    if (!liveProducts.length) return [];
    const filtered = liveProducts.filter(p => {
      if (activeBestSellerTab === 'BABY & KIDS') {
        return p.categoryName?.toLowerCase().includes('kids') || p.categoryName?.toLowerCase().includes('game') || p.categoryName?.toLowerCase().includes('vr');
      }
      if (activeBestSellerTab === 'ELECTRONIC') {
        return p.categoryName?.toLowerCase().includes('electronic') || p.categoryName?.toLowerCase().includes('phone') || p.categoryName?.toLowerCase().includes('laptop') || p.categoryName?.toLowerCase().includes('desktop');
      }
      return true; // TOP 20
    });
    return (filtered.length ? filtered : liveProducts).slice(0, 8).map(formatItem);
  }, [liveProducts, activeBestSellerTab]);

  // Phones & Tablets items dynamically computed from MongoDB live products
  const phonesTablets = useMemo(() => {
    const list = liveProducts.filter(p => 
      p.categoryName?.toLowerCase().includes('phone') || 
      p.categoryName?.toLowerCase().includes('tablet') || 
      p.slug?.includes('phone') || 
      p.slug?.includes('iphone') || 
      p.slug?.includes('samsung') || 
      p.slug?.includes('tablet') ||
      p.slug?.includes('vivo') ||
      p.slug?.includes('plus')
    );
    return (list.length ? list : liveProducts).slice(0, 6).map(formatItem);
  }, [liveProducts]);

  // Laptops & Computers items dynamically computed from MongoDB live products
  const laptopsComputers = useMemo(() => {
    const list = liveProducts.filter(p => 
      p.categoryName?.toLowerCase().includes('laptop') || 
      p.categoryName?.toLowerCase().includes('desktop') || 
      p.categoryName?.toLowerCase().includes('computer') || 
      p.slug?.includes('macbook') || 
      p.slug?.includes('laptop') || 
      p.slug?.includes('book') ||
      p.slug?.includes('pc')
    );
    return (list.length ? list : liveProducts).slice(0, 6).map(formatItem);
  }, [liveProducts]);

  // Dynamic Category Sidebar populated from MongoDB
  const sidebarCategories = useMemo(() => {
    if (liveCategories.length > 0) {
      return liveCategories.map(c => ({
        name: c.name,
        count: 'Live',
        icon: c.slug?.includes('phone') ? Smartphone : c.slug?.includes('headphone') ? Headphones : c.slug?.includes('game') ? Gamepad2 : Laptop,
        href: `/shop?category=${encodeURIComponent(c.name)}`,
      }));
    }
    return [
      { name: 'Laptops', count: '12', icon: Laptop, href: '/shop?category=Laptops' },
      { name: 'Technologies & IT', count: '45', icon: Monitor, href: '/shop?category=Desktop' },
      { name: 'Smart Phones', count: '28', icon: Smartphone, href: '/shop?category=Mobile phone' },
      { name: 'VR / Games', count: '16', icon: Gamepad2, href: '/shop?category=Gaming & VR' },
      { name: 'Accessories', count: '54', icon: Headphones, href: '/shop?category=Headphone' },
      { name: 'Cameras', count: '19', icon: Camera, href: '/shop' },
      { name: 'Office Equipments', count: '31', icon: Printer, href: '/shop' },
    ];
  }, [liveCategories]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-5 space-y-9">

        {/* ============================================================== */}
        {/* 1. HERO SECTION: CATEGORY SIDEBAR + SPHERE BACKGROUND BANNER */}
        {/* ============================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Left: Category Sidebar matching screenshot */}
          <div className="hidden lg:flex lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-2">
                <span className="font-extrabold text-xs uppercase text-slate-900 tracking-wider">Category</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>

              <ul className="space-y-1 text-xs font-semibold text-slate-700">
                {sidebarCategories.map((cat, idx) => {
                  const Icon = cat.icon || Laptop;
                  return (
                    <li key={idx}>
                      <Link
                        href={cat.href}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 hover:text-primary transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                          <span>{cat.name}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <Link href="/shop" className="text-[11px] font-bold text-primary hover:underline flex items-center justify-between">
                <span>View All 20+ Categories</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right: Big Hero Banner with Spheres Background matching screenshot */}
          <div className="lg:col-span-9 relative rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between p-8 sm:p-14 min-h-[360px] bg-cover bg-center"
               style={{
                 backgroundImage: `url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1400&auto=format&fit=crop&q=80')`,
                 backgroundPosition: 'center right',
               }}>
            {/* Subtle overlay for legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/80 to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-lg space-y-4">
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Don&apos;t miss amazing tech &amp; gadget deals
              </h1>
              <p className="text-sm font-semibold text-gray-600">
                Sign up for the daily newsletter &amp; get exclusive member discounts
              </p>

              {/* Newsletter form embedded on the banner */}
              <form onSubmit={handleHeroSubscribe} className="pt-2 flex items-center max-w-md bg-white rounded-2xl p-1.5 shadow-md border border-gray-200">
                <input
                  type="email"
                  value={heroNewsletter}
                  onChange={(e) => setHeroNewsletter(e.target.value)}
                  placeholder="Your emaill address"
                  required
                  className="flex-1 bg-transparent px-4 py-2.5 text-xs text-slate-800 placeholder-gray-400 outline-none"
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase px-6 py-2.5 rounded-xl transition-all shadow-sm"
                >
                  Subscribe
                </button>
              </form>

              {subscribedNotice && (
                <p className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg inline-block">
                  ✓ Thank you! You will receive daily flash deals straight to your inbox.
                </p>
              )}
            </div>

            {/* Slider Dots at bottom center */}
            <div className="relative z-10 flex items-center justify-center gap-2 pt-6">
              <span className="w-6 h-2 rounded-full bg-primary" />
              <span className="w-2 h-2 rounded-full bg-gray-300" />
              <span className="w-2 h-2 rounded-full bg-gray-300" />
            </div>
          </div>

        </section>

        {/* ============================================================== */}
        {/* 2. FEATURED BRANDS & TOP CATEGORIES (SPLIT ROW) */}
        {/* ============================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Left: Featured Brands (Cols 1-7) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <span className="font-extrabold text-xs uppercase text-slate-900 tracking-wider">FEATURED BRANDS</span>
              <Link href="/shop" className="text-xs text-primary font-bold hover:underline">View all</Link>
            </div>

            <div className="grid grid-cols-5 gap-3 items-center pt-1">
              {featuredBrands.map((brand, idx) => (
                <Link
                  key={idx}
                  href={`/shop?brand=${encodeURIComponent(brand.name)}`}
                  className="flex items-center justify-center p-2.5 h-12 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-center border border-gray-100/60"
                >
                  <span className={`text-xs ${brand.color}`}>
                    {brand.name.toUpperCase()}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Top Categories circular thumbnails (Cols 8-12) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <span className="font-extrabold text-xs uppercase text-slate-900 tracking-wider">TOP CATEGORIES</span>
              <Link href="/shop" className="text-xs text-primary font-bold hover:underline">View all</Link>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center pt-1">
              {topCategoryIcons.map((item, idx) => (
                <Link key={idx} href={`/shop?category=${item.slug}`} className="group space-y-1.5 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-slate-50 border border-gray-100 p-1 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform shadow-xs">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900 group-hover:text-primary leading-tight">{item.name}</p>
                    <span className="text-[10px] text-gray-400 font-semibold">{item.count}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </section>

        {/* ============================================================== */}
        {/* 3. CHECK ON THE DAY (FLASH DEAL + 3 PROMO BANNERS) */}
        {/* ============================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Left & Middle: Check on the Day main spotlight (Cols 1-8) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
            {/* Header bar */}
            <div className="bg-primary text-white px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 fill-white" />
                <span className="font-extrabold text-xs uppercase tracking-wider">CHECK ON THE DAY</span>
              </div>
              <MoreHorizontal className="w-4 h-4 opacity-80 cursor-pointer" />
            </div>

            {/* Content body */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center flex-1">
              
              {/* Vertical Thumbnail List (2 cols) */}
              <div className="sm:col-span-2 flex sm:flex-col gap-2 justify-center">
                {dealThumbnails.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDealImg(img)}
                    className={`w-14 h-14 rounded-xl border p-1 bg-slate-50 flex items-center justify-center overflow-hidden transition-all ${
                      selectedDealImg === img ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={img} alt="" className="max-h-full max-w-full object-contain" />
                  </button>
                ))}
              </div>

              {/* Main Product Visual (4 cols) */}
              <div className="sm:col-span-4 relative flex items-center justify-center bg-slate-50 rounded-2xl p-4 min-h-[260px]">
                <span className="absolute top-3 left-3 bg-emerald-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded shadow-xs">
                  SAVE $111.00
                </span>
                <img
                  src={selectedDealImg}
                  alt="Deal Smartphone"
                  className="max-h-56 object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info & Countdown (6 cols) */}
              <div className="sm:col-span-6 space-y-3">
                <Link href="/product/srok-smart-phone-128gb-oled-retina">
                  <h3 className="text-base font-extrabold text-slate-900 hover:text-primary transition-colors leading-snug">
                    Xiaomi Redmi Note 11 Pro (2022) 128Gb, Blue Smartphone
                  </h3>
                </Link>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">$309.00</span>
                  <span className="text-xs font-semibold text-gray-400 line-through">$420.00</span>
                </div>

                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  108MP pro-grade main camera, 120Hz FHD+ AMOLED DotDisplay, and 67W turbo charging with massive 5000mAh battery.
                </p>

                {/* Badges */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    FREE SHIPPING
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    FREE GIFT
                  </span>
                </div>

                {/* Countdown Timer matching screenshot */}
                <div className="space-y-1.5 pt-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                    HURRY UP! OFFER ENDS IN:
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-900 text-white rounded-lg px-2.5 py-1 text-center min-w-[42px]">
                      <span className="font-black text-xs block leading-tight">{timeLeft.days}</span>
                      <span className="text-[8px] text-gray-400 uppercase">Days</span>
                    </div>
                    <span className="font-bold text-gray-400">:</span>
                    <div className="bg-slate-900 text-white rounded-lg px-2.5 py-1 text-center min-w-[42px]">
                      <span className="font-black text-xs block leading-tight">{timeLeft.hours}</span>
                      <span className="text-[8px] text-gray-400 uppercase">Hours</span>
                    </div>
                    <span className="font-bold text-gray-400">:</span>
                    <div className="bg-slate-900 text-white rounded-lg px-2.5 py-1 text-center min-w-[42px]">
                      <span className="font-black text-xs block leading-tight">{timeLeft.mins}</span>
                      <span className="text-[8px] text-gray-400 uppercase">Mins</span>
                    </div>
                    <span className="font-bold text-gray-400">:</span>
                    <div className="bg-primary text-white rounded-lg px-2.5 py-1 text-center min-w-[42px]">
                      <span className="font-black text-xs block leading-tight">{timeLeft.secs}</span>
                      <span className="text-[8px] text-teal-100 uppercase">Secs</span>
                    </div>
                  </div>
                </div>

                {/* Sold progress bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] font-semibold text-gray-500">
                    <span>Sold: <strong className="text-slate-900">26/75</strong></span>
                    <span className="text-primary font-bold">35% Sold</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[35%]" />
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Right: 3 Stacked Promotional Banners (Cols 9-12) */}
          <div className="lg:col-span-4 flex flex-col gap-3 justify-between">
            
            {/* Banner 1: Game controller */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-4 text-white flex items-center justify-between overflow-hidden shadow-xs relative">
              <span className="absolute top-3 right-3 bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded">
                SAVE 50%
              </span>
              <div className="space-y-1 z-10">
                <span className="text-[10px] font-bold text-gray-400 uppercase">GAMING CONSOLES</span>
                <h4 className="text-sm font-bold leading-tight">Xbox Wireless Controller</h4>
                <p className="text-xs text-teal-300 font-extrabold">$49.99</p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=200&auto=format&fit=crop&q=80"
                alt=""
                className="w-24 h-20 object-contain ml-2"
              />
            </div>

            {/* Banner 2: Tablets / Displays */}
            <div className="bg-gradient-to-r from-slate-800 to-teal-950 rounded-2xl p-4 text-white flex items-center justify-between overflow-hidden shadow-xs">
              <div className="space-y-1 z-10">
                <span className="text-[10px] font-bold text-teal-300 uppercase">NEW ARRIVAL</span>
                <h4 className="text-sm font-bold leading-tight">Ultra Display 4K</h4>
                <p className="text-xs text-gray-300">From $299.00</p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&auto=format&fit=crop&q=80"
                alt=""
                className="w-24 h-20 object-contain ml-2"
              />
            </div>

            {/* Banner 3: Smartphone lying flat */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-4 text-white flex items-center justify-between overflow-hidden shadow-xs">
              <div className="space-y-1 z-10">
                <span className="text-[10px] font-bold text-indigo-300 uppercase">FLASH SPECIAL</span>
                <h4 className="text-sm font-bold leading-tight">Flagship 5G Phone</h4>
                <p className="text-xs text-amber-300 font-extrabold">Save $150</p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&auto=format&fit=crop&q=80"
                alt=""
                className="w-24 h-20 object-contain ml-2"
              />
            </div>

          </div>

        </section>

        {/* ============================================================== */}
        {/* 4. PRE-ORDER CYAN/TEAL BANNER (matching mockup) */}
        {/* ============================================================== */}
        <section className="bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm overflow-hidden relative">
          <div className="space-y-1.5 z-10">
            <span className="bg-black/20 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
              PRE-ORDER
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Smartwatch Series 8 Ultra
            </h3>
            <p className="text-xs text-teal-100 font-medium">Starting from $179.00</p>
          </div>

          <div className="flex items-center justify-center z-10">
            <img
              src="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=300&auto=format&fit=crop&q=80"
              alt="Pre-order Smartwatch"
              className="h-28 object-contain drop-shadow-xl"
            />
          </div>

          <div className="text-center sm:text-right z-10 space-y-3">
            <p className="text-lg font-black tracking-tight text-white leading-tight">
              A healthy leap ahead
            </p>
            <Link
              href="/shop"
              className="inline-block bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs uppercase px-6 py-2.5 rounded-full transition-all shadow-md"
            >
              Pre-order Now
            </Link>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 5. BEST SELLER SECTION (CAROUSEL OF 5 CARDS) */}
        {/* ============================================================== */}
        <section className="space-y-4">
          {/* Header & Tabs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
            <div className="flex items-center gap-6">
              <h2 className="text-base font-extrabold text-slate-900 tracking-wider uppercase">
                BEST SELLER
              </h2>
              <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                {['TOP 20', 'BABY & KIDS', 'ELECTRONIC'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveBestSellerTab(tab)}
                    className={`transition-colors ${
                      activeBestSellerTab === tab ? 'text-primary border-b-2 border-primary pb-1' : 'hover:text-slate-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <Link href="/shop" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 5 Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {bestSellers.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group relative"
              >
                <div>
                  {/* Top Badges & Wishlist */}
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded shadow-2xs ${
                      item.badgeType === 'save' ? 'bg-emerald-50 text-emerald-700' :
                      item.badgeType === 'top' ? 'bg-purple-50 text-purple-700' :
                      item.badgeType === 'hot' ? 'bg-amber-50 text-amber-700' : 'bg-slate-900 text-white'
                    }`}>
                      {item.badge}
                    </span>
                    <button
                      onClick={() => toggleWishlist(item)}
                      className="p-1 text-gray-300 hover:text-rose-500 transition-colors"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isInWishlist(item._id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Thumbnail */}
                  <Link href={`/product/${item.slug}`} className="block my-2 overflow-hidden rounded-xl">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-32 object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-[11px] text-amber-400 mt-1">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span className="font-bold text-slate-700">{item.rating}</span>
                    <span className="text-gray-400 text-[10px]">({item.reviews})</span>
                  </div>

                  {/* Title */}
                  <Link href={`/product/${item.slug}`}>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-2 hover:text-primary transition-colors mt-1">
                      {item.name}
                    </h4>
                  </Link>
                </div>

                {/* Price, Shipping, Color Dots & Cart */}
                <div className="pt-3 border-t border-gray-50 mt-3 space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-black text-sm text-slate-900">${item.price.toFixed(2)}</span>
                    {item.originalPrice > item.price && (
                      <span className="text-[11px] text-gray-400 line-through">${item.originalPrice.toFixed(2)}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-teal-600 font-bold">{item.shipping}</span>
                    <span className="text-emerald-600 font-semibold">{item.stock}</span>
                  </div>

                  {/* Color dots */}
                  {item.colors && (
                    <div className="flex items-center gap-1 pt-0.5">
                      {item.colors.map((c, i) => (
                        <span key={i} style={{ backgroundColor: c }} className="w-2.5 h-2.5 rounded-full border border-gray-300" />
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full py-1.5 bg-slate-50 hover:bg-primary hover:text-white text-slate-700 font-bold text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{addedItem === item._id ? 'Added!' : 'Add to cart'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 6. TOP CELL PHONES & TABLETS (BANNER + SUB-CATEGORIES + 5 CARDS) */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 tracking-wider uppercase">
              TOP CELL PHONES &amp; TABLETS
            </h2>
            <Link href="/shop?category=mobile-phone" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Top Banner & Subcategories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
            {/* Left promo banner card */}
            <div className="md:col-span-5 bg-gradient-to-r from-amber-50 to-orange-100 rounded-2xl p-6 flex items-center justify-between overflow-hidden shadow-xs border border-orange-100">
              <div className="space-y-2 z-10">
                <span className="text-[10px] font-bold text-orange-600 uppercase">FLAGSHIP RELEASE</span>
                <h3 className="text-lg font-black text-slate-900">REDMI NOTE 12 PRO+ 5G</h3>
                <Link
                  href="/shop?category=mobile-phone"
                  className="inline-block bg-slate-900 text-white font-bold text-[11px] px-4 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Shop Now
                </Link>
              </div>
              <img
                src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&auto=format&fit=crop&q=80"
                alt="Redmi Note 12"
                className="w-32 h-28 object-contain drop-shadow-md"
              />
            </div>

            {/* Right 6 subcategories */}
            <div className="md:col-span-7 grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { name: 'Apple', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&auto=format&fit=crop&q=80' },
                { name: 'Samsung', img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&auto=format&fit=crop&q=80' },
                { name: 'Xiaomi', img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&auto=format&fit=crop&q=80' },
                { name: 'OnePlus', img: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=100&auto=format&fit=crop&q=80' },
                { name: 'Tablets', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100&auto=format&fit=crop&q=80' },
                { name: 'Accessories', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80' },
              ].map((sub, idx) => (
                <Link
                  key={idx}
                  href={`/shop?keyword=${encodeURIComponent(sub.name)}`}
                  className="bg-white rounded-xl border border-gray-100 p-2.5 flex flex-col items-center justify-center text-center hover:shadow-xs hover:border-primary transition-all group"
                >
                  <img src={sub.img} alt={sub.name} className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" />
                  <span className="text-[11px] font-bold text-slate-800 mt-1.5 group-hover:text-primary">{sub.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* 5 Product Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {phonesTablets.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col justify-between hover:shadow-lg transition-all group relative"
              >
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                      {item.badge}
                    </span>
                    <button onClick={() => toggleWishlist(item)} className="text-gray-300 hover:text-rose-500">
                      <Heart className={`w-3.5 h-3.5 ${isInWishlist(item._id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  <Link href={`/product/${item.slug}`} className="block my-2 overflow-hidden rounded-xl">
                    <img src={item.image} alt={item.name} className="w-full h-32 object-contain group-hover:scale-105 transition-transform" />
                  </Link>

                  <div className="flex items-center gap-1 text-[11px] text-amber-400 mt-1">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span className="font-bold text-slate-700">{item.rating}</span>
                    <span className="text-gray-400 text-[10px]">({item.reviews})</span>
                  </div>

                  <Link href={`/product/${item.slug}`}>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-2 hover:text-primary transition-colors mt-1">
                      {item.name}
                    </h4>
                  </Link>
                </div>

                <div className="pt-3 border-t border-gray-50 mt-3 space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-black text-sm text-slate-900">${item.price.toFixed(2)}</span>
                    {item.originalPrice > item.price && (
                      <span className="text-[11px] text-gray-400 line-through">${item.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-teal-600 font-bold">{item.shipping}</span>
                    <span className="text-emerald-600 font-semibold">{item.stock}</span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full py-1.5 bg-slate-50 hover:bg-primary hover:text-white text-slate-700 font-bold text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{addedItem === item._id ? 'Added!' : 'Add to cart'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 7. BEST LAPTOPS & COMPUTERS (BANNER + SUB-CATEGORIES + 5 CARDS) */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 tracking-wider uppercase">
              BEST LAPTOPS &amp; COMPUTERS
            </h2>
            <Link href="/shop?category=laptops" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Top Banner & Subcategories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
            {/* Left promo banner card */}
            <div className="md:col-span-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 rounded-2xl p-6 flex items-center justify-between overflow-hidden shadow-xs text-white">
              <div className="space-y-2 z-10">
                <span className="text-[10px] font-bold text-teal-400 uppercase">PRO PERFORMANCE</span>
                <h3 className="text-lg font-black leading-tight">MacBook Pro Supercharged by M2</h3>
                <Link
                  href="/shop?category=laptops"
                  className="inline-block bg-primary text-white font-bold text-[11px] px-4 py-1.5 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Explore M2
                </Link>
              </div>
              <img
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop&q=80"
                alt="MacBook Pro"
                className="w-32 h-28 object-contain drop-shadow-md"
              />
            </div>

            {/* Right 6 subcategories */}
            <div className="md:col-span-7 grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { name: 'MacBook', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&auto=format&fit=crop&q=80' },
                { name: 'Gaming PC', img: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=100&auto=format&fit=crop&q=80' },
                { name: 'Workstations', img: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=100&auto=format&fit=crop&q=80' },
                { name: 'Monitors', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=100&auto=format&fit=crop&q=80' },
                { name: 'Sound', img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=100&auto=format&fit=crop&q=80' },
                { name: 'Storage', img: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=100&auto=format&fit=crop&q=80' },
              ].map((sub, idx) => (
                <Link
                  key={idx}
                  href={`/shop?keyword=${encodeURIComponent(sub.name)}`}
                  className="bg-white rounded-xl border border-gray-100 p-2.5 flex flex-col items-center justify-center text-center hover:shadow-xs hover:border-primary transition-all group"
                >
                  <img src={sub.img} alt={sub.name} className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" />
                  <span className="text-[11px] font-bold text-slate-800 mt-1.5 group-hover:text-primary">{sub.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* 5 Product Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {laptopsComputers.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col justify-between hover:shadow-lg transition-all group relative"
              >
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                      {item.badge}
                    </span>
                    <button onClick={() => toggleWishlist(item)} className="text-gray-300 hover:text-rose-500">
                      <Heart className={`w-3.5 h-3.5 ${isInWishlist(item._id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  <Link href={`/product/${item.slug}`} className="block my-2 overflow-hidden rounded-xl">
                    <img src={item.image} alt={item.name} className="w-full h-32 object-contain group-hover:scale-105 transition-transform" />
                  </Link>

                  <div className="flex items-center gap-1 text-[11px] text-amber-400 mt-1">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span className="font-bold text-slate-700">{item.rating}</span>
                    <span className="text-gray-400 text-[10px]">({item.reviews})</span>
                  </div>

                  <Link href={`/product/${item.slug}`}>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-2 hover:text-primary transition-colors mt-1">
                      {item.name}
                    </h4>
                  </Link>
                </div>

                <div className="pt-3 border-t border-gray-50 mt-3 space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-black text-sm text-slate-900">${item.price.toFixed(2)}</span>
                    {item.originalPrice > item.price && (
                      <span className="text-[11px] text-gray-400 line-through">${item.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-teal-600 font-bold">{item.shipping}</span>
                    <span className="text-emerald-600 font-semibold">{item.stock}</span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full py-1.5 bg-slate-50 hover:bg-primary hover:text-white text-slate-700 font-bold text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{addedItem === item._id ? 'Added!' : 'Add to cart'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 8. THREE FEATURED CATEGORY SHOWCASES (AUDIOS, GAMING, OFFICE) */}
        {/* ============================================================== */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1: Audios & Cameras */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="font-extrabold text-xs uppercase text-slate-900 tracking-wider">AUDIOS &amp; CAMERAS</span>
              <Link href="/shop?category=headphone" className="text-xs text-primary font-bold hover:underline">View all</Link>
            </div>

            {/* Banner card */}
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl p-4 text-white flex items-center justify-between relative overflow-hidden h-32">
              <div className="space-y-1 z-10">
                <span className="text-[10px] font-bold text-blue-300 uppercase">PREMIUM SOUND</span>
                <h4 className="text-sm font-bold">Harman Audio 360</h4>
              </div>
              <img
                src="https://images.unsplash.com/photo-1545454675-3531b543be5d?w=200&auto=format&fit=crop&q=80"
                alt=""
                className="w-24 h-24 object-contain"
              />
            </div>

            {/* 6 circular items */}
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { name: 'Boombox', count: '12 Items', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80' },
                { name: 'DSLR Cameras', count: '8 Items', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&auto=format&fit=crop&q=80' },
                { name: 'Microphones', count: '14 Items', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&auto=format&fit=crop&q=80' },
                { name: 'Earbuds', count: '22 Items', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&auto=format&fit=crop&q=80' },
                { name: 'Soundbars', count: '9 Items', img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=100&auto=format&fit=crop&q=80' },
                { name: 'Projectors', count: '6 Items', img: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=100&auto=format&fit=crop&q=80' },
              ].map((it, i) => (
                <div key={i} className="flex flex-col items-center space-y-1">
                  <div className="w-12 h-12 rounded-full bg-slate-50 border border-gray-100 p-1 flex items-center justify-center overflow-hidden">
                    <img src={it.img} alt={it.name} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 leading-tight">{it.name}</span>
                  <span className="text-[9px] text-gray-400">{it.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Gaming */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="font-extrabold text-xs uppercase text-slate-900 tracking-wider">GAMING</span>
              <Link href="/shop?category=gaming-vr" className="text-xs text-primary font-bold hover:underline">View all</Link>
            </div>

            {/* Banner card */}
            <div className="bg-gradient-to-br from-slate-900 to-emerald-950 rounded-2xl p-4 text-white flex items-center justify-between relative overflow-hidden h-32">
              <div className="space-y-1 z-10">
                <span className="text-[10px] font-bold text-teal-300 uppercase">LOGITECH G-SERIES</span>
                <h4 className="text-sm font-bold">Wireless RGB Gaming</h4>
              </div>
              <img
                src="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&auto=format&fit=crop&q=80"
                alt=""
                className="w-24 h-24 object-contain"
              />
            </div>

            {/* 6 circular items */}
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { name: 'Monitors', count: '16 Items', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=100&auto=format&fit=crop&q=80' },
                { name: 'Chairs', count: '7 Items', img: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=100&auto=format&fit=crop&q=80' },
                { name: 'Keyboards', count: '24 Items', img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100&auto=format&fit=crop&q=80' },
                { name: 'Gamepads', count: '18 Items', img: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=100&auto=format&fit=crop&q=80' },
                { name: 'VR Headsets', count: '11 Items', img: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=100&auto=format&fit=crop&q=80' },
                { name: 'Headsets', count: '29 Items', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80' },
              ].map((it, i) => (
                <div key={i} className="flex flex-col items-center space-y-1">
                  <div className="w-12 h-12 rounded-full bg-slate-50 border border-gray-100 p-1 flex items-center justify-center overflow-hidden">
                    <img src={it.img} alt={it.name} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 leading-tight">{it.name}</span>
                  <span className="text-[9px] text-gray-400">{it.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Office Equipments */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="font-extrabold text-xs uppercase text-slate-900 tracking-wider">OFFICE EQUIPMENTS</span>
              <Link href="/shop" className="text-xs text-primary font-bold hover:underline">View all</Link>
            </div>

            {/* Banner card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 text-white flex items-center justify-between relative overflow-hidden h-32">
              <div className="space-y-1 z-10">
                <span className="text-[10px] font-bold text-amber-300 uppercase">OFFICE TECH</span>
                <h4 className="text-sm font-bold">Laser 4K Projector</h4>
              </div>
              <img
                src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=200&auto=format&fit=crop&q=80"
                alt=""
                className="w-24 h-24 object-contain"
              />
            </div>

            {/* 6 circular items */}
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { name: 'Printers', count: '13 Items', img: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=100&auto=format&fit=crop&q=80' },
                { name: 'Routers', count: '19 Items', img: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=100&auto=format&fit=crop&q=80' },
                { name: 'Security Cams', count: '15 Items', img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=100&auto=format&fit=crop&q=80' },
                { name: 'Projectors', count: '8 Items', img: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=100&auto=format&fit=crop&q=80' },
                { name: 'Scanners', count: '6 Items', img: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=100&auto=format&fit=crop&q=80' },
                { name: 'Accessories', count: '34 Items', img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&auto=format&fit=crop&q=80' },
              ].map((it, i) => (
                <div key={i} className="flex flex-col items-center space-y-1">
                  <div className="w-12 h-12 rounded-full bg-slate-50 border border-gray-100 p-1 flex items-center justify-center overflow-hidden">
                    <img src={it.img} alt={it.name} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 leading-tight">{it.name}</span>
                  <span className="text-[9px] text-gray-400">{it.count}</span>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* ============================================================== */}
        {/* 9. DUAL PROMO BANNER (UPGRADE LIVING SPACE + SMART TECH) */}
        {/* ============================================================== */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Modern Living Armchair banner */}
          <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-3xl p-6 sm:p-8 text-white flex items-center justify-between shadow-sm relative overflow-hidden">
            <div className="space-y-2 z-10 max-w-xs">
              <span className="text-[10px] font-bold bg-black/20 px-2.5 py-0.5 rounded uppercase">HOME UPGRADES</span>
              <h3 className="text-xl font-black leading-tight">UPGRADE YOUR LIVING SPACE</h3>
              <p className="text-xs text-teal-100">Smart devices &amp; modern furniture for your digital home</p>
              <Link
                href="/shop"
                className="inline-block bg-white text-slate-900 font-extrabold text-xs uppercase px-5 py-2 rounded-xl mt-2 hover:bg-slate-100 transition-colors shadow-sm"
              >
                Shop Now
              </Link>
            </div>
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&auto=format&fit=crop&q=80"
              alt="Living Armchair"
              className="w-36 h-36 object-contain drop-shadow-xl z-10"
            />
          </div>

          {/* Right: Smart Tech Gadgets */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-6 sm:p-8 text-white flex items-center justify-between shadow-sm relative overflow-hidden">
            <div className="space-y-2 z-10 max-w-xs">
              <span className="text-[10px] font-bold bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded uppercase">NEW TECH</span>
              <h3 className="text-xl font-black leading-tight">PORTABLE POWER STATIONS</h3>
              <p className="text-xs text-gray-300">Clean portable solar generators &amp; smart backup batteries</p>
              <Link
                href="/shop"
                className="inline-block bg-primary text-white font-extrabold text-xs uppercase px-5 py-2 rounded-xl mt-2 hover:bg-primary-dark transition-colors shadow-sm"
              >
                Explore Gear
              </Link>
            </div>
            <img
              src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300&auto=format&fit=crop&q=80"
              alt="Power Station"
              className="w-36 h-36 object-contain drop-shadow-xl z-10"
            />
          </div>
        </section>

        {/* ============================================================== */}
        {/* 10. YOUR RECENTLY VIEWED (BOTTOM SHELF) */}
        {/* ============================================================== */}
        <section className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
              YOUR RECENTLY VIEWED
            </h3>
            <Link href="/shop" className="text-xs text-primary font-bold hover:underline">View all</Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                name: 'Xiaomi Mi Smart Band 7 Black',
                price: '$39.00',
                badge: 'NEW',
                img: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=200&auto=format&fit=crop&q=80',
              },
              {
                name: 'Aluminum Ergonomic Laptop Stand',
                price: '$59.00',
                badge: 'HOT',
                img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&auto=format&fit=crop&q=80',
              },
              {
                name: 'Apple Watch Series 8 GPS Cellular 45mm',
                price: '$479.00 - $1,119.00',
                badge: 'TOP',
                img: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=200&auto=format&fit=crop&q=80',
              },
              {
                name: 'Samsung Galaxy X6 Ultra LTE 128Gb',
                price: '$659.00',
                badge: 'SAVE $140',
                img: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=200&auto=format&fit=crop&q=80',
              },
            ].map((it, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                <img src={it.img} alt={it.name} className="w-12 h-12 object-contain rounded-xl group-hover:scale-105 transition-transform" />
                <div className="overflow-hidden">
                  <span className="text-[9px] font-bold text-teal-600 uppercase">{it.badge}</span>
                  <p className="text-xs font-bold text-slate-800 truncate group-hover:text-primary">{it.name}</p>
                  <p className="text-xs font-black text-slate-900 mt-0.5">{it.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 11. SEO & STORE DESCRIPTION BLOCK (BOTTOM OF PAGE) */}
        {/* ============================================================== */}
        <section className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-4 text-xs text-gray-500 leading-relaxed">
          <h4 className="font-extrabold text-sm text-slate-900">
            Swoo - #1 NYC Online Market Place for Technology
          </h4>
          <p>
            Welcome to SWOO Tech Mart, your premier destination for high-end certified electronics, smartphones, laptops, smart accessories, and gaming rigs in Manhattan, New York. We work directly with verified authorized global brands including Apple, Samsung, Dell, Sony, Xiaomi, Asus, and Logitech to ensure that every product delivered comes with factory warranty and serial number verification.
          </p>
          <p>
            Whether you are outfitting a professional creative workstation with our M-Series MacBooks and Studio Displays, or upgrading your mobile communication with 5G flagships, our streamlined distribution warehouse provides fast express delivery, a 30-day money-back guarantee, and 24/7 dedicated customer support.
          </p>
          <div className="pt-2">
            <Link href="/about" className="text-primary font-bold hover:underline flex items-center gap-1">
              Read more about SWOO Tech Mart <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
