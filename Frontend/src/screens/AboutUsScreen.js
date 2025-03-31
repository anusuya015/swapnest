import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { FaPhoneAlt, FaCheckCircle, FaEnvelope, FaRecycle } from "react-icons/fa";
import { BsFillGearFill } from "react-icons/bs";
import "./AboutUsScreen.css"; // Add custom styles here

const AboutUsScreen = () => {
  return (
    <div className="about-body">
      {/* About Us Section */}
      <Row className="about-section">
        <Col xs={12} md={10} lg={8} className="about-text mx-auto">
          <p className="about-description">
            Welcome to <strong>SwapNest</strong>, a community-driven platform designed to help people buy and sell second-hand goods. Our goal is to provide an easy-to-use, sustainable marketplace where items such as furniture, appliances, stationery, and more can be sold and repurposed. We aim to foster a circular economy, allowing goods that are no longer in use to find new life in a way that is both practical and eco-friendly.
          </p>
        </Col>
      </Row>

      {/* Services Section (Cards with animations) */}
      <Row className="services-section">
        <Col xs={12} md={10} lg={8} className="mx-auto">
          <h2 className="services-title">What We Provide</h2>
          <Row>
            <Col sm={12} md={6} lg={4} className="mb-4">
              <Card className="service-card h-100">
                <Card.Body>
                  <FaRecycle className="service-icon" />
                  <Card.Title className="service-title">Sustainable Marketplace</Card.Title>
                  <Card.Text>
                    Buy and sell second-hand goods, giving items a second life. Join our platform for a more sustainable and eco-friendly way to shop!
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={6} lg={4} className="mb-4">
              <Card className="service-card h-100">
                <Card.Body>
                  <FaCheckCircle className="service-icon" />
                  <Card.Title className="service-title">Free Listing</Card.Title>
                  <Card.Text>
                    List your items for sale with no fees or commissions! ReuseIt allows you to easily list and sell items to others.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={6} lg={4} className="mb-4">
              <Card className="service-card h-100">
                <Card.Body>
                  <BsFillGearFill className="service-icon" />
                  <Card.Title className="service-title">Simple and Easy-to-Use</Card.Title>
                  <Card.Text>
                    Our platform is designed to be user-friendly, making the process of buying and selling smooth and hassle-free.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Contact Us Section */}
      <Row className="contact-section">
        <Col xs={12} md={10} lg={8} className="mx-auto contact-info">
          <h3 className="contact-title">Contact Us</h3>
          <p className="contact-details">
            <FaPhoneAlt className="contact-icon" /> <strong>Phone:</strong> 1800 2020 4888
            <br />
            <FaEnvelope className="contact-icon" /> <strong>Email:</strong>
            <a href="mailto:secondhandgoods@gmail.com" className="contact-email">
              secondhandgoods@gmail.com
            </a>
          </p>
        </Col>
      </Row>

      {/* Additional Information Section */}
      <Row className="info-section">
        <Col xs={12} md={10} lg={8} className="mx-auto info-text">
          <h3 className="info-title">Additional Information</h3>
          <p className="info-description">
            At SwapNest, we strive to create a community-driven platform where goods that are no longer in use can find new homes. By connecting buyers and sellers, we help reduce waste and promote sustainability.
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default AboutUsScreen;
