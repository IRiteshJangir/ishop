'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { initialProducts, initialCategories, initialBrands, initialColors } from '@/lib/mockData';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { 
  Filter, ChevronRight, Star, Heart, ShoppingBag, 
  Grid, List, SlidersHorizontal, Check, RefreshCw 
} from 'lucide-react';

export default function ShopPage() {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

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

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
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
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'best_selling') return (b.isTopSelling ? 1 : 0) - (a.isTopSelling ? 1 : 0);
      return 0; // featured default
    });
  }, [selectedCategory, selectedBrands, minPrice, maxPrice, selectedRating, selectedColor, selectedMemory, selectedCondition, sortBy]);

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
              Noise Cancelling Flagships &amp; Pro Tablets
            </h1>
            <p className="text-xs text-gray-300 max-w-lg">
              Explore unbeatable deals on certified smartphones, pro workstations, iPads, and accessories with manufacturer warranty.
            </p>
          </div>
        </section>

        {/* Best Seller in this category horizontal carousel */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 mb-4">
            BEST SELLER IN THIS CATEGORY
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {initialProducts.slice(0, 4).map(p => (
              <div key={p._id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all">
                <img src={p.thumbnail} alt={p.name} className="w-14 h-14 object-contain rounded-lg" />
                <div className="overflow-hidden">
                  <span className="text-[9px] font-bold text-teal-600 uppercase">{p.brandName}</span>
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
                    All Categories ({initialProducts.length})
                  </button>
                </li>
                {initialCategories.map(cat => (
                  <li key={cat._id}>
                    <button
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full text-left py-1 hover:text-primary ${selectedCategory === cat.name ? 'text-primary font-bold' : ''}`}
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
                {initialBrands.map(b => (
                  <label key={b._id} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer">
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
                {initialColors.map(c => (
                  <button
                    key={c._id}
                    onClick={() => setSelectedColor(selectedColor === c.name ? '' : c.name)}
                    style={{ backgroundColor: c.hexColor }}
                    title={c.name}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      selectedColor === c.name ? 'scale-125 border-primary ring-2 ring-primary/40' : 'border-gray-200 hover:scale-110'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 6. By Memory Capacity */}
            <div className="border-t border-gray-100 pt-5">
              <h4 className="font-bold text-xs uppercase text-slate-800 mb-3 tracking-wider">BY MEMORY</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['64GB', '128GB', '256GB', '512GB', '1TB'].map(mem => (
                  <button
                    key={mem}
                    onClick={() => setSelectedMemory(selectedMemory === mem ? '' : mem)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                      selectedMemory === mem ? 'bg-primary text-white border-primary' : 'bg-slate-50 border-gray-200 text-slate-700 hover:border-gray-400'
                    }`}
                  >
                    {mem}
                  </button>
                ))}
              </div>
            </div>

            {/* 7. Promotional Sidebar Box (Page 11) */}
            <div className="border-t border-gray-100 pt-5">
              <div className="bg-gradient-to-br from-slate-900 to-teal-950 rounded-2xl p-4 text-white space-y-2">
                <span className="text-[10px] bg-rose-500 font-extrabold px-2 py-0.5 rounded uppercase">Hot Deal</span>
                <h5 className="font-black text-sm">OKODo hero 11+ 5K wireless</h5>
                <p className="text-xl font-black text-teal-300">$169.00</p>
                <Link
                  href="/product/okodo-hero-11-plus-5k-wireless"
                  className="block text-center w-full py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Order Now
                </Link>
              </div>
            </div>
          </aside>

          {/* RIGHT PRODUCTS GRID */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Top Toolbar */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-gray-500 font-medium">
                Showing <strong className="text-slate-900">{filteredProducts.length}</strong> of {initialProducts.length} results
              </span>

              <div className="flex items-center gap-4">
                {/* Sort dropdown */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-primary font-medium"
                  >
                    <option value="featured">Featured</option>
                    <option value="best_selling">Best Selling</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                  </select>
                </div>

                {/* View Switcher */}
                <div className="flex items-center bg-slate-50 p-1 rounded-lg border border-gray-200">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow text-primary' : 'text-gray-400'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow text-primary' : 'text-gray-400'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products List or Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-3">
                <p className="text-lg font-bold text-slate-800">No products matched your filters</p>
                <p className="text-xs text-gray-500">Try adjusting your price range, selected brand, or category.</p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map(product => (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col justify-between hover:shadow-lg transition-all group relative"
                  >
                    <div>
                      {/* Top badges */}
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-emerald-50 text-emerald-700 font-extrabold text-[10px] px-2 py-0.5 rounded">
                          {product.discount ? `SAVE $${Math.round(product.originalPrice - product.finalPrice)}` : 'NEW'}
                        </span>
                        <button
                          onClick={() => toggleWishlist(product)}
                          className="p-1 text-gray-400 hover:text-rose-500 transition-colors"
                        >
                          <Heart className={`w-4 h-4 ${isInWishlist(product._id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                      </div>

                      {/* Image */}
                      <Link href={`/product/${product.slug}`} className="block my-3 overflow-hidden rounded-xl">
                        <img
                          src={product.thumbnail}
                          alt={product.name}
                          className="w-full h-44 object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      {/* Info */}
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{product.brandName}</span>
                      <Link href={`/product/${product.slug}`}>
                        <h4 className="text-sm font-bold text-slate-900 hover:text-primary transition-colors line-clamp-2 mt-0.5">
                          {product.name}
                        </h4>
                      </Link>

                      {/* Ratings */}
                      <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="font-bold text-slate-700">{product.rating}</span>
                        <span className="text-gray-400">({product.numReviews})</span>
                      </div>
                    </div>

                    {/* Bottom Price & Button */}
                    <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-black text-slate-900">${product.finalPrice}</span>
                        {product.originalPrice > product.finalPrice && (
                          <span className="block text-xs text-gray-400 line-through">${product.originalPrice}</span>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="p-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-sm transition-colors flex items-center gap-1.5 text-xs font-bold"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>{addedItem === product._id ? 'Added' : 'Cart'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List Mode */
              <div className="space-y-4">
                {filteredProducts.map(product => (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col sm:flex-row items-center gap-6 hover:shadow-lg transition-all"
                  >
                    <img src={product.thumbnail} alt={product.name} className="w-40 h-40 object-contain rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <span className="text-[10px] font-bold text-teal-600 uppercase">{product.categoryName}</span>
                      <Link href={`/product/${product.slug}`}>
                        <h4 className="text-base font-bold text-slate-900 hover:text-primary">{product.name}</h4>
                      </Link>
                      <p className="text-xs text-gray-500 leading-relaxed">{product.teaserText}</p>
                      <div className="flex items-center gap-1 text-xs text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="font-bold text-slate-700">{product.rating}</span>
                        <span className="text-gray-400">({product.numReviews} customer reviews)</span>
                      </div>
                    </div>

                    <div className="text-right sm:border-l sm:border-gray-100 sm:pl-6 space-y-3 min-w-[140px]">
                      <div>
                        <span className="text-xl font-black text-slate-900">${product.finalPrice}</span>
                        {product.originalPrice > product.finalPrice && (
                          <span className="block text-xs text-gray-400 line-through">${product.originalPrice}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="w-full py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add To Cart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination (Page 11) */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center justify-center gap-2">
              <button className="w-9 h-9 rounded-xl bg-primary text-white font-bold text-xs">1</button>
              <button className="w-9 h-9 rounded-xl bg-slate-50 text-slate-700 font-bold text-xs hover:bg-slate-100">2</button>
              <button className="w-9 h-9 rounded-xl bg-slate-50 text-slate-700 font-bold text-xs hover:bg-slate-100">3</button>
              <button className="px-3 h-9 rounded-xl bg-slate-50 text-slate-700 font-bold text-xs hover:bg-slate-100">Next →</button>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
