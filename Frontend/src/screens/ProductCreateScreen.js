import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { createProduct } from "../actions/productActions";
import FormContainer from "../components/FormContainer";

const ProductCreateScreen = ({ history }) => {
  const [name, setName] = useState("");
  const [images, setImages] = useState([]); // Store multiple images
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [expiresOn, setExpiresOn] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCharge, setShippingCharge] = useState("");
  const [price, setPrice] = useState(0);
  const [negotiable, setNegotiable] = useState(false);

  const dispatch = useDispatch();
  const productCreate = useSelector((state) => state.productCreate);
  const { loading, error, success } = productCreate;
  const userLogin = useSelector((state) => state.userLogin);
  const { userData } = userLogin;

  useEffect(() => {
    if (success || !userData) {
      history.push("/");
    }
  }, [history, success, userData]);

  const uploadFileHandler = async (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    const imageUrls = [];

    setUploading(true);

    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "qwdzopo4"); // Cloudinary preset

      try {
        const { data } = await axios.post(
          "https://api.cloudinary.com/v1_1/dh3bp7vbd/upload",
          formData
        );
        imageUrls.push(data.url);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    setImages([...images, ...imageUrls]); // Append new images
    setUploading(false);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProduct(
        name,
        images, // Send multiple images
        description,
        category,
        expiresOn,
        shippingAddress,
        shippingCharge,
        price,
        negotiable
      )
    );
  };

  return (
    <FormContainer>
      <h1>Upload Your Product</h1>
      {loading ? (
        <Loader />
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="images">
            <Form.Label>Images</Form.Label>
            <Form.File
              multiple // Allow multiple file selection
              onChange={uploadFileHandler}
              id="image-file"
              label="Choose Files"
              custom
            />
            {uploading && <Loader />}
            {images.length > 0 && (
              <div className="image-preview-container">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`preview-${index}`}
                    className="preview-image"
                  />
                ))}
              </div>
            )}
          </Form.Group>

          <Form.Group controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. Electronics, Books, Furniture"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter product description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="expiresOn">
            <Form.Label>Listing Expiry Date</Form.Label>
            <Form.Control
              type="date"
              value={expiresOn}
              onChange={(e) => setExpiresOn(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="price">
            <Form.Label>Price (₹)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="negotiable">
            <Form.Check
              type="checkbox"
              label="Price Negotiable?"
              checked={negotiable}
              onChange={(e) => setNegotiable(e.target.checked)}
            />
          </Form.Group>

          <Form.Group controlId="shippingAddress">
            <Form.Label>Shipping Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter shipping location"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="shippingCharge">
            <Form.Label>Shipping Charge (₹)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter shipping charge"
              value={shippingCharge}
              onChange={(e) => setShippingCharge(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary">
            Upload Product
          </Button>
          {error && <Message variant="danger">{error}</Message>}
        </Form>
      )}
    </FormContainer>
  );
};

export default ProductCreateScreen;
