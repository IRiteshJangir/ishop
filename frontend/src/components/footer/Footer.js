'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { TwitterIcon, FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/ui/SocialIcons';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 text-slate-700 text-xs">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top 5 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-gray-100">
          {/* Column 1: Hotline & Store Address */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-sm uppercase text-slate-900 tracking-wider">
              SWOO - 1ST NYC TECH ONLINE MARKET
            </h4>
            <div>
              <p className="text-[11px] text-gray-400 font-semibold uppercase">HOTLINE 24/7</p>
              <p className="text-xl font-black text-rose-500 tracking-tight mt-0.5">(025) 3686 25 16</p>
            </div>
            <p className="text-gray-500 leading-relaxed text-xs">
              257 Thatcher Road St, Brooklyn, Manhattan, NY 10092
            </p>
            <p className="text-gray-500 text-xs hover:text-primary transition-colors">
              <a href="mailto:contact@swootechmart.com">contact@swootechmart.com</a>
            </p>

            <div className="flex items-center gap-3 pt-2 text-gray-500">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-primary hover:text-white flex items-center justify-center transition-all">
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-primary hover:text-white flex items-center justify-center transition-all">
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-primary hover:text-white flex items-center justify-center transition-all">
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-primary hover:text-white flex items-center justify-center transition-all">
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Top Categories */}
          <div>
            <h4 className="font-bold text-xs uppercase text-slate-900 mb-4 tracking-wider">
              TOP CATEGORIES
            </h4>
            <ul className="space-y-2.5 text-gray-500 text-xs">
              <li><Link href="/shop?category=laptops" className="hover:text-primary transition-colors">Laptops</Link></li>
              <li><Link href="/shop?category=desktop" className="hover:text-primary transition-colors">PC & Computers</Link></li>
              <li><Link href="/shop?category=mobile-phone" className="hover:text-primary transition-colors">Cell Phones</Link></li>
              <li><Link href="/shop?category=tablets" className="hover:text-primary transition-colors">Tablets</Link></li>
              <li><Link href="/shop?category=gaming-vr" className="hover:text-primary transition-colors">Gaming & VR</Link></li>
              <li><Link href="/shop" className="hover:text-primary transition-colors">Networks</Link></li>
              <li><Link href="/shop" className="hover:text-primary transition-colors">Cameras</Link></li>
              <li><Link href="/shop?category=headphone" className="hover:text-primary transition-colors">Sounds</Link></li>
              <li><Link href="/shop" className="hover:text-primary transition-colors">Office</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="font-bold text-xs uppercase text-slate-900 mb-4 tracking-wider">
              COMPANY
            </h4>
            <ul className="space-y-2.5 text-gray-500 text-xs">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Swoo</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Career</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/shop" className="hover:text-primary transition-colors">Sitemap</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Store Locations</Link></li>
            </ul>
          </div>

          {/* Column 4: Help Center */}
          <div>
            <h4 className="font-bold text-xs uppercase text-slate-900 mb-4 tracking-wider">
              HELP CENTER
            </h4>
            <ul className="space-y-2.5 text-gray-500 text-xs">
              <li><Link href="/contact" className="hover:text-primary transition-colors">Customer Service</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Policy</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/profile" className="hover:text-primary transition-colors">Track Order</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">FAQs</Link></li>
              <li><Link href="/profile" className="hover:text-primary transition-colors">My Account</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Product Support</Link></li>
            </ul>
          </div>

          {/* Column 5: Partner */}
          <div>
            <h4 className="font-bold text-xs uppercase text-slate-900 mb-4 tracking-wider">
              PARTNER
            </h4>
            <ul className="space-y-2.5 text-gray-500 text-xs">
              <li><Link href="/contact" className="hover:text-primary transition-colors">Become Seller</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Affiliate</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Advertise</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Partnership</Link></li>
            </ul>
          </div>
        </div>

        {/* Middle Newsletter Section */}
        <div className="py-8 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-500">USD ▾</span>
            <span className="text-xs text-gray-500">🇺🇸 Eng ▾</span>
          </div>

          <div className="flex-1 max-w-xl w-full">
            <p className="font-extrabold text-xs uppercase text-slate-900 tracking-wider mb-2">
              SUBSCRIBE & GET 10% OFF FOR YOUR FIRST ORDER
            </p>
            <form onSubmit={handleSubscribe} className="flex items-center gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase px-6 py-2.5 rounded-lg transition-colors"
              >
                SUBSCRIBE
              </button>
            </form>
            {subscribed && (
              <p className="text-emerald-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Thank you for subscribing! Check your inbox for the discount code.
              </p>
            )}
            <p className="text-[11px] text-gray-400 mt-1.5">
              By subscribing, you&apos;ve accepted our <Link href="/about" className="underline hover:text-primary">Policy</Link>
            </p>
          </div>
        </div>

        {/* Bottom copyright and payment methods */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-[11px]">
          <div>
            <p>© 2026 Shawonetc3. All Rights Reserved</p>
          </div>

          {/* Payment providers */}
          <div className="flex items-center gap-4">
            <span className="px-2.5 py-1 bg-gray-100 rounded font-bold text-[10px] text-blue-700">PayPal</span>
            <span className="px-2.5 py-1 bg-gray-100 rounded font-bold text-[10px] text-orange-600">MasterCard</span>
            <span className="px-2.5 py-1 bg-gray-100 rounded font-bold text-[10px] text-blue-900">VISA</span>
            <span className="px-2.5 py-1 bg-gray-100 rounded font-bold text-[10px] text-indigo-600">stripe</span>
            <span className="px-2.5 py-1 bg-gray-100 rounded font-bold text-[10px] text-pink-600">Klarna.</span>
          </div>

          <div>
            <a href="#" className="hover:text-primary underline">Mobile Site</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
