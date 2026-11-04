const Order = require('../models/Order');
const { getDbStatus } = require('../config/db');
const store = require('../config/store');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public / Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      orderNotes,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    const userId = req.user ? req.user._id : null;

    if (getDbStatus()) {
      const order = new Order({
        orderItems,
        user: userId,
        shippingAddress,
        paymentMethod: paymentMethod || 'Direct Bank Transfer',
        itemsPrice,
        shippingPrice: shippingPrice || 0,
        taxPrice: taxPrice || 0,
        totalPrice,
        orderNotes: orderNotes || '',
        status: 'Pending',
        isPaid: paymentMethod === 'PayPal' ? true : false,
        paidAt: paymentMethod === 'PayPal' ? new Date() : null,
      });

      const createdOrder = await order.save();
      store.orders.unshift(createdOrder);
      return res.status(201).json({ success: true, order: createdOrder });
    } else {
      const newOrder = {
        _id: 'ord_' + Date.now(),
        user: userId,
        orderItems,
        shippingAddress,
        paymentMethod: paymentMethod || 'Direct Bank Transfer',
        itemsPrice,
        shippingPrice: shippingPrice || 0,
        taxPrice: taxPrice || 0,
        totalPrice,
        orderNotes: orderNotes || '',
        status: 'Pending',
        isPaid: paymentMethod === 'PayPal' ? true : false,
        paidAt: paymentMethod === 'PayPal' ? new Date() : null,
        createdAt: new Date(),
      };

      store.orders.unshift(newOrder);
      return res.status(201).json({ success: true, order: newOrder });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public / Private
const getOrderById = async (req, res) => {
  try {
    const rawId = req.params.id;
    const id = rawId.replace('#', '').trim();
    const mongoose = require('mongoose');

    const storeOrder = store.orders.find(o => o._id === id || o._id === rawId);

    if (getDbStatus()) {
      const isObjectId = mongoose.Types.ObjectId.isValid(id);
      let order = isObjectId ? await Order.findById(id).populate('user', 'name email') : null;
      if (!order && storeOrder) {
        order = storeOrder;
      }
      if (order) {
        return res.json({ success: true, order });
      }
      return res.status(404).json({ success: false, message: `Order #${rawId} not found` });
    } else {
      if (storeOrder) {
        return res.json({ success: true, order: storeOrder });
      }
      return res.status(404).json({ success: false, message: `Order #${rawId} not found` });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    if (getDbStatus()) {
      const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, orders });
    } else {
      const orders = store.orders.filter(o => o.user === userId || (req.user.email && o.shippingAddress && o.shippingAddress.email === req.user.email));
      return res.json({ success: true, count: orders.length, orders });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    if (getDbStatus()) {
      const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, orders });
    } else {
      return res.json({ success: true, count: store.orders.length, orders: store.orders });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const rawId = req.params.id;
    const id = rawId.replace('#', '').trim();
    const { status, isPaid, isDelivered } = req.body;
    const mongoose = require('mongoose');

    // Update in memory store
    const idx = store.orders.findIndex(o => o._id === id || o._id === rawId);
    if (idx !== -1) {
      if (status) store.orders[idx].status = status;
      if (isPaid !== undefined) {
        store.orders[idx].isPaid = isPaid;
        if (isPaid) store.orders[idx].paidAt = new Date();
      }
      if (isDelivered !== undefined) {
        store.orders[idx].isDelivered = isDelivered;
        if (isDelivered) store.orders[idx].deliveredAt = new Date();
      }
    }

    if (getDbStatus()) {
      const isObjectId = mongoose.Types.ObjectId.isValid(id);
      let order = isObjectId ? await Order.findById(id) : null;
      if (order) {
        if (status) order.status = status;
        if (isPaid !== undefined) {
          order.isPaid = isPaid;
          if (isPaid) order.paidAt = new Date();
        }
        if (isDelivered !== undefined) {
          order.isDelivered = isDelivered;
          if (isDelivered) order.deliveredAt = new Date();
        }
        const updated = await order.save();
        return res.json({ success: true, order: updated });
      } else if (idx !== -1) {
        return res.json({ success: true, order: store.orders[idx] });
      }
      return res.status(404).json({ success: false, message: 'Order not found' });
    } else {
      if (idx !== -1) {
        return res.json({ success: true, order: store.orders[idx] });
      }
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const rawId = req.params.id;
    const id = rawId.replace('#', '').trim();
    const mongoose = require('mongoose');

    const idx = store.orders.findIndex(o => o._id === id || o._id === rawId);
    if (idx !== -1) {
      store.orders.splice(idx, 1);
    }

    if (getDbStatus()) {
      const isObjectId = mongoose.Types.ObjectId.isValid(id);
      if (isObjectId) {
        await Order.findByIdAndDelete(id);
      } else {
        await Order.findOneAndDelete({ _id: id });
      }
      return res.json({ success: true, message: 'Order deleted successfully' });
    } else {
      return res.json({ success: true, message: 'Order deleted successfully' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};
