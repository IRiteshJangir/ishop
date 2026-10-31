'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, Tag, Palette, Building2, Package, 
  ShoppingCart, Users, LogOut, Search, Bell, Settings, 
  AlertCircle, ChevronDown, Store, Lock 
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAdmin, loading } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  // If on admin login page, don't show admin layout sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Category', href: '/admin/categories', icon: Tag },
    { label: 'Colors', href: '/admin/colors', icon: Palette },
    { label: 'Brands', href: '/admin/brands', icon: Building2 },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Users', href: '/admin/users', icon: Users, badge: 'NEW' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  // Auth Guard for admin routes
  if (!loading && !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Admin Portal Access Restricted</h2>
        <p className="text-xs text-gray-400 max-w-sm mt-2">
          You must be signed in with administrator privileges to access this area.
        </p>
        <div className="pt-6 flex items-center gap-3">
          <Link
            href="/admin/login"
            className="px-6 py-2.5 bg-admin-primary hover:bg-admin-hover text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            Admin Sign In
          </Link>
          <Link
            href="/"
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl text-xs font-bold transition-all"
          >
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex text-slate-800">
      
      {/* 1. ADMIN SIDEBAR (matching admin screenshots) */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-6 shadow-sm flex-shrink-0 min-h-screen">
        <div className="space-y-6">
          {/* Admin Logo */}
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-xl font-black text-amber-600 tracking-tight">Admin</span>
            </Link>
            <Link href="/" title="View Storefront" className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-slate-50 transition-colors">
              <Store className="w-4 h-4" />
            </Link>
          </div>

          {/* Section: APPS */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">APPS</p>
            <nav className="space-y-1 text-xs font-semibold">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-admin-primary/10 text-admin-primary font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-admin-primary' : 'text-gray-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-amber-300 text-amber-900 text-[9px] font-black px-1.5 py-0.5 rounded">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-gray-400" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom Issue Pill matching screenshot */}
        <div className="pt-6 border-t border-gray-100">
          <div className="bg-rose-600 text-white rounded-full px-3 py-1 text-[11px] font-bold flex items-center justify-between shadow-sm cursor-pointer hover:bg-rose-700 transition-colors">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>1 Issue</span>
            </span>
            <span>✕</span>
          </div>
        </div>
      </aside>

      {/* 2. ADMIN MAIN VIEW */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header matching admin.pdf */}
        <header className="h-16 bg-white border-b border-gray-100 px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
          {/* Search bar */}
          <div className="flex-1 max-w-xl relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-slate-50 border border-transparent hover:border-gray-200 focus:border-admin-primary rounded-xl pl-9 pr-4 py-2 text-xs outline-none transition-colors"
            />
          </div>

          {/* Action icons & Profile */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg relative transition-colors">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
            </button>

            {/* Admin Profile */}
            <div className="relative">
              <div 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded-xl transition-colors"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Admin"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-bold text-slate-800">Admin</span>
              </div>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 text-xs">
                  <Link href="/admin" onClick={() => setProfileOpen(false)} className="block px-4 py-2 hover:bg-slate-50 text-slate-700">Admin Dashboard</Link>
                  <Link href="/" onClick={() => setProfileOpen(false)} className="block px-4 py-2 hover:bg-slate-50 text-slate-700">View Live Store</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600">Sign Out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>

    </div>
  );
}
