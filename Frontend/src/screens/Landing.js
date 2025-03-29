import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Button, Dropdown } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "../components/Product";
import Paginate from "../components/Paginate";
import Meta from "../components/Meta";
import { listProducts } from "../actions/productActions";

const Landing = ({ match }) => {
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;
  const [selectedCategory, setSelectedCategory] = useState("All Categories"); // 

  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;
  const userLogin = useSelector((state) => state.userLogin);
  const { userData } = userLogin; // 

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber, selectedCategory));
  }, [dispatch, keyword, pageNumber, selectedCategory]);

  // ✅ Define categories
  const categories = ["All", "Electronics", "Furniture", "Books", "Others"];

  return (
    <>
      <Meta />
      {keyword && (
        <Link className="btn " to="/" style={{ backgroundColor: "#205781", color: "white" }}>
          Go Back
        </Link>
      )}
      
      {/* ✅ Category Dropdown */}
      <Dropdown className="mb-3">
        <Dropdown.Toggle style={{ backgroundColor: "#3674B5", borderColor: "#ff5733", color: "white" }}  id="dropdown-basic">
          {selectedCategory}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {categories.map((category) => (
            <Dropdown.Item key={category} onClick={() => setSelectedCategory(category)}>
              {category}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      <Row className="align-items-center">
        <Col>
          <h3> Latest Items On Sale</h3>
        </Col>
     
        <Col className="text-right">
          <LinkContainer to={userData ? "/createproduct" : "/login"}>
            <Button className="btn-primary">
              <i style={{ color: "white" }} className="fas fa-plus"></i>{" "}
              <span className="textcolor">SELL</span>
            </Button>
          </LinkContainer>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate pages={pages} page={page} keyword={keyword ? keyword : ""} />
        </>
      )}
    </>
  );
};

export default Landing;
