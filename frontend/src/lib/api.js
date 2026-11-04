import { initialProducts, initialCategories, initialBrands, initialColors } from './mockData';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  if (url.startsWith('/uploads/')) {
    // Both Next.js rewrite (/uploads/...) and direct backend url work
    return `${BASE_URL}${url}`;
  }
  return url;
};

export const uploadImage = async (file) => {
  if (!file) return '';

  try {
    const formData = new FormData();
    formData.append('image', file);

    const token = typeof window !== 'undefined' ? localStorage.getItem('ishop_token') : null;
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.url) {
        return data.url;
      }
    }
  } catch (err) {
    console.warn('[Upload Notice] Backend upload failed, using Data URL fallback:', err.message);
  }

  // Fallback to Data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

export const apiFetch = async (endpoint, options = {}) => {
  const isGet = !options.method || options.method.toUpperCase() === 'GET';
  const token = typeof window !== 'undefined' ? localStorage.getItem('ishop_token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (error) {
    console.warn(`[API Notice] Request for ${endpoint}:`, error.message);

    // Only fallback to mock evaluation for GET requests
    if (!isGet) {
      throw error;
    }

    if (endpoint.startsWith('/api/products')) {
      const url = new URL(`http://dummy${endpoint}`);
      const category = url.searchParams.get('category');
      const keyword = url.searchParams.get('keyword');
      const brand = url.searchParams.get('brand');
      const minPrice = url.searchParams.get('minPrice');
      const maxPrice = url.searchParams.get('maxPrice');

      let filtered = [...initialProducts];
      if (category) filtered = filtered.filter(p => p.categoryName?.toLowerCase() === category.toLowerCase());
      if (brand) filtered = filtered.filter(p => p.brandName?.toLowerCase().includes(brand.toLowerCase()));
      if (keyword) filtered = filtered.filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()));
      if (minPrice) filtered = filtered.filter(p => p.finalPrice >= Number(minPrice));
      if (maxPrice) filtered = filtered.filter(p => p.finalPrice <= Number(maxPrice));

      return { success: true, count: filtered.length, total: filtered.length, products: filtered };
    }

    if (endpoint === '/api/categories') {
      return { success: true, count: initialCategories.length, categories: initialCategories };
    }

    if (endpoint === '/api/brands') {
      return { success: true, count: initialBrands.length, brands: initialBrands };
    }

    if (endpoint === '/api/colors') {
      return { success: true, count: initialColors.length, colors: initialColors };
    }

    if (endpoint.startsWith('/api/orders/')) {
      const orderId = endpoint.split('/api/orders/')[1]?.split('?')[0];
      return {
        success: true,
        order: {
          _id: orderId || 'ord_1001',
          createdAt: new Date().toISOString(),
          totalPrice: 1746.50,
          status: 'Processing',
          paymentMethod: 'Direct Bank Transfer',
          shippingAddress: {
            firstName: 'Mark',
            lastName: 'Cole',
            street: '742 Evergreen Terrace',
            apartment: 'Apt 2B',
            city: 'Seattle',
            state: 'Washington',
            zipCode: '98101',
            country: 'United States (US)',
          },
          orderItems: [
            {
              name: 'Pinneaple Macbook Pro 2022 M1/512GB',
              price: 1746.50,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
            }
          ]
        }
      };
    }

    throw error;
  }
};
