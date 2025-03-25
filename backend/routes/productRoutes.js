import express from 'express'
const router = express.Router()
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  reviewProduct,
  deleteProductReview
} from '../controllers/productController.js'
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(getProducts).post(protect, createProduct)
router.route('/:id/reviews').post(protect, reviewProduct)

router
  .route('/:id')
  .get(getProductById)
  .delete(protect, deleteProduct)
  .put(protect, updateProduct)
  router.delete('/:id/reviews/:reviewId', protect, deleteProductReview);


export default router
