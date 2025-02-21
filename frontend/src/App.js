import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store'; // Ensure your Redux store is set up correctly
import NavbarComponent from './components/Navbar'; // The Navbar component
import AssetList from './components/AssetList'; // Import other page components
import SignUp from './components/SignUp'; // Sign-up page component
import AboutUs from './components/AboutUs';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Custom styles for the page

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <NavbarComponent />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/assets" element={<AssetList />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </Router>
    </Provider>
  );
};

const HomePage = () => {
  return (
    <div className="homepage-container">
      <div className="text-container">
        <h1 className="heading">Efficient Asset Tracking & Management for Your Organization</h1>
        <p className="subheading">
          Easily manage, request, and track your company's assets with real-time updates and streamlined processes.
        </p>
        {/* Call to Action Button - GET STARTED */}
        <Link to="/signup">
          <button className="cta-button">GET STARTED</button>
        </Link>
      </div>
      <div className="image-container">
        <img src="/ASSET%20MANAGEMENT.jpeg" alt="Asset Tracking" className="homepage-image" />
      </div>

      {/* Contact Section */}
      <div id="contact" className="contacts-section">
        <div className="contacts-box">
          <h2>Contact Us</h2>
          <p>If you have any questions or need further information, feel free to reach out.</p>
          <div className="contact-details">
            <p><strong>Email:</strong> support@assetmanagement.com</p>
            <p><strong>Phone:</strong> +123 456 7890</p>
          </div>

          {/* Social Media Links using Font Awesome Icons */}
          <div className="social-media-links">
            {/* Facebook Icon */}
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-media-link">
              <i className="fab fa-facebook-f"></i>
            </a>

            {/* Twitter Icon */}
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-media-link">
              <i className="fab fa-twitter"></i>
            </a>

            {/* LinkedIn Icon */}
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="social-media-link">
              <i className="fab fa-linkedin-in"></i>
            </a>

            {/* Instagram Icon */}
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
