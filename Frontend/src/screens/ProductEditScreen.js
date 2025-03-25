import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listProductDetails, updateProduct } from "../actions/productActions";
import FormContainer from "../components/FormContainer";
import { PRODUCT_UPDATE_RESET } from "../types/productConstants";

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id;
  const [name, setName] = useState("");
  const [images, setImages] = useState([]); // Store images as an array
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [expiresOn, setExpiresOn] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCharge, setShippingCharge] = useState("0");
  const [price, setPrice] = useState(0);
  const [negotiable, setNegotiable] = useState(false);
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const userLogin = useSelector((state) => state.userLogin);
  const { userData } = userLogin;

  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  useEffect(() => {
    dispatch({ type: PRODUCT_UPDATE_RESET });

    if (!userData || successUpdate) {
      history.push("/");
    }

    if (successUpdate && userData.isAdmin) {
      history.push("/admin/productlist");
    }

    if (!product.name || product._id !== productId) {
      dispatch(listProductDetails(productId));
    } else {
      setName(product.name);
      setImages(product.images || []); // Store images properly
      setDescription(product.description);
      setCategory(product.category);
      setExpiresOn(product.expiresOn.substring(0, 10));
      setShippingAddress(product?.shippingAddress?.address);
      setShippingCharge(product?.shippingAddress?.shippingCharge);
      setPrice(product?.Cost?.price);
      setNegotiable(product?.Cost?.negotiable);
    }
  }, [history, dispatch, productId, product, successUpdate, userData]);

  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dh3bp7vbd/upload";
  const CLOUDINARY_UPLOAD_PRESET = "qwdzopo4";

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    setUploading(true);

    try {
      const { data } = await axios.post(CLOUDINARY_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Append the new image URL to the existing images array
      setImages((prevImages) => [...prevImages, data.url]);
    } catch (error) {
      console.error(error);
    }

    setUploading(false);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct(
        productId,
        name,
        images, // Ensure images are sent as an array
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
    <>
      <FormContainer>
        <h1>Edit Product</h1>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="name">
                  <Form.Label>Name of the product</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="category">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter category (electronics, books, furniture...)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="description">
              <Form.Label>Describe your product</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group controlId="expiresOn">
                  <Form.Label>How long is your product for sale?</Form.Label>
                  <Form.Control
                    type="date"
                    value={expiresOn}
                    onChange={(e) => setExpiresOn(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="price">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="shippingAddress">
                  <Form.Label>Shipping Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter delivery location"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="shippingCharge">
                  <Form.Label>Shipping Charge</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter shipping charge"
                    value={shippingCharge}
                    onChange={(e) => setShippingCharge(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="negotiable" className="mb-5 mt-5">
              <Form.Check
                type="checkbox"
                label="Is the price negotiable?"
                checked={negotiable}
                onChange={(e) => setNegotiable(e.target.checked)}
              />
            </Form.Group>

            <Form.Group controlId="images">
              <Form.Label>
                Image <small>* Upload Images</small>
              </Form.Label>
              <Form.File
                id="image-file"
                label="Choose File"
                custom
                onChange={uploadFileHandler}
              />
              {images.length > 0 &&
                images.map((img, index) => (
                  <img
                    key={index}
                    className="mt-2"
                    src={img}
                    style={{ height: "100px", marginRight: "10px" }}
                    alt={`image-${index}`}
                  />
                ))}
              {uploading && <Loader />}
            </Form.Group>

            <Button className="mb-2" type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>

      {loadingUpdate && <Loader />}
      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
    </>
  );
};

export default ProductEditScreen;
