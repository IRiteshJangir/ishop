const Brand = require('../models/Brand');
const { getDbStatus } = require('../config/db');
const store = require('../config/store');

const getBrands = async (req, res) => {
  try {
    if (getDbStatus()) {
      const brands = await Brand.find({}).sort({ createdAt: -1 });
      return res.json({ success: true, count: brands.length, brands });
    } else {
      return res.json({ success: true, count: store.brands.length, brands: store.brands });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createBrand = async (req, res) => {
  try {
    const { name, slug, image } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Brand name is required' });
    }
    const safeSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (getDbStatus()) {
      const brand = await Brand.create({ name, slug: safeSlug, image: image || '' });
      store.brands.push(brand.toObject ? brand.toObject() : brand);
      return res.status(201).json({ success: true, brand });
    } else {
      const newBrand = {
        _id: 'brd_' + Date.now(),
        name,
        slug: safeSlug,
        image: image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80',
        isActive: true,
      };
      store.brands.push(newBrand);
      return res.status(201).json({ success: true, brand: newBrand });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const mongoose = require('mongoose');

const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { $or: [{ slug: id }, { name: new RegExp(`^${id}$`, 'i') }] };

    // Update in store cache
    const idx = store.brands.findIndex(b => b._id === id || b.slug === id || (b.name && b.name.toLowerCase() === id.toLowerCase()));
    if (idx !== -1) {
      store.brands[idx] = { ...store.brands[idx], ...req.body };
    }

    if (getDbStatus()) {
      let brand = await Brand.findOneAndUpdate(query, req.body, { new: true });
      if (!brand && !isObjectId) {
        brand = await Brand.create({
          name: req.body.name || id,
          slug: req.body.slug || id,
          image: req.body.image || '',
          isActive: req.body.isActive !== false,
        });
      }
      if (brand) {
        return res.json({ success: true, brand });
      }
      return res.status(404).json({ success: false, message: 'Brand not found' });
    } else {
      if (idx !== -1) {
        return res.json({ success: true, brand: store.brands[idx] });
      }
      const newBrand = { _id: 'brd_' + Date.now(), ...req.body };
      store.brands.push(newBrand);
      return res.json({ success: true, brand: newBrand });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { $or: [{ slug: id }, { name: new RegExp(`^${id}$`, 'i') }] };

    const idx = store.brands.findIndex(b => b._id === id || b.slug === id);
    if (idx !== -1) {
      store.brands.splice(idx, 1);
    }

    if (getDbStatus()) {
      await Brand.findOneAndDelete(query);
      return res.json({ success: true, message: 'Brand deleted' });
    } else {
      return res.json({ success: true, message: 'Brand deleted' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
};
