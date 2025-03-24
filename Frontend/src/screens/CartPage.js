import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, ListGroup, Row, Col } from 'react-bootstrap';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  // Get cart data from localStorage
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);
  }, []);

  // Remove item from cart
  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item._id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.Cost.price * item.quantity, 0);
  };

  return (
    <div>
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. <Link to='/'>Go shopping</Link></p>
      ) : (
        <>
          <ListGroup>
            {cartItems.map(item => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <img src={item.images[0]} alt={item.name} width="100%" />
                  </Col>
                  <Col md={6}>
                    <h5>{item.name}</h5>
                    <p>Price: Rs {item.Cost.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </Col>
                  <Col md={2}>
                    <h5>Total: Rs {item.Cost.price * item.quantity}</h5>
                  </Col>
                  <Col md={2}>
                    <Button variant='danger' onClick={() => removeFromCart(item._id)}>
                      Remove
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Row className='my-3'>
            <Col md={8}>
              <Link to='/'>
                <Button variant='light'>Continue Shopping</Button>
              </Link>
            </Col>
            <Col md={4}>
              <h3>Total: Rs {calculateTotal()}</h3>
              <Link to='/checkout'>
                <Button variant='primary' block>Proceed to Checkout</Button>
              </Link>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default CartPage;
