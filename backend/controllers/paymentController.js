import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();  // Load environment variables

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,     // Use env variables
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

 const createOrder = async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;
    const validReceipt = receipt.slice(0, 40);
    const options = {
      amount: amount * 100,    // Convert to paisa
      currency,
      receipt:validReceipt,
    };

    const order = await razorpay.orders.create(options);
    res.status(201).json({ orderId: order.id });
  } catch (error) {
    console.error("Error creating order:", error);   // Detailed error logging
    res.status(500).json({
      message: "Failed to create order",
      error: error.message
    });
  }
};

export {createOrder};