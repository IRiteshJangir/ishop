'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { initialProducts } from '@/lib/mockData';
import { apiFetch } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { 
  Star, Heart, ShoppingBag, ShieldCheck, Truck, RefreshCw, 
  PhoneCall, Check, Share2, Plus, Minus, CheckSquare, Square 
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug;

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Dynamic product loaded from live backend MongoDB API
  const [product, setProduct] = useState(() => {
    return initialProducts.find(p => p.slug === slug) || initialProducts[0];
  });

  const [selectedImage, setSelectedImage] = useState(product?.thumbnail);
  const [selectedColor, setSelectedColor] = useState(product?.colorNames?.[0] || 'Space Gray');
  const [selectedMemory, setSelectedMemory] = useState(product?.memorySizes?.[0] || '128GB');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [bundleChecked, setBundleChecked] = useState([true, true, true]);
  const [addedNotice, setAddedNotice] = useState(false);
  const [liveRelated, setLiveRelated] = useState([]);

  useEffect(() => {
    if (slug) {
      apiFetch(`/api/products/${slug}`)
        .then(res => {
          if (res.product) {
            setProduct(res.product);
            if (res.product.thumbnail) setSelectedImage(res.product.thumbnail);
            if (res.product.colorNames?.[0]) setSelectedColor(res.product.colorNames[0]);
            if (res.product.memorySizes?.[0]) setSelectedMemory(res.product.memorySizes[0]);
          }
        })
        .catch(() => {});
    }

    apiFetch('/api/products')
      .then(res => {
        if (res.products && res.products.length > 0) {
          setLiveRelated(res.products.filter(p => p.slug !== slug).slice(0, 4));
        }
      })
      .catch(() => {});
  }, [slug]);

  // Bundle items
  const bundleItems = [
    { name: product.name, price: product.finalPrice, image: product.thumbnail },
    { name: 'Swoo Ultra Clear Shockproof Case', price: 15.0, image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=100&auto=format&fit=crop&q=80' },
    { name: '9H Tempered Glass Screen Protector (2-Pack)', price: 15.0, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&auto=format&fit=crop&q=80' },
  ];

  const bundleTotal = bundleItems.reduce((acc, item, idx) => {
    return bundleChecked[idx] ? acc + item.price : acc;
  }, 0);

  const toggleBundle = (idx) => {
    const updated = [...bundleChecked];
    updated[idx] = !updated[idx];
    setBundleChecked(updated);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedMemory);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const relatedProducts = liveRelated.length ? liveRelated : initialProducts.filter(p => p._id !== product?._id).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-10">
        
        {/* Breadcrumbs */}
        <nav className="text-xs text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-primary">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${encodeURIComponent(product.categoryName)}`} className="hover:text-primary">{product.categoryName}</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* TOP PRODUCT SECTION: Gallery + Center Details + Buy Box */}
        <section className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Gallery (Cols 1-5) */}
          <div className="lg:col-span-5 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-2 overflow-x-auto">
              {(product.images?.length ? product.images : [product.thumbnail]).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-xl border-2 p-1 overflow-hidden transition-all flex-shrink-0 ${
                    selectedImage === img ? 'border-primary shadow' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 bg-slate-50 rounded-2xl p-6 flex items-center justify-center relative min-h-[320px]">
              <img
                src={selectedImage || product.thumbnail}
                alt={product.name}
                className="max-h-80 object-contain hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-4 left-4 bg-emerald-50 text-emerald-700 font-bold text-xs px-2.5 py-1 rounded-md">
                {product.discount ? `${product.discount}% OFF` : 'NEW'}
              </span>
            </div>
          </div>

          {/* Product Center Details (Cols 6-8) */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">{product.brandName}</span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-700">{product.rating}</span>
              <span className="text-xs text-gray-400">({product.numReviews} customer reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl font-black text-slate-900">${product.finalPrice}</span>
              {product.originalPrice > product.finalPrice && (
                <span className="text-base font-semibold text-gray-400 line-through">${product.originalPrice}</span>
              )}
            </div>

            <p className="text-xs text-gray-500 leading-relaxed border-t border-b border-gray-100 py-3">
              {product.teaserText}
            </p>

            {/* Color Swatches */}
            {product.colorNames?.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800">
                  COLOR: <span className="font-normal text-gray-500">{selectedColor}</span>
                </span>
                <div className="flex items-center gap-2">
                  {product.colorNames.map((colorName, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(colorName)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        selectedColor === colorName
                          ? 'border-primary bg-primary/10 text-primary font-bold'
                          : 'border-gray-200 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {colorName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Memory Size Selection */}
            {product.memorySizes?.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-slate-800">
                  MEMORY SIZE: <span className="font-normal text-gray-500">{selectedMemory}</span>
                </span>
                <div className="flex items-center gap-2">
                  {product.memorySizes.map((mem) => (
                    <button
                      key={mem}
                      onClick={() => setSelectedMemory(mem)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        selectedMemory === mem
                          ? 'border-primary bg-primary text-white font-bold'
                          : 'border-gray-200 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {mem}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SKU and Meta */}
            <div className="pt-3 text-[11px] text-gray-400 space-y-1">
              <p>SKU: <span className="text-slate-700 font-semibold">SWOO-{product._id}</span></p>
              <p>CATEGORY: <span className="text-slate-700 font-semibold">{product.categoryName}</span></p>
              <p>AVAILABILITY: <span className="text-emerald-600 font-bold">In Stock ({product.countInStock} items)</span></p>
            </div>
          </div>

          {/* Right Buy Box (Cols 9-12) */}
          <div className="lg:col-span-3 bg-slate-50 rounded-2xl p-6 border border-gray-100 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs text-gray-400">Total Price:</span>
                <p className="text-2xl font-black text-slate-900">${(product.finalPrice * quantity).toFixed(2)}</p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-sm text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-extrabold text-xs uppercase transition-all shadow-md flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{addedNotice ? 'Added To Cart!' : 'Add To Cart'}</span>
              </button>

              {/* Buy with PayPal button */}
              <Link
                href="/checkout"
                className="w-full py-3 bg-[#ffc439] hover:bg-[#f4b92b] text-slate-900 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Buy with</span>
                <span className="font-black italic text-blue-900">PayPal</span>
              </Link>
            </div>

            {/* Guarantees Box */}
            <div className="border-t border-gray-200 pt-4 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" />
                <span>Free shipping on all orders over $199</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-primary" />
                <span>30 Days hassle-free return window</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>100% Genuine brand authentic product</span>
              </div>
            </div>

            {/* Hotline support */}
            <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-primary rounded-lg">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Dedicated Support</p>
                <p className="text-xs font-black text-slate-900">(025) 3886 25 16</p>
              </div>
            </div>
          </div>
        </section>

        {/* FREQUENTLY BOUGHT TOGETHER BUNDLE (Page 10) */}
        <section className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="font-extrabold text-sm uppercase text-slate-900 tracking-wider">
            FREQUENTLY BOUGHT TOGETHER
          </h3>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex flex-wrap items-center gap-4">
              {bundleItems.map((item, idx) => (
                <React.Fragment key={idx}>
                  <div className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center max-w-[180px] text-center ${
                    bundleChecked[idx] ? 'border-primary bg-slate-50/50' : 'border-gray-200 opacity-60'
                  }`}>
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-contain rounded-lg" />
                    <p className="text-xs font-bold text-slate-900 mt-2 line-clamp-1">{item.name}</p>
                    <p className="text-xs font-black text-primary mt-1">${item.price.toFixed(2)}</p>
                  </div>
                  {idx < bundleItems.length - 1 && (
                    <span className="text-slate-300 font-bold text-xl">+</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Bundle Total & Checkboxes */}
            <div className="space-y-4 max-w-sm w-full bg-slate-50 p-6 rounded-2xl border border-gray-100">
              <div className="space-y-2 text-xs">
                {bundleItems.map((item, idx) => (
                  <label key={idx} className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={bundleChecked[idx]}
                      onChange={() => toggleBundle(idx)}
                      className="rounded text-primary focus:ring-primary h-4 w-4"
                    />
                    <span className="line-clamp-1">{item.name} - <strong>${item.price.toFixed(2)}</strong></span>
                  </label>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-semibold">Total Price:</span>
                <span className="text-xl font-black text-slate-900">${bundleTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={() => {
                  addToCart(product, 1);
                  setAddedNotice(true);
                  setTimeout(() => setAddedNotice(false), 2500);
                }}
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold uppercase transition-colors"
              >
                Add Bundle To Cart
              </button>
            </div>
          </div>
        </section>

        {/* DETAILED TABS: DESCRIPTION / REVIEWS / ADDITIONAL INFORMATION */}
        <section className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Tab buttons */}
          <div className="flex items-center gap-8 border-b border-gray-200 text-xs font-extrabold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-3 transition-colors relative ${
                activeTab === 'description' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-slate-700'
              }`}
            >
              DESCRIPTION
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 transition-colors relative ${
                activeTab === 'reviews' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-slate-700'
              }`}
            >
              REVIEWS ({product.numReviews})
            </button>
            <button
              onClick={() => setActiveTab('additional')}
              className={`pb-3 transition-colors relative ${
                activeTab === 'additional' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-slate-700'
              }`}
            >
              ADDITIONAL INFORMATION
            </button>
          </div>

          {/* Tab content */}
          {activeTab === 'description' && (
            <div className="space-y-6 text-xs text-slate-600 leading-relaxed">
              <div 
                className="prose prose-sm max-w-none text-slate-600"
                dangerouslySetInnerHTML={{ __html: product.description || product.teaserText }} 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="rounded-2xl overflow-hidden shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80"
                    alt=""
                    className="w-full h-56 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80"
                    alt=""
                    className="w-full h-56 object-cover"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6 text-xs">
              <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-2xl">
                <div className="text-center pr-6 border-r border-gray-200">
                  <span className="text-4xl font-black text-slate-900">{product.rating}</span>
                  <div className="flex text-amber-400 justify-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400">Based on {product.numReviews} ratings</span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  98% of customers recommend this verified tech device for performance, build quality, battery endurance, and premium design.
                </p>
              </div>

              {/* Sample Review list */}
              <div className="space-y-4 pt-2">
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">David Miller</span>
                    <span className="text-gray-400 text-[10px]">October 28, 2026</span>
                  </div>
                  <div className="flex text-amber-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-600">Exceptional build quality, fast next-day delivery, and the display resolution is stunning!</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'additional' && (
            <div className="text-xs">
              <table className="w-full border border-gray-100 rounded-xl overflow-hidden">
                <tbody className="divide-y divide-gray-100">
                  <tr className="bg-slate-50">
                    <td className="p-3 font-bold text-slate-800 w-1/3">Brand</td>
                    <td className="p-3 text-slate-600">{product.brandName}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-800">Category</td>
                    <td className="p-3 text-slate-600">{product.categoryName}</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-3 font-bold text-slate-800">Color Options</td>
                    <td className="p-3 text-slate-600">{product.colorNames?.join(', ')}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-800">Storage Variants</td>
                    <td className="p-3 text-slate-600">{product.memorySizes?.join(', ')}</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-3 font-bold text-slate-800">Condition</td>
                    <td className="p-3 text-slate-600">{product.condition}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* RELATED PRODUCTS */}
        <section className="space-y-4">
          <h3 className="font-extrabold text-sm uppercase text-slate-900 tracking-wider">
            RELATED PRODUCTS
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <div key={p._id} className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col justify-between hover:shadow-md transition-all">
                <Link href={`/product/${p.slug}`} className="block my-2">
                  <img src={p.thumbnail} alt={p.name} className="w-full h-36 object-contain" />
                </Link>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">{p.brandName}</span>
                  <Link href={`/product/${p.slug}`}>
                    <h5 className="text-xs font-bold text-slate-900 hover:text-primary truncate">{p.name}</h5>
                  </Link>
                  <p className="text-xs font-black text-slate-900">${p.finalPrice}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
