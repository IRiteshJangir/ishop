'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { ShieldCheck, Truck, DollarSign, Award, Users, Globe2, ChevronRight } from 'lucide-react';

export default function AboutPage() {
  const leaderships = [
    { name: 'Henry Avery', role: 'Chairman', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
    { name: 'Michael Edward', role: 'Chief Executive Officer', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
    { name: 'Eden Hazard', role: 'Chief Operating Officer', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80' },
    { name: 'Robert Downey Jr', role: 'Chief Technology Officer', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80' },
    { name: 'Nathan Drake', role: 'Head of Product & Design', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80' },
  ];

  const timeline = [
    { year: '1997', desc: 'Started as a small local hardware repair lab in Manhattan, NYC.' },
    { year: '2002', desc: 'Expanded supply chain to PC assembly and enterprise networking.' },
    { year: '2008', desc: 'Launched first generation digital catalog and direct-to-door courier services.' },
    { year: '2014', desc: 'Opened modern central warehouse and national distribution network.' },
    { year: '2020', desc: 'Introduced contactless express delivery and certified device refurbishment.' },
    { year: '2023', desc: 'Reached 12,000+ active enterprise clients and expanded global tech marketplace.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-12">
        
        {/* Breadcrumbs */}
        <nav className="text-xs text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-gray-400">pages</span>
          <span>/</span>
          <span className="text-slate-900 font-semibold">about</span>
        </nav>

        {/* 1. HERO: "Best experience always wins" */}
        <section className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
              Since 1997
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none">
              Best experience always wins
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              At SWOO Tech Mart, our relentless dedication to technology, authentic product curation, and swift consumer delivery sets a brand new benchmark in the consumer electronics landscape.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=80" alt="" className="rounded-2xl h-48 w-full object-cover shadow" />
            <img src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&auto=format&fit=crop&q=80" alt="" className="rounded-2xl h-48 w-full object-cover shadow mt-4" />
            <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80" alt="" className="rounded-2xl h-48 w-full object-cover shadow" />
          </div>
        </section>

        {/* 2. STATS & PURPOSE */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 bg-primary text-white p-6 rounded-3xl flex flex-col justify-center">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-200">Our Purpose</span>
            <h3 className="text-lg font-black mt-2 leading-snug">
              ENRICH AND ENHANCE LIVES THROUGH TECHNOLOGY
            </h3>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
            <p className="text-3xl font-black text-slate-900">$12,5M</p>
            <p className="text-xs font-bold text-gray-400 uppercase mt-1">TOTAL SALES 2026</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
            <p className="text-3xl font-black text-slate-900">12K+</p>
            <p className="text-xs font-bold text-gray-400 uppercase mt-1">ACTIVE TECH CLIENTS</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
            <p className="text-3xl font-black text-slate-900">725+</p>
            <p className="text-xs font-bold text-gray-400 uppercase mt-1">GLOBAL TEAM MEMBERS</p>
          </div>
        </section>

        {/* 3. SWAT WAREHOUSE & DELIVERY BANNER */}
        <section className="bg-gradient-to-r from-teal-700 to-emerald-600 rounded-3xl p-8 sm:p-12 text-white shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              SWAT Delivery Force
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              We connect millions of buyers and sellers around the world, empowering people &amp; creating economic opportunity for all.
            </h2>
            <p className="text-xs text-teal-100 leading-relaxed">
              Every parcel shipped is packaged with sustainable materials and insured end-to-end to guarantee peace of mind.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80"
              alt="Delivery Team"
              className="rounded-2xl max-h-64 object-cover shadow-2xl border-4 border-white/20"
            />
          </div>
        </section>

        {/* 4. THREE PILLARS (Authentic, Fast, Affordable) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-3 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-primary flex items-center justify-center">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h4 className="font-extrabold text-sm uppercase text-slate-900 tracking-wider">
              100% AUTHENTIC PRODUCTS
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Every device originates straight from verified authorized manufacturers with full serial number warranty registration.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-3 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
              <Truck className="w-7 h-7" />
            </div>
            <h4 className="font-extrabold text-sm uppercase text-slate-900 tracking-wider">
              FAST DELIVERY
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Overnight express courier and rapid local fulfillment centers guarantee delivery directly to your doorstep.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-3 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-7 h-7" />
            </div>
            <h4 className="font-extrabold text-sm uppercase text-slate-900 tracking-wider">
              AFFORDABLE PRICE
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Price match assurance and direct volume partnerships ensure our customers receive maximum value on every purchase.
            </p>
          </div>
        </section>

        {/* 5. OUR MISSION AND VISION GALLERY */}
        <section className="space-y-4">
          <h3 className="font-extrabold text-base uppercase text-slate-900 tracking-wider">
            OUR MISSION AND VISION
          </h3>
          <p className="text-xs text-gray-500 max-w-2xl leading-relaxed">
            To make modern electronic technology accessible, dependable, and enjoyable to every enthusiast, creator, and enterprise client across the globe.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop&q=80" alt="" className="rounded-2xl h-48 w-full object-cover" />
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80" alt="" className="rounded-2xl h-48 w-full object-cover" />
            <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&auto=format&fit=crop&q=80" alt="" className="rounded-2xl h-48 w-full object-cover" />
            <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&auto=format&fit=crop&q=80" alt="" className="rounded-2xl h-48 w-full object-cover" />
          </div>
        </section>

        {/* 6. TIMELINE: FROM A RETAIL STORE TO THE GLOBAL CHAIN */}
        <section className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
          <h3 className="font-extrabold text-base uppercase text-slate-900 tracking-wider">
            FROM A RETAIL STORE TO THE GLOBAL CHAIN OF STORES
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-600">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start border-l-2 border-primary pl-4">
                <div>
                  <span className="font-black text-slate-900 text-sm block">{item.year}</span>
                  <p className="text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. LEADERSHIPS */}
        <section className="space-y-6">
          <h3 className="font-extrabold text-base uppercase text-slate-900 tracking-wider">
            LEADERSHIPS
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {leaderships.map((leader, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center space-y-2">
                <img src={leader.image} alt={leader.name} className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-primary/20" />
                <h5 className="font-bold text-xs text-slate-900">{leader.name}</h5>
                <p className="text-[10px] text-gray-400 font-semibold">{leader.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Green Banner: Member Free Shipping */}
        <div className="bg-emerald-600 text-white rounded-2xl py-3 px-6 text-center text-xs font-semibold">
          ★ Member get FREE SHIPPING with no order minimum. *Restrictions apply.
        </div>

      </main>

      <Footer />
    </div>
  );
}
