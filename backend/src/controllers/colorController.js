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

const mongoose = require('mongoose');

const createColor = async (req, res) => {
  try {
    const { name, slug, hexColor, hex } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Color name is required' });
    }
    const safeSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const safeHex = hexColor || hex || '#1f2937';

    if (getDbStatus()) {
      const color = await Color.create({ name, slug: safeSlug, hexColor: safeHex, isActive: true });
      store.colors.push(color);
      return res.status(201).json({ success: true, color });
    } else {
      const newColor = {
        _id: 'col_' + Date.now(),
        name,
        slug: safeSlug,
        hexColor: safeHex,
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
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { $or: [{ slug: id }, { name: new RegExp(`^${id}$`, 'i') }] };

    const updatePayload = { ...req.body };
    if (updatePayload.hex && !updatePayload.hexColor) {
      updatePayload.hexColor = updatePayload.hex;
    }

    // Update in store cache
    const idx = store.colors.findIndex(c => c._id === id || c.slug === id || (c.name && c.name.toLowerCase() === id.toLowerCase()));
    if (idx !== -1) {
      store.colors[idx] = { ...store.colors[idx], ...updatePayload };
    }

    if (getDbStatus()) {
      let color = await Color.findOneAndUpdate(query, updatePayload, { new: true });
      if (!color && !isObjectId) {
        color = await Color.create({
          name: updatePayload.name || id,
          slug: updatePayload.slug || id,
          hexColor: updatePayload.hexColor || '#000000',
          isActive: updatePayload.isActive !== false,
        });
      }
      if (color) {
        return res.json({ success: true, color });
      }
      return res.status(404).json({ success: false, message: 'Color not found' });
    } else {
      if (idx !== -1) {
        return res.json({ success: true, color: store.colors[idx] });
      }
      const newColor = { _id: 'col_' + Date.now(), ...updatePayload };
      store.colors.push(newColor);
      return res.json({ success: true, color: newColor });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteColor = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { $or: [{ slug: id }, { name: new RegExp(`^${id}$`, 'i') }] };

    const idx = store.colors.findIndex(c => c._id === id || c.slug === id);
    if (idx !== -1) {
      store.colors.splice(idx, 1);
    }

    if (getDbStatus()) {
      await Color.findOneAndDelete(query);
      return res.json({ success: true, message: 'Color deleted' });
    } else {
      return res.json({ success: true, message: 'Color deleted' });
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
