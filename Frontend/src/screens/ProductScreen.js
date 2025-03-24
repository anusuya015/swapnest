import axios from 'axios'; 
import React, { useState, useEffect } from "react";
import Meta from "../components/Meta";

import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Carousel from "react-bootstrap/Carousel";
import {
  listProductDetails,
  createProductReview,
} from "../actions/productActions";
import { sendEmail } from "../actions/userActions";
import { PRODUCT_REVIEW_RESET } from "../types/productConstants";
import { deleteProductReview } from '../actions/productActions';

const ProductScreen = ({ match, history }) => {
  const [text, setText] = useState("");
  const [comment, setComment] = useState("");
  const [sendMail, setSendMail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const dispatch = useDispatch();
  const emailReducer = useSelector((state) => state.emailReducer);
  const { loading: loadingEmail, error: errorEmail, data: dataEmail } = emailReducer;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const { loading: loadingReview, error: errorReview, success: successReview } = productReviewCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userData } = userLogin;
  useEffect(() => {
    if (successReview) {
      setComment('')
      dispatch({
        type: PRODUCT_REVIEW_RESET,
      })
    }
    dispatch(listProductDetails(match.params.id))
  }, [match.params.id, dispatch, successReview])

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails
  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createProductReview(match.params.id, comment))
  }

  useEffect(() => {
    if (successReview) {
      setComment("");
      dispatch({ type: PRODUCT_REVIEW_RESET });
    }
    dispatch(listProductDetails(match.params.id));
  }, [match.params.id, dispatch, successReview]);

  const emailSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setEmailSent(true);

    dispatch(
      sendEmail(
        product?.seller?.selleremail,
        text,
        userData?.name,
        userData?.address,
        product?.name,
        userData?.email,
        userData?.contact?.phone_no
      )
    );

    setText("");
    setSendMail(false);
    setTimeout(() => setEmailSent(false), 10000);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };
  const deleteReviewHandler = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete your review?')) {
      try {
        const { data } = await axios.delete(
          `/api/products/${product._id}/reviews/${reviewId}`,
          {
            headers: { Authorization: `Bearer ${userData.token}` },
          }
        );
  
        alert(data.message); // Show success message
        window.location.reload(); // Refresh to update reviews
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting review');
      }
    }
  };
  
  
  return (
    <>
      <Link to="/" className="btn btn-success my-3">
        Go Back
      </Link>
      {userData && userData._id === product.user && (
        <Link to={`/admin/product/${match.params.id}/edit`} className="btn btn-primary my-3">
          Edit Product
        </Link>
      )}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row className="mb-2">
            <Col md={6} className="image-area">
              {product.images && product.images.length > 0 ? (
                <Carousel>
                  {product.images.map((image, index) => (
                    <Carousel.Item key={index}>
                      <Image
                        className="d-block w-100 img-fluid"
                        src={image.image1 || image}
                        alt={`Slide ${index + 1}`}
                        style={{ maxHeight: "400px", objectFit: "contain", cursor: "pointer" }}
                        onClick={() => handleImageClick(image.image1 || image)}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                <Message variant="info">No images available</Message>
              )}
            </Col>

            <Col className="borderaround setheight" md={6}>
              <p className="details"><i className="fas fa-info"></i> General Details</p>
              <Row>
                <Col className="product" md={4}>
                  <ul>
                    <li> Product Id:</li>
                    <li> Posted On:</li>
                    <li> Expires On:</li>
                    <li> Product:</li>
                  </ul>
                </Col>
                <Col md={8}>
                  <ul>
                    <li>{product._id}</li>
                    <li>{product?.createdAt?.substring(0, 10)}</li>
                    <li>{product?.expiresOn?.substring(0, 10)}</li>
                    <li>{product.name}</li>
                  </ul>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Image Zoom Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Body className="text-center">
              <Image src={selectedImage} alt="Zoomed Image" fluid />
            </Modal.Body>
          </Modal>

          {loadingEmail && <Loader />}
          {errorEmail && <Message variant="danger">{errorEmail}</Message>}
          {dataEmail && emailSent && <Message variant="success">{dataEmail.response}</Message>}

          <Row>
            <Col className="borderaround mt-5" md={10}>
              <p className="details"><i className="fas fa-info"></i> Seller Details</p>
              <Row>
                <Col className="product" md={4}>
                  <ul>
                    <li>Name:</li>
                    <li>Email:</li>
                    <li>Address:</li>
                    <li>Phone:</li>
                  </ul>
                </Col>
                <Col md={8}>
                  <ul>
                    <li>{product?.seller?.sellername}</li>
                    <li>
                      <button className="emailbutton btn-success" onClick={() => setSendMail(true)}>
                        Send Email
                      </button>
                    </li>
                    <li>{product?.seller?.selleraddress}</li>
                    <li>{product?.seller?.phoneNo?.mobile}</li>
                  </ul>
                </Col>
              </Row>

              {sendMail && (
                <Form onSubmit={emailSubmit}>
                  <Form.Group controlId="emailText">
                    <Form.Label>Enter your message:</Form.Label>
                    <Form.Control as="textarea" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
                  </Form.Group>
                  <Button type="submit" variant="primary">Send</Button>
                  <Button variant="danger" onClick={() => setSendMail(false)} className="ml-2">Cancel</Button>
                </Form>
              )}
            </Col>
          </Row>

          <Row className="mt-3">
            <Col className="borderaround mt-5" md={10}>
              <p className="details"><i className="fas fa-info"></i> Pricing Details</p>
              <Row>
                <Col className="product" md={6}>
                  <ul>
                    <li>Total Price:</li>
                    {product?.Cost?.negotiable && <li>Negotiable:</li>}
                  </ul>
                </Col>
                <Col md={6}>
                  <ul>
                    <li>Rs {product?.Cost?.price}</li>
                    {product?.Cost?.negotiable && <li>Yes</li>}
                  </ul>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col className='borderaround mt-5' md={10} sm={12} xs={12}>
              <p className='details '>
                <i className='fas fa-info'></i> Description
              </p>
              <p className='detailsdescription'>{product.description}</p>
            </Col>
          </Row>
          <Row>
            <Col className='borderaround mt-5' md={10}>
              <p className='details'>
                <i className='fas fa-info'></i> Delivery Information
              </p>
              <Row>
                <Col className='product' md={6} sm={6} xs={5}>
                  <ul>
                    <li>Delivery Area:</li>
                    <li>Delivery Charge:</li>
                  </ul>
                </Col>
                <Col md={6} sm={6} xs={7}>
                  <ul>
                    <li>{product?.shippingAddress?.address} </li>
                    <li>
                      {' '}
                      Rs {''}
                      {product?.shippingAddress?.shippingCharge}
                    </li>
                  </ul>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className='mt-3'>
  <Col md={6}>
    <h4>Buyer's Speak</h4>
    {product.reviews.length === 0 && (
      <Message variant='primary'>Be the First One to Review</Message>
    )}
    <ListGroup variant='flush'>
      {product.reviews.map((review) => (
        <ListGroup.Item key={review._id}>
          <p>
            Q.<span className='comment'> {review.comment} </span>
            <span className='review'>
              <span style={{ color: '#32a897', fontWeight: '800' }}>
                --Posted By <strong>{review.name}</strong> on{' '}
                <strong> {review.createdAt.substring(0, 10)} </strong>{' '}
              </span>
            </span>
          </p>
          {userData && review.user === userData._id && (
            <Button
              variant='danger'
              onClick={() => deleteReviewHandler(review._id)}
            >
              Delete
            </Button>
          )}
        </ListGroup.Item>
      ))}

      <ListGroup.Item>
        <p>Post Your Speak</p>
        {errorReview && <Message variant='danger'>{errorReview}</Message>}
        {loadingReview && <Loader />}
        {userData ? (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='comment'>
              <Form.Control
                as='textarea'
                row='3'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button type='submit' variant='primary'>
              Post
            </Button>
          </Form>
        ) : (
          <Message variant='primary'>
            You must <Link to='/login'>Log In</Link> to post your speak{' '}
          </Message>
        )}
      </ListGroup.Item>
    </ListGroup>
  </Col>
</Row>

        </>
      )}
    </>
  );
};

export default ProductScreen;
