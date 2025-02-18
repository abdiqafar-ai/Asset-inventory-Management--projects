import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store'; // Ensure your Redux store is set up correctly
import NavbarComponent from './components/Navbar'; // The Navbar component
import AssetList from './components/AssetList'; // Import other page components
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Custom styles for the page

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <NavbarWithConditionalRendering />
        <Routes>
          {/* Show welcome message on homepage */}
          <Route path="/" element={<HomePage />} />
          
          {/* Other Routes */}
          <Route path="/assets" element={<AssetList />} />
          <Route path="/login" element={<Login />} />
          {/* Add other routes here */}
        </Routes>
      </Router>
    </Provider>
  );
};

// This component checks the route and conditionally renders the Navbar
const NavbarWithConditionalRendering = () => {
  const location = useLocation();  // Access the current location

  return (
    <>
      {/* Render Navbar only when the path is exactly '/' */}
      {location.pathname === '/' && <NavbarComponent />}
    </>
  );
};

const HomePage = () => {
  return (
    <div className="homepage-container">
      <div className="text-container">
        <h1 className="heading">Efficient Asset Tracking & Management for Your Organization</h1>
        <p className="subheading">
          Easily manage, request, and track your company's assets with real-time updates and streamlined processes
        </p>
      </div>
      <div className="image-container">
      <img src="/ASSET%20MANAGEMENT.jpeg" alt="Asset Tracking" className="homepage-image" />

      </div>
    </div>
  );
};

export default App;
