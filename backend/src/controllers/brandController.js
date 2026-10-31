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

const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    if (getDbStatus()) {
      const brand = await Brand.findByIdAndUpdate(id, req.body, { new: true });
      return res.json({ success: true, brand });
    } else {
      const idx = store.brands.findIndex(b => b._id === id || b.slug === id);
      if (idx !== -1) {
        store.brands[idx] = { ...store.brands[idx], ...req.body };
        return res.json({ success: true, brand: store.brands[idx] });
      }
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    if (getDbStatus()) {
      await Brand.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Brand deleted' });
    } else {
      const idx = store.brands.findIndex(b => b._id === id || b.slug === id);
      if (idx !== -1) {
        store.brands.splice(idx, 1);
        return res.json({ success: true, message: 'Brand deleted' });
      }
      return res.status(404).json({ success: false, message: 'Brand not found' });
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
