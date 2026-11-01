const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductBySlugOrId,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProducts)
  .post(createProduct);

router.post('/create', createProduct);

router.route('/:slugOrId')
  .get(getProductBySlugOrId)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
