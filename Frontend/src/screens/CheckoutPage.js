import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const CheckoutPage = () => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    address: '',
    phone: '',
  });
  const [cartItems, setCartItems] = useState([]);
  const history = useHistory();

  // Get cart data from localStorage
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);
  }, []);

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.Cost.price * item.quantity, 0);
  };

  // Handle Razorpay payment
  const handlePayment = () => {
    const options = {
      key: 'rzp_test_GsFjYWWvmnMoBy', // Replace with your Razorpay key
      amount: calculateTotal() * 100, // Convert to paise
      currency: 'INR',
      name: 'SecondHandSeller',
      description: 'Product Purchase',
      image: 'https://example.com/logo.png', // Optional logo
      handler: function (response) {
        console.log('Razorpay Response:', response); // Log the entire response to check data
        alert('Payment Successful!');
        // Send payment response to the invoice page
        history.push({
          pathname: '/invoice',
          state: { paymentResponse: response }, // Pass Razorpay response
        });
      },
      prefill: {
        name: userDetails.name,
        email: '', // Optional: Add email if required
        contact: userDetails.phone,
      },
      notes: {
        address: userDetails.address,
      },
      theme: {
        color: '#3399cc',
      },
    };

    if (window.Razorpay) {
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } else {
      alert('Razorpay script failed to load.');
    }
  };

  return (
    <div>
      <h1>Checkout</h1>

      <Form>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            value={userDetails.name}
            onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your address"
            value={userDetails.address}
            onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="phone">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your phone number"
            value={userDetails.phone}
            onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
          />
        </Form.Group>

        <Row className="my-3">
          <Col md={8}>
            <Button variant="light" onClick={() => history.push('/cart')}>
              Back to Cart
            </Button>
          </Col>
          <Col md={4}>
            <h3>Total: Rs {calculateTotal()}</h3>
            <Button variant="primary" block onClick={handlePayment}>
              Pay Now
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CheckoutPage;
