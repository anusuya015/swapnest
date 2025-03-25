import React, { useState, useEffect } from "react";
import Meta from "../components/Meta";
import '../components/Product.css';
import axios from "axios";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
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

const ProductScreen = ({ match, history }) => {
  const [text, setText] = useState("");
  const [comment, setComment] = useState("");
  const [sendMail, setSendMail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const dispatch = useDispatch();
  const emailReducer = useSelector((state) => state.emailReducer);
  const {
    loading: loadingEmail,
    error: errorEmail,
    data: dataEmail,
  } = emailReducer;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    loading: loadingReview,
    error: errorReview,
    success: successReview,
  } = productReviewCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userData } = userLogin;

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  useEffect(() => {
    if (successReview) {
      setComment("");
      dispatch({ type: PRODUCT_REVIEW_RESET });
    }
    dispatch(listProductDetails(match.params.id));
  }, [match.params.id, dispatch, successReview]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createProductReview(match.params.id, comment));
  };

  const emailSubmit = (e) => {
    e.preventDefault();
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
    setTimeout(() => {
      setEmailSent(false);
    }, 10000);
  };

  const sendEMAIL = () => {
    setSendMail(true);
  };

  const cancelHandler = () => {
    setSendMail(false);
  };
  const handlePayment = async () => {
  
    try {
      // Step 1: Create Order
      const { data } = await axios.post("http://localhost:5000/create-order", {
        amount: product?.Cost?.price,    // Replace with actual amount
        currency: "INR",
        receipt: "order_rcptid_11",
      });

      const options = {
        key: "rzp_test_dkrO59FMp7ggDP",
        amount: product?.Cost?.price * 100, // Amount in paisa
        currency: "INR",
        name: "E-commerce Store",
        description: "Test Transaction",
        order_id: data.orderId,
        handler: async function (response) {
          const paymentData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          // Step 3: Verify Payment
          const verifyRes = await axios.post("http://localhost:5000/verify-payment", paymentData);
          
        },
        prefill: {
          name: "Harsh Balam",
          email: "harsh@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#28a745",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment Error:", error);
     
    } finally {
      
    }
  };

  return (
    <>
      <Link to="/" className="btn btn-success my-3">
        Go Back
      </Link>
      <br />
      {userData && userData._id === product.user && (
        <Link
          to={`/admin/product/${match.params.id}/edit`}
          className="btn btn-primary my-3"
        >
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
                        className="d-block w-100"
                        src={image.image1 || image}
                        alt={`Slide ${index + 1}`}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                <Message variant="info">No images available</Message>
              )}
            </Col>

            <Col className="borderaround setheight" md={6}>
              <p className="details">
                <i className="fas fa-info"></i> General Details
              </p>
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

          {loadingEmail && <Loader />}
          {errorEmail && <Message variant="danger">{errorEmail}</Message>}
          {dataEmail && emailSent && (
            <Message variant="success">{dataEmail.response}</Message>
          )}

          <Row>
            <Col className="borderaround mt-5" md={10}>
              <p className="details">
                <i className="fas fa-info"></i> Seller Details
              </p>
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
                      <button
                        className="emailbutton btn-success"
                        onClick={sendEMAIL}
                      >
                        Send Email
                      </button>
                    </li>
                    <li>{product?.seller?.selleraddress}</li>
                    <li>{product?.seller?.phoneNo?.mobile}</li>
                  </ul>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col className="borderaround mt-5" md={10}>
              <p className="details">
                <i className="fas fa-info"></i> Pricing Details
              </p>
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
            <Col className="borderaround mt-5" md={10}>
              <p className="details">
                <i className="fas fa-info"></i> Description
              </p>
              <p className="detailsdescription">{product.description}</p>
            </Col>
          </Row>

          <Row>
            <Col className="borderaround mt-5" md={10}>
              <p className="details">
                <i className="fas fa-info"></i> Delivery Information
              </p>
              <Row>
                <Col className="product" md={6}>
                  <ul>
                    <li>Delivery Area:</li>
                    <li>Delivery Charge:</li>
                  </ul>
                </Col>
                <Col md={6}>
                  <ul>
                    <li>{product?.shippingAddress?.address}</li>
                    <li>Rs {product?.shippingAddress?.shippingCharge}</li>
                  </ul>
                </Col>
              </Row>
            </Col>
          </Row>
         
      <button
        className="emailbutton btn-success button "
        onClick={handlePayment}
      >
        Buy Now
      </button>
      
        </>
      )}
      
    </>
  );
};

export default ProductScreen;
