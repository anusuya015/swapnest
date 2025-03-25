import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: "YOUR_RAZORPAY_KEY_ID",
    key_secret: "YOUR_RAZORPAY_KEY_SECRET",
  });

  async function payment  (req, res)  {
    const { amount, currency, receipt } = req.body;
  
    const options = {
      amount: amount * 100, // Convert amount to paisa
      currency,
      receipt,
    };
  
    try {
      const order = await razorpay.orders.create(options);
      res.json({ orderId: order.id });
    } catch (error) {
      res.status(500).send("Error creating order");
    }
}

export default payment;