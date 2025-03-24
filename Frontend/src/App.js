import './App.css';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './screens/Landing';
import ProductScreen from './screens/ProductScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import UserListScreen from './screens/UserListScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import UserUpdateScreen from './screens/UserUpdateScreen';
import AboutUsScreen from './screens/AboutUsScreen';
import NotFoundScreen from './screens/NotFoundScreen';
import ProductCreateScreen from './screens/ProductCreateScreen';
import EmailVerificationScreen from './screens/EmailVerificationScreen';
import CartPage from './screens/CartPage'; // Import CartPage
import CheckoutPage from './screens/CheckoutPage'; // Import CheckoutPage
import InvoicePage from './screens/InvoicePage';

const App = () => {
  return (
    <Router>
      <>
        <Header />

        <main className='py-5'>
          <Container>
            <Switch>
              <Route path='/' component={Landing} exact />
              <Route path='/search/:keyword' component={Landing} exact />
              <Route path='/page/:pageNumber' component={Landing} exact />
              <Route
                path='/search/:keyword/page/:pageNumber'
                component={Landing}
                exact
              />
              <Route path='/login' component={LoginScreen} exact />
              <Route path='/register' component={RegisterScreen} exact />
              <Route path='/about' component={AboutUsScreen} exact />
              <Route path='/product/:id' component={ProductScreen} exact />
              <Route path='/admin/userlist' component={UserListScreen} exact />
              <Route
                path='/admin/productlist'
                component={ProductListScreen}
                exact
              />
              <Route
                path='/admin/productlist/:pageNumber'
                component={ProductListScreen}
                exact
              />
              <Route path='/createproduct' component={ProductCreateScreen} />
              <Route
                path='/admin/product/:id/edit'
                component={ProductEditScreen}
                exact
              />
              <Route
                path='/admin/users/:id/edit'
                component={UserUpdateScreen}
                exact
              />
              <Route path='/verify/:token' component={EmailVerificationScreen} exact />
              
              {/* Add Routes for Cart and Checkout */}
              <Route path='/cart' component={CartPage} exact /> {/* Cart page route */}
              <Route path='/checkout' component={CheckoutPage} exact /> {/* Checkout page route */}
              <Route path="/invoice" component={InvoicePage} />

              {/* Fallback route */}
              <Route component={NotFoundScreen} />
            </Switch>
          </Container>
        </main>
      </>
      <Footer />
    </Router>
  );
};

export default App;
