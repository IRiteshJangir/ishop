'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { initialProducts, initialCategories, initialBrands, initialColors } from '@/lib/mockData';
import { apiFetch, getImageUrl } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { 
  Filter, ChevronRight, Star, Heart, ShoppingBag, 
  Grid, List, SlidersHorizontal, Check, RefreshCw 
} from 'lucide-react';

export default function ShopPage() {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Dynamic live catalog data from MongoDB
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [brands, setBrands] = useState(initialBrands);
  const [colors, setColors] = useState(initialColors);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2500);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedMemory, setSelectedMemory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [addedItem, setAddedItem] = useState(null);

  // Fetch real MongoDB data on mount
  useEffect(() => {
    apiFetch('/api/products')
      .then(res => {
        if (res.products && res.products.length > 0) setProducts(res.products);
      })
      .catch(() => {});

    apiFetch('/api/categories')
      .then(res => {
        if (res.categories && res.categories.length > 0) setCategories(res.categories);
      })
      .catch(() => {});

    apiFetch('/api/brands')
      .then(res => {
        if (res.brands && res.brands.length > 0) setBrands(res.brands);
      })
      .catch(() => {});

    apiFetch('/api/colors')
      .then(res => {
        if (res.colors && res.colors.length > 0) setColors(res.colors);
      })
      .catch(() => {});
  }, []);

  // Toggle brand checkbox
  const handleBrandChange = (brandName) => {
    setSelectedBrands(prev => 
      prev.includes(brandName) 
        ? prev.filter(b => b !== brandName)
        : [...prev, brandName]
    );
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedBrands([]);
    setMinPrice(0);
    setMaxPrice(2500);
    setSelectedRating(0);
    setSelectedColor('');
    setSelectedMemory('');
    setSelectedCondition('');
    setSortBy('featured');
  };

  // Filter and sort products over live database catalog
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (selectedCategory && product.categoryName?.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brandName)) {
        return false;
      }
      if (product.finalPrice < minPrice || product.finalPrice > maxPrice) {
        return false;
      }
      if (selectedRating > 0 && product.rating < selectedRating) {
        return false;
      }
      if (selectedColor && !product.colorNames?.some(c => c.toLowerCase().includes(selectedColor.toLowerCase()))) {
        return false;
      }
      if (selectedMemory && !product.memorySizes?.includes(selectedMemory)) {
        return false;
      }
      if (selectedCondition && product.condition !== selectedCondition) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.finalPrice - b.finalPrice;
      if (sortBy === 'price_desc') return b.finalPrice - a.finalPrice;
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      if (sortBy === 'best_selling') return (b.isTopSelling ? 1 : 0) - (a.isTopSelling ? 1 : 0);
      return 0; // featured default
    });
  }, [products, selectedCategory, selectedBrands, minPrice, maxPrice, selectedRating, selectedColor, selectedMemory, selectedCondition, sortBy]);

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedItem(product._id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        
        {/* Top Category Hero Banner (Page 11) */}
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
          <div className="relative z-10 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-400">
              TOP CELL PHONES &amp; TABLETS
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Noise Cancelling Flagships &amp; Pro Workstations
            </h1>
            <p className="text-xs text-gray-300 max-w-lg">
              Explore unbeatable deals on certified smartphones, laptops, audio gear, and verified tech with manufacturer warranty.
            </p>
          </div>
        </section>

        {/* Best Seller in this category horizontal carousel */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 mb-4">
            BEST SELLER IN THIS CATEGORY
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {products.slice(0, 4).map(p => (
              <div key={p._id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all">
                <img src={p.thumbnail} alt={p.name} className="w-14 h-14 object-contain rounded-lg" />
                <div className="overflow-hidden">
                  <span className="text-[9px] font-bold text-teal-600 uppercase">{p.brandName || 'TECH'}</span>
                  <Link href={`/product/${p.slug}`}>
                    <h5 className="text-xs font-bold text-slate-900 truncate hover:text-primary">{p.name}</h5>
                  </Link>
                  <p className="text-xs font-black text-slate-900">${p.finalPrice}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Main Content: Filters Sidebar + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* LEFT FILTER SIDEBAR */}
          <aside className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <h3 className="font-extrabold text-xs uppercase text-slate-900 tracking-wider">FILTERS</h3>
              </div>
              <button 
                onClick={resetFilters} 
                className="text-xs text-gray-400 hover:text-primary flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* 1. Category Filter */}
            <div>
              <h4 className="font-bold text-xs uppercase text-slate-800 mb-3 tracking-wider">CATEGORIES</h4>
              <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                <li>
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left py-1 hover:text-primary ${selectedCategory === '' ? 'text-primary font-bold' : ''}`}
                  >
                    All Categories ({products.length})
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat._id || cat.slug}>
                    <button
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full text-left py-1 hover:text-primary ${selectedCategory.toLowerCase() === cat.name.toLowerCase() ? 'text-primary font-bold' : ''}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. By Brands */}
            <div className="border-t border-gray-100 pt-5">
              <h4 className="font-bold text-xs uppercase text-slate-800 mb-3 tracking-wider">BY BRANDS</h4>
              <div className="space-y-2 text-xs">
                {brands.map(b => (
                  <label key={b._id || b.slug} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(b.name)}
                      onChange={() => handleBrandChange(b.name)}
                      className="rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5"
                    />
                    <span>{b.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. By Price Slider */}
            <div className="border-t border-gray-100 pt-5">
              <h4 className="font-bold text-xs uppercase text-slate-800 mb-3 tracking-wider">BY PRICE</h4>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="2500"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>${minPrice}</span>
                  <span className="text-primary font-bold">Max: ${maxPrice}</span>
                </div>
              </div>
            </div>

            {/* 4. By Rating */}
            <div className="border-t border-gray-100 pt-5">
              <h4 className="font-bold text-xs uppercase text-slate-800 mb-3 tracking-wider">BY RATING</h4>
              <div className="space-y-2">
                {[5, 4, 3].map(rating => (
                  <label 
                    key={rating} 
                    onClick={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
                    className="flex items-center gap-2 text-xs cursor-pointer hover:bg-slate-50 p-1 rounded"
                  >
                    <input
                      type="radio"
                      name="ratingFilter"
                      checked={selectedRating === rating}
                      readOnly
                      className="text-primary accent-primary"
                    />
                    <div className="flex text-amber-400">
                      {[...Array(rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-slate-500 text-[11px]">&amp; Up</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 5. By Color Palette */}
            <div className="border-t border-gray-100 pt-5">
              <h4 className="font-bold text-xs uppercase text-slate-800 mb-3 tracking-wider">BY COLOR</h4>
              <div className="flex flex-wrap gap-2">
                {colors.map(c => (
                  <button
                    key={c._id || c.slug}
                    onClick={() => setSelectedColor(selectedColor === c.name ? '' : c.name)}
                    style={{ backgroundColor: c.hexColor || c.hex }}
                    title={c.name}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      selectedColor === c.name ? 'scale-125 border-primary ring-2 ring-primary/40' : 'border-gray-200 hover:scale-110'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 6. By Memory Size */}
            <div className="border-t border-gray-100 pt-5">
              <h4 className="font-bold text-xs uppercase text-slate-800 mb-3 tracking-wider">MEMORY SIZE</h4>
              <div className="flex flex-wrap gap-2">
                {['64GB', '128GB', '256GB', '512GB', '1TB'].map(mem => (
                  <button
                    key={mem}
                    onClick={() => setSelectedMemory(selectedMemory === mem ? '' : mem)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      selectedMemory === mem 
                        ? 'border-primary bg-primary text-white shadow-sm' 
                        : 'border-gray-200 text-slate-700 hover:border-gray-300'
                    }`}
                  >
                    {mem}
                  </button>
                ))}
              </div>
            </div>

            {/* 7. Condition */}
            <div className="border-t border-gray-100 pt-5">
              <h4 className="font-bold text-xs uppercase text-slate-800 mb-3 tracking-wider">CONDITION</h4>
              <div className="space-y-2 text-xs">
                {['New', 'Refurbished', 'Used'].map(cond => (
                  <label key={cond} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer">
                    <input
                      type="radio"
                      name="conditionFilter"
                      checked={selectedCondition === cond}
                      onChange={() => setSelectedCondition(cond)}
                      className="text-primary accent-primary"
                    />
                    <span>{cond}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT PRODUCTS GRID / LIST */}
          <section className="lg:col-span-3 space-y-6">
            
            {/* Toolbar */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 font-medium">
                Showing <strong className="text-slate-900">{filteredProducts.length}</strong> of {products.length} products
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400 font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-semibold outline-none cursor-pointer"
                  >
                    <option value="featured">Featured Deals</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Top Customer Rated</option>
                    <option value="best_selling">Best Selling</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-400 hover:text-slate-700'}`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-400 hover:text-slate-700'}`}
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid View */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((p) => {
                  const inWish = isInWishlist(p._id);
                  return (
                    <div 
                      key={p._id} 
                      className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative"
                    >
                      {/* Top badges */}
                      <div className="flex items-center justify-between mb-2">
                        {p.isTopSelling ? (
                          <span className="bg-purple-100 text-purple-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                            TOP SELLING
                          </span>
                        ) : p.discount > 0 ? (
                          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                            SAVE {p.discount}%
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400 font-bold uppercase">{p.brandName || 'ELECTRONICS'}</span>
                        )}

                        <button 
                          onClick={() => toggleWishlist(p)}
                          className={`p-1.5 rounded-full transition-colors ${inWish ? 'text-rose-500 bg-rose-50' : 'text-gray-300 hover:text-rose-500 hover:bg-slate-50'}`}
                        >
                          <Heart className={`w-4 h-4 ${inWish ? 'fill-rose-500' : ''}`} />
                        </button>
                      </div>

                      {/* Image */}
                      <Link href={`/product/${p.slug}`} className="block h-48 w-full p-2 overflow-hidden flex items-center justify-center">
                        <img 
                          src={getImageUrl(p.thumbnail)} 
                          alt={p.name} 
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" 
                        />
                      </Link>

                      {/* Info */}
                      <div className="space-y-2 pt-3 border-t border-gray-50">
                        <div className="flex items-center gap-1 text-[11px] text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="font-bold text-slate-700">{p.rating || 5.0}</span>
                          <span className="text-gray-400">({p.numReviews || 24})</span>
                        </div>

                        <Link href={`/product/${p.slug}`}>
                          <h4 className="font-bold text-xs text-slate-800 hover:text-primary transition-colors line-clamp-2">
                            {p.name}
                          </h4>
                        </Link>

                        <div className="flex items-baseline gap-2">
                          <span className="font-black text-sm text-slate-900">${p.finalPrice}</span>
                          {p.originalPrice > p.finalPrice && (
                            <span className="text-xs text-gray-400 line-through">${p.originalPrice}</span>
                          )}
                        </div>

                        <div className="pt-2 flex items-center gap-2">
                          <button
                            onClick={(e) => handleAddToCart(p, e)}
                            className="flex-1 py-2 bg-slate-900 hover:bg-primary text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>{addedItem === p._id ? 'Added!' : 'Add to Cart'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* List View */
              <div className="space-y-4">
                {filteredProducts.map((p) => (
                  <div key={p._id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-40 h-40 flex-shrink-0 flex items-center justify-center p-2 bg-slate-50 rounded-xl">
                      <img src={getImageUrl(p.thumbnail)} alt={p.name} className="max-h-full max-w-full object-contain" />
                    </div>

                    <div className="flex-1 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">{p.brandName}</span>
                      <Link href={`/product/${p.slug}`}>
                        <h4 className="font-bold text-sm text-slate-900 hover:text-primary transition-colors">{p.name}</h4>
                      </Link>
                      <p className="text-xs text-gray-500 line-clamp-2">{p.teaserText || p.description}</p>
                      
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base text-slate-900">${p.finalPrice}</span>
                        {p.originalPrice > p.finalPrice && (
                          <span className="text-xs text-gray-400 line-through">${p.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(p, e)}
                      className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-colors whitespace-nowrap shadow-sm"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{addedItem === p._id ? 'Added!' : 'Add to Cart'}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-3">
                <p className="text-base font-bold text-slate-800">No products match your criteria</p>
                <p className="text-xs text-gray-400">Try widening your price range or clearing active filters.</p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            )}

          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
