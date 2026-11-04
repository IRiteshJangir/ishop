const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(createOrder)
  .get(protect, admin, getAllOrders);

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id')
  .get(getOrderById)
  .delete(protect, admin, deleteOrder);

router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

module.exports = router;
