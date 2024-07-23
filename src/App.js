
// import './App.css';
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './components/Home.jsx';
import RestaurantDisplay from './components/RestaurantDisplay.jsx';
import RestaurantState from './context/RestaurantState.jsx';
import EditForm from './components/EditForm.jsx';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import ForgotPassword from './components/ForgotPassword.jsx';
import LoadingBarComponent from './components/LoadingBar.jsx';
import NavigationListener from './components/NavigationListener.jsx';
import { useContext } from 'react';
import RestaurantContext from './context/RestaurantContext.jsx';
import Alert from './components/Alert.jsx';
import { LoadScript } from '@react-google-maps/api';
import About from './components/About.jsx';
import RenewForm from './components/Renew.jsx';
import VerifyCoupon from './components/VerifyCoupon.jsx';
const libraries = ['places'];
const App = () => {
  const location = useLocation();//get the location object

  const shouldShowAlertWrapper = () => {//this determines when to show the alert wrapper component
    const currentPath = location.pathname;
    return currentPath === '/login' || currentPath === '/signup' || currentPath === '/view-edit-details' || currentPath === '/forgot-password' || currentPath==='/verify-coupon'
  };
  return (
    <RestaurantState>
      <LoadingBarComponent />
      <NavigationListener />
      <NavbarWrapper />
      {shouldShowAlertWrapper() && <div className='alertWrapper'>
        <AlertWrapper />
      </div>}
      <LoadScript googleMapsApiKey='AIzaSyAkzD8dg5FdfKM52FLZwXXhLK8Rzw5yv8Q' libraries={libraries} >
        <div style={{ minHeight: "85vh" }}>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/about" element={<About />} />
            <Route exact path="/restaurant-display" element={<RestaurantDisplay />} />
            <Route exact path="/view-edit-details" element={<EditForm />} />
            <Route exact path="/renew-membership" element={<RenewForm />} />
            <Route exact path="/verify-coupon" element={<VerifyCoupon />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </div>
      </LoadScript>
      <Footer />
    </RestaurantState>
  );
}
const AlertWrapper = () => {
  const { alert, showAlert } = useContext(RestaurantContext);
  return showAlert ? <Alert alert={alert} /> : null;
};
const NavbarWrapper = () => {
  const location = useLocation();
  const currentPath = location.pathname;//only if current location is this , then set login prop to false so it shows the logout button
  if (currentPath === '/view-edit-details' || currentPath === '/verify-coupon')
    return <Navbar loggedIn={true} renew={false} />;
  else if (currentPath === '/renew-membership')
    return <Navbar loggedIn={true} renew={true} />;
  else 
    return <Navbar loggedIn={false} />;
  
};
export default App;
