import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Product.css"; // Import custom styles

const Product = ({ product }) => {
  const [currentImage, setCurrentImage] = useState(
    product.images.length > 0 ? product.images[0] : "default-image.jpg"
  );
  const [quantity, setQuantity] = useState(1); // Track the quantity of the product

  // Function to handle adding the product to the cart
  const handleAddToCart = () => {
    const cartItem = { ...product, quantity };
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    // Check if the product already exists in the cart
    const existingProductIndex = cart.findIndex((item) => item._id === product._id);
    if (existingProductIndex > -1) {
      // If product already in cart, update the quantity
      cart[existingProductIndex].quantity += quantity;
    } else {
      // If product is not in the cart, add it with the selected quantity
      cart.push(cartItem);
    }
    localStorage.setItem("cart", JSON.stringify(cart)); // Save the updated cart to localStorage
    alert(`${product.name} has been added to your cart!`);
  };

  return (
    <Card className="product-card my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        <div className="image-container">
          <Card.Img
            className="product-image"
            src={currentImage}
            alt={product.name}
          />
        </div>
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="p" className="name-label">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="h3">Rs {product.Cost.price}</Card.Text>

        {/* Quantity Selector */}
        <Form.Group controlId="quantity">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            as="select"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          >
            {[...Array(10).keys()].map((x) => (
              <option key={x + 1} value={x + 1}>
                {x + 1}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {/* Add to Cart Button */}
        <Button
          variant="primary"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Product;
