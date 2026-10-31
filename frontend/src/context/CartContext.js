'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ishop_cart');
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {
        setCartItems([]);
      }
    } else {
      // Default items matching cart.jpg
      const initialCart = [
        {
          _id: 'prod_7',
          name: 'SROK Smart Phone 128GB, Oled Retina',
          slug: 'srok-smart-phone-128gb-oled-retina',
          price: 579.0,
          originalPrice: 739.0,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=300&auto=format&fit=crop&q=80',
          badge: 'SAVE $160.00',
          rating: 5.0,
          reviewsCount: 152,
          shippingText: 'FREE SHIPPING',
          inStock: true,
        },
        {
          _id: 'prod_8',
          name: 'aPod Pro Tablet 2023 LTE + Wifi, GPS Cellular 12.9 Inch, 512GB',
          slug: 'apod-pro-tablet-2023-lte-wifi-gps-cellular-12-9-inch-512gb',
          price: 979.0,
          originalPrice: 1199.0,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&auto=format&fit=crop&q=80',
          badge: 'NEW',
          rating: 5.0,
          reviewsCount: 88,
          shippingText: '$2.00 SHIPPING',
          inStock: true,
        },
        {
          _id: 'prod_9',
          name: 'Samsung Galaxy X6 Ultra LTE 4G/128 Gb, Black Smartphone',
          slug: 'samsung-galaxy-x6-ultra-lte-4g-128-gb-black-smartphone',
          price: 659.0,
          originalPrice: 799.0,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=300&auto=format&fit=crop&q=80',
          badge: 'NEW',
          rating: 4.8,
          reviewsCount: 5,
          shippingText: 'FREE SHIPPING',
          freeGift: true,
          inStock: true,
        },
      ];
      setCartItems(initialCart);
      localStorage.setItem('ishop_cart', JSON.stringify(initialCart));
    }
    setMounted(true);
  }, []);

  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('ishop_cart', JSON.stringify(items));
  };

  const addToCart = (product, quantity = 1, selectedColor = '', selectedMemory = '') => {
    const existingIndex = cartItems.findIndex(
      item => item._id === product._id && item.color === selectedColor && item.memory === selectedMemory
    );

    let updated;
    if (existingIndex > -1) {
      updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
    } else {
      updated = [
        ...cartItems,
        {
          _id: product._id,
          name: product.name,
          slug: product.slug,
          price: product.finalPrice || product.price,
          originalPrice: product.originalPrice || product.price,
          quantity,
          image: product.thumbnail || product.image || (product.images && product.images[0]),
          color: selectedColor,
          memory: selectedMemory,
          badge: product.discount ? `SAVE $${Math.round(product.originalPrice - product.finalPrice)}` : 'NEW',
          rating: product.rating || 5.0,
          shippingText: 'FREE SHIPPING',
          inStock: true,
        },
      ];
    }
    saveCart(updated);
  };

  const removeFromCart = (index) => {
    const updated = cartItems.filter((_, idx) => idx !== index);
    saveCart(updated);
  };

  const updateQuantity = (index, delta) => {
    const updated = [...cartItems];
    const newQty = updated[index].quantity + delta;
    if (newQty > 0) {
      updated[index].quantity = newQty;
      saveCart(updated);
    } else {
      removeFromCart(index);
    }
  };

  const clearCart = () => {
    saveCart([]);
  };

  const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingTotal = subTotal > 500 ? 0 : 25;
  const taxTotal = Math.round(subTotal * 0.08 * 100) / 100;
  const orderTotal = subTotal + shippingTotal + taxTotal;
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subTotal,
        shippingTotal,
        taxTotal,
        orderTotal,
        totalItemsCount,
        mounted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
