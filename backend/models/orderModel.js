import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
      },
    ],
    totalPrice: { type: Number, required: true },  // Add this to store the total amount
    paymentStatus: { type: String, default: 'Pending' }, // Paid / Pending
    orderStatus: { type: String, default: 'Processing' }, // Processing / Shipped / Delivered
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
