const Category = require('../models/Category');
const { getDbStatus } = require('../config/db');
const store = require('../config/store');

const getCategories = async (req, res) => {
  try {
    if (getDbStatus()) {
      const categories = await Category.find({}).sort({ createdAt: -1 });
      return res.json({ success: true, count: categories.length, categories });
    } else {
      return res.json({ success: true, count: store.categories.length, categories: store.categories });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, slug, image } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }
    const safeSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (getDbStatus()) {
      const category = await Category.create({ name, slug: safeSlug, image: image || '' });
      store.categories.push(category.toObject ? category.toObject() : category);
      return res.status(201).json({ success: true, category });
    } else {
      const newCat = {
        _id: 'cat_' + Date.now(),
        name,
        slug: safeSlug,
        image: image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80',
        isActive: true,
      };
      store.categories.push(newCat);
      return res.status(201).json({ success: true, category: newCat });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const mongoose = require('mongoose');

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { $or: [{ slug: id }, { name: new RegExp(`^${id}$`, 'i') }] };

    // Update in store cache
    const idx = store.categories.findIndex(c => c._id === id || c.slug === id || (c.name && c.name.toLowerCase() === id.toLowerCase()));
    if (idx !== -1) {
      store.categories[idx] = { ...store.categories[idx], ...req.body };
    }

    if (getDbStatus()) {
      let cat = await Category.findOneAndUpdate(query, req.body, { new: true });
      if (!cat && !isObjectId) {
        cat = await Category.create({
          name: req.body.name || id,
          slug: req.body.slug || id,
          image: req.body.image || '',
          isActive: req.body.isActive !== false,
        });
      }
      if (cat) {
        return res.json({ success: true, category: cat });
      }
      return res.status(404).json({ success: false, message: 'Category not found' });
    } else {
      if (idx !== -1) {
        return res.json({ success: true, category: store.categories[idx] });
      }
      const newCat = { _id: 'cat_' + Date.now(), ...req.body };
      store.categories.push(newCat);
      return res.json({ success: true, category: newCat });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { $or: [{ slug: id }, { name: new RegExp(`^${id}$`, 'i') }] };

    const idx = store.categories.findIndex(c => c._id === id || c.slug === id);
    if (idx !== -1) {
      store.categories.splice(idx, 1);
    }

    if (getDbStatus()) {
      await Category.findOneAndDelete(query);
      return res.json({ success: true, message: 'Category deleted' });
    } else {
      return res.json({ success: true, message: 'Category deleted' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
