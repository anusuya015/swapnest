import React from 'react'
import { Route } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { logout } from '../actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
import SearchBox from './SearchBox'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { FaUser, FaSignOutAlt, FaCog, FaInfoCircle } from 'react-icons/fa'

const Header = () => {
  const dispatch = useDispatch()
  const userLogin = useSelector((state) => state.userLogin)
  const { userData } = userLogin
  const logoutHandler = () => {
    dispatch(logout())
  }

  return (
    <header>
      <Navbar style={{ backgroundColor: '#0C0950' }} variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand >
              SwapNest
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Route render={({ history }) => <SearchBox history={history} />} />

            <Nav className='ml-auto'>
              {userData ? (
                <NavDropdown
                  title={<span><FaUser /> {userData.name}</span>}
                  id='username'
                  menuVariant="dark"
                >
                  <LinkContainer to={`/admin/users/${userData._id}/edit`}>
                    <NavDropdown.Item>
                      <FaCog className='mr-2' />
                      Profile
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/myorders">
                      <NavDropdown.Item>My Orders</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    <FaSignOutAlt className='mr-2' />
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>
                    <FaUser className='mr-2' />
                    Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
              {userData && userData.isAdmin && (
                <NavDropdown title='Admin' id='adminmenu' menuVariant="dark">
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>
                      <FaUser className='mr-2' />
                      Users
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>
                      <FaCog className='mr-2' />
                      Products
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
              <LinkContainer to='/about'>
                <Nav.Link>
                  About Us
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
