import express from 'express';
import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new order (POST /api/orders)
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { orderItems, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items found');
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  })
);

//  Get all orders of the logged-in user (GET /api/orders/myorders)
router.get(
    '/myorders',
    protect, // Ensure user is logged in
    asyncHandler(async (req, res) => {
      console.log("Fetching orders for user:", req.user._id); // Debugging log
      const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  
      if (orders.length === 0) {
        res.status(404);
        throw new Error("No orders found");
      }
  
      res.json(orders);
    })
  );
  

export default router;
