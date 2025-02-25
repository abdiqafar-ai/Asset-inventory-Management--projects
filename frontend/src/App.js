import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store'; // Ensure your Redux store is set up correctly
import NavbarComponent from './components/Navbar'; // The Navbar component
import AssetList from './components/AssetList'; // Import other page components
import SignUp from './components/SignUp'; // Sign-up page component
import AboutUs from './components/AboutUs';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from "./components/ResetPassword";
import 'bootstrap/dist/css/bootstrap.min.css';
import Admin from "./admin/admin";
import Procurement from './ProcurementManager/procurement';
import './App.css'; // Custom styles for the page

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Navbar /> {/* Conditionally rendered Navbar */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/assets" element={<AssetList />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/admin-dashboard" element={<Admin />} />
          <Route path="/procurement-dashboard" element={<Procurement />} />
        </Routes>
      </Router>
    </Provider>
  );
};

// Navbar Component that renders only on the Homepage ("/")
const Navbar = () => {
  const location = useLocation();

  // Show Navbar only if the current path is "/"
  if (location.pathname !== "/") {
    return null;
  }

  return <NavbarComponent />;
};

const HomePage = () => {
  return (
    <div className="homepage-container">
      <div className="text-container">
        <h1 className="heading">Efficient Asset Tracking & Management for Your Organization</h1>
        <p className="subheading">
          Easily manage, request, and track your company's assets with real-time updates and streamlined processes.
        </p>
        <Link to="/signup">
          <button className="cta-button">GET STARTED</button>
        </Link>
      </div>
      <div className="image-container">
        <img src="/ASSET%20MANAGEMENT.jpeg" alt="Asset Tracking" className="homepage-image" />
      </div>

      <div id="contact" className="contacts-section">
        <div className="contacts-box">
          <h2>Contact Us</h2>
          <p>If you have any questions or need further information, feel free to reach out.</p>
          <div className="contact-details">
            <p><strong>Email:</strong> support@assetmanagement.com</p>
            <p><strong>Phone:</strong> +123 456 7890</p>
          </div>

          <div className="social-media-links">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-media-link">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-media-link">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="social-media-link">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-media-link">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
