const Product = require('../models/Product');
const { getDbStatus } = require('../config/db');
const store = require('../config/store');

// @desc    Get all products with search, filter, sort, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      color,
      memory,
      condition,
      sort,
      isTopSelling,
      page = 1,
      limit = 40,
    } = req.query;

    if (getDbStatus()) {
      let query = {};

      if (keyword) {
        query.name = { $regex: keyword, $options: 'i' };
      }
      if (category) {
        query.categoryName = { $regex: new RegExp(`^${category}$`, 'i') };
      }
      if (brand) {
        const brandsArr = Array.isArray(brand) ? brand : brand.split(',');
        query.brandName = { $in: brandsArr.map(b => new RegExp(`^${b.trim()}$`, 'i')) };
      }
      if (minPrice || maxPrice) {
        query.finalPrice = {};
        if (minPrice) query.finalPrice.$gte = Number(minPrice);
        if (maxPrice) query.finalPrice.$lte = Number(maxPrice);
      }
      if (rating) {
        query.rating = { $gte: Number(rating) };
      }
      if (color) {
        query.colorNames = { $in: [new RegExp(color, 'i')] };
      }
      if (memory) {
        query.memorySizes = { $in: [memory] };
      }
      if (condition) {
        query.condition = condition;
      }
      if (isTopSelling === 'true') {
        query.isTopSelling = true;
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'price_asc') sortOption = { finalPrice: 1 };
      else if (sort === 'price_desc') sortOption = { finalPrice: -1 };
      else if (sort === 'rating') sortOption = { rating: -1 };
      else if (sort === 'top_selling') sortOption = { isTopSelling: -1, createdAt: -1 };

      const total = await Product.countDocuments(query);
      const products = await Product.find(query)
        .sort(sortOption)
        .skip((page - 1) * Number(limit))
        .limit(Number(limit));

      return res.json({
        success: true,
        count: products.length,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        products,
      });
    } else {
      // In-memory fallback
      let filtered = [...store.products];

      if (keyword) {
        const k = keyword.toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(k) ||
          (p.teaserText && p.teaserText.toLowerCase().includes(k)) ||
          (p.brandName && p.brandName.toLowerCase().includes(k)) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(k))
        );
      }
      if (category) {
        filtered = filtered.filter(p =>
          p.categoryName && p.categoryName.toLowerCase() === category.toLowerCase()
        );
      }
      if (brand) {
        const brandsArr = (Array.isArray(brand) ? brand : brand.split(',')).map(b => b.trim().toLowerCase());
        filtered = filtered.filter(p =>
          p.brandName && brandsArr.includes(p.brandName.toLowerCase())
        );
      }
      if (minPrice) {
        filtered = filtered.filter(p => p.finalPrice >= Number(minPrice));
      }
      if (maxPrice) {
        filtered = filtered.filter(p => p.finalPrice <= Number(maxPrice));
      }
      if (rating) {
        filtered = filtered.filter(p => p.rating >= Number(rating));
      }
      if (color) {
        filtered = filtered.filter(p =>
          p.colorNames && p.colorNames.some(c => c.toLowerCase() === color.toLowerCase())
        );
      }
      if (memory) {
        filtered = filtered.filter(p =>
          p.memorySizes && p.memorySizes.includes(memory)
        );
      }
      if (condition) {
        filtered = filtered.filter(p => p.condition === condition);
      }
      if (isTopSelling === 'true') {
        filtered = filtered.filter(p => p.isTopSelling);
      }

      if (sort === 'price_asc') {
        filtered.sort((a, b) => a.finalPrice - b.finalPrice);
      } else if (sort === 'price_desc') {
        filtered.sort((a, b) => b.finalPrice - a.finalPrice);
      } else if (sort === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      } else {
        // default newest / top
        filtered.sort((a, b) => (b.isTopSelling ? 1 : 0) - (a.isTopSelling ? 1 : 0));
      }

      const total = filtered.length;
      const startIndex = (page - 1) * Number(limit);
      const paginated = filtered.slice(startIndex, startIndex + Number(limit));

      return res.json({
        success: true,
        count: paginated.length,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)) || 1,
        products: paginated,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by slug or id
// @route   GET /api/products/:slugOrId
// @access  Public
const getProductBySlugOrId = async (req, res) => {
  try {
    const { slugOrId } = req.params;

    if (getDbStatus()) {
      let product = await Product.findOne({ slug: slugOrId });
      if (!product && slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(slugOrId);
      }
      if (product) {
        return res.json({ success: true, product });
      }
      return res.status(404).json({ success: false, message: 'Product not found' });
    } else {
      const product = store.products.find(
        p => p.slug === slugOrId || p._id === slugOrId
      );
      if (product) {
        return res.json({ success: true, product });
      }
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      originalPrice,
      discount = 0,
      finalPrice,
      categoryName,
      brandName,
      colorNames,
      teaserText,
      description,
      thumbnail,
      images,
      memorySizes,
      condition,
    } = req.body;

    if (!name || !originalPrice) {
      return res.status(400).json({ success: false, message: 'Name and original price are required' });
    }

    const calculatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const calculatedFinalPrice = finalPrice !== undefined ? Number(finalPrice) : (Number(originalPrice) * (1 - (Number(discount) || 0) / 100));

    if (getDbStatus()) {
      const product = await Product.create({
        name,
        slug: calculatedSlug,
        originalPrice: Number(originalPrice),
        discount: Number(discount) || 0,
        finalPrice: calculatedFinalPrice,
        categoryName: categoryName || '',
        brandName: brandName || '',
        colorNames: Array.isArray(colorNames) ? colorNames : (colorNames ? [colorNames] : []),
        teaserText: teaserText || '',
        description: description || '',
        thumbnail: thumbnail || (images && images[0]) || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
        images: Array.isArray(images) && images.length ? images : [thumbnail],
        memorySizes: memorySizes || ['128GB', '256GB'],
        condition: condition || 'New',
        isActive: true,
        countInStock: 25,
      });

      return res.status(201).json({ success: true, product });
    } else {
      const newProduct = {
        _id: 'prod_' + Date.now(),
        name,
        slug: calculatedSlug,
        originalPrice: Number(originalPrice),
        discount: Number(discount) || 0,
        finalPrice: calculatedFinalPrice,
        categoryName: categoryName || '',
        brandName: brandName || '',
        colorNames: Array.isArray(colorNames) ? colorNames : (colorNames ? [colorNames] : []),
        colorHexes: ['#1f2937'],
        teaserText: teaserText || '',
        description: description || '',
        thumbnail: thumbnail || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
        images: Array.isArray(images) && images.length ? images : [thumbnail],
        rating: 5.0,
        numReviews: 1,
        countInStock: 25,
        isTopSelling: false,
        isActive: true,
        isNewProduct: true,
        memorySizes: memorySizes || ['128GB', '256GB'],
        screenSizes: ['6.1 inch'],
        condition: condition || 'New',
        createdAt: new Date(),
      };

      store.products.unshift(newProduct);
      return res.status(201).json({ success: true, product: newProduct });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id or /api/products/:slugOrId
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const id = req.params.slugOrId || req.params.id;
    const mongoose = require('mongoose');

    if (getDbStatus()) {
      const isObjectId = mongoose.Types.ObjectId.isValid(id);
      const product = isObjectId ? await Product.findById(id) : await Product.findOne({ slug: id });
      if (product) {
        Object.assign(product, req.body);
        if (req.body.originalPrice && req.body.discount !== undefined && !req.body.finalPrice) {
          product.finalPrice = Number(req.body.originalPrice) * (1 - Number(req.body.discount) / 100);
        }
        const updated = await product.save();
        return res.json({ success: true, product: updated });
      }
      return res.status(404).json({ success: false, message: 'Product not found' });
    } else {
      const index = store.products.findIndex(p => p._id === id || p.slug === id);
      if (index !== -1) {
        store.products[index] = { ...store.products[index], ...req.body };
        return res.json({ success: true, product: store.products[index] });
      }
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id or /api/products/:slugOrId
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const id = req.params.slugOrId || req.params.id;
    const mongoose = require('mongoose');

    if (getDbStatus()) {
      const isObjectId = mongoose.Types.ObjectId.isValid(id);
      const product = isObjectId ? await Product.findById(id) : await Product.findOne({ slug: id });
      if (product) {
        await product.deleteOne();
        return res.json({ success: true, message: 'Product removed' });
      }
      return res.status(404).json({ success: false, message: 'Product not found' });
    } else {
      const index = store.products.findIndex(p => p._id === id || p.slug === id);
      if (index !== -1) {
        store.products.splice(index, 1);
        return res.json({ success: true, message: 'Product removed' });
      }
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductBySlugOrId,
  createProduct,
  updateProduct,
  deleteProduct,
};
