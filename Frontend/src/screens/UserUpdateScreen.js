import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts, deleteProduct } from '../actions/productActions'
import { LinkContainer } from 'react-router-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { updateUser, getUserDetails } from '../actions/userActions'
import FormContainer from '../components/FormContainer'
import { USER_UPDATE_RESET, USER_DETAILS_RESET } from '../types/userConstants'

const UserUpdateScreen = ({ history, match }) => {
  const userId = match.params.id
  var i = 1
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone_no, setPhone_no] = useState('')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()
  const userLogin = useSelector((state) => state.userLogin)
  const { userData } = userLogin
  const userUpdate = useSelector((state) => state.userUpdate)
  const { success, loading, error } = userUpdate
  const userDetails = useSelector((state) => state.userDetails)
  const { user, loading: loadingDetails } = userDetails
  const productList = useSelector((state) => state.productList)
  const { products, loading: loadinglist } = productList
  const productDelete = useSelector((state) => state.productDelete)
  const { success: successDelete } = productDelete

  useEffect(() => {
    dispatch(listProducts())
    if (!userData || success) {
      dispatch({ type: USER_UPDATE_RESET })
      dispatch({ type: USER_DETAILS_RESET })

      if (userData && userData.isAdmin) {
        history.push('/admin/userlist')
      } else {
        history.push('/')
      }
    } else {
      if (!user?.name) {
        dispatch(getUserDetails(userId))
      } else {
        setName(user.name)
        setAddress(user.address)
        setPhone_no(user?.contact?.phone_no)
        setEmail(user.email)
      }
    }
  }, [history, userData, user, success, dispatch, userId, successDelete])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteProduct(id))
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } else {
      dispatch(
        updateUser({
          _id: userId,
          name,
          email,
          password,
          address,
          phone_no,
        })
      )
    }
  }

  return (
    <>
      <style>
        {`
          /* Make form responsive */
          form {
            max-width: 500px;
            margin: auto;
            padding: 20px;
          }
          
          /* Responsive table */
          .table-responsive {
            overflow-x: auto;
          }
          
          /* Adjust button sizes */
          button {
            width: 100%;
            margin-top: 10px;
          }
          
          /* Table styling */
          .table-sm td, .table-sm th {
            text-align: center;
            vertical-align: middle;
          }

          /* Reduce input field width on small screens */
          @media (max-width: 576px) {
            form input, form select {
              width: 100%;
            }
          }
          
          /* Hide extra columns on small screens */
          @media (max-width: 768px) {
            .hide-on-mobile {
              display: none;
            }
          }
        `}
      </style>

      <FormContainer>
        <h1>Details</h1>
        {loadingDetails && <Loader />}
        <Form onSubmit={submitHandler} className="mt-5 mb-2">
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="contact">
            <Form.Label>Mobile No</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Mobile No"
              value={phone_no}
              onChange={(e) => setPhone_no(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          {loading && <Loader />}
          <Button type="submit" variant="primary">
            Update Profile
          </Button>
        </Form>

        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {success && <Message variant="success">Profile updated successfully</Message>}
      </FormContainer>

      <Row>
        <Col>
          {loadinglist ? (
            <Loader />
          ) : (
            <>
              <h3>My Uploads</h3>
              <div className="table-responsive">
                <Table striped bordered hover responsive className="table-sm">
                  <thead>
                    <tr>
                      <th>SN</th>
                      <th>ID</th>
                      <th>Product Name</th>
                      <th className="hide-on-mobile">Category</th>
                      <th>Price</th>
                      <th className="hide-on-mobile">Negotiable</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData &&
                      products &&
                      products.map(
                        (product) =>
                          product?.user === userData._id && (
                            <tr key={product._id}>
                              <td>{i++}</td>
                              <td>{product._id}</td>
                              <td>{product.name}</td>
                              <td className="hide-on-mobile">{product.category}</td>
                              <td>₹{product?.Cost?.price}</td>
                              <td className="hide-on-mobile">
                                {product?.Cost?.negotiable ? (
                                  <i className="fas fa-check" style={{ color: 'green' }}></i>
                                ) : (
                                  <i className="fas fa-times" style={{ color: 'red' }}></i>
                                )}
                              </td>
                              <td>
                                <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(product._id)}>
                                  <i className="fas fa-trash"></i>
                                </Button>
                              </td>
                            </tr>
                          )
                      )}
                  </tbody>
                </Table>
              </div>
            </>
          )}
        </Col>
      </Row>
    </>
  )
}

export default UserUpdateScreen
