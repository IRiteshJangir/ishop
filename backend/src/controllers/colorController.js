const Color = require('../models/Color');
const { getDbStatus } = require('../config/db');
const store = require('../config/store');

const getColors = async (req, res) => {
  try {
    if (getDbStatus()) {
      const colors = await Color.find({}).sort({ createdAt: -1 });
      return res.json({ success: true, count: colors.length, colors });
    } else {
      return res.json({ success: true, count: store.colors.length, colors: store.colors });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createColor = async (req, res) => {
  try {
    const { name, slug, hexColor } = req.body;
    if (!name || !hexColor) {
      return res.status(400).json({ success: false, message: 'Color name and hex code are required' });
    }
    const safeSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (getDbStatus()) {
      const color = await Color.create({ name, slug: safeSlug, hexColor });
      return res.status(201).json({ success: true, color });
    } else {
      const newColor = {
        _id: 'col_' + Date.now(),
        name,
        slug: safeSlug,
        hexColor,
        isActive: true,
      };
      store.colors.push(newColor);
      return res.status(201).json({ success: true, color: newColor });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateColor = async (req, res) => {
  try {
    const { id } = req.params;
    if (getDbStatus()) {
      const color = await Color.findByIdAndUpdate(id, req.body, { new: true });
      return res.json({ success: true, color });
    } else {
      const idx = store.colors.findIndex(c => c._id === id || c.slug === id);
      if (idx !== -1) {
        store.colors[idx] = { ...store.colors[idx], ...req.body };
        return res.json({ success: true, color: store.colors[idx] });
      }
      return res.status(404).json({ success: false, message: 'Color not found' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteColor = async (req, res) => {
  try {
    const { id } = req.params;
    if (getDbStatus()) {
      await Color.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Color deleted' });
    } else {
      const idx = store.colors.findIndex(c => c._id === id || c.slug === id);
      if (idx !== -1) {
        store.colors.splice(idx, 1);
        return res.json({ success: true, message: 'Color deleted' });
      }
      return res.status(404).json({ success: false, message: 'Color not found' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getColors,
  createColor,
  updateColor,
  deleteColor,
};
