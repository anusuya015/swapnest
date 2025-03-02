import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Product.css"; // Import custom styles

const Product = ({ product }) => {
  const [currentImage, setCurrentImage] = useState(
    product.images.length > 0 ? product.images[0] : "default-image.jpg"
  );

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
        <Card.Text as="h3">Rs {product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
