import React from 'react';
import './AboutUs.css';  // Optional: Create a CSS file to style the About Us page

const AboutUs = () => {
  return (
    <div className="about-us-container">
      {/* About Us Header with Image */}
      <section className="about-us-header">
        <h1>About Us</h1>
        <p>We are a company committed to simplifying asset tracking and management for businesses of all sizes. Our platform empowers organizations to easily track, manage, and optimize their asset portfolios in real-time.</p>
        
        {/* Add a background image or just an image */}
        <img 
          src="/Manage.jpeg" // Corrected path
          alt="Company Overview" 
          className="about-us-image" 
        />
      </section>

      {/* About Us Content */}
      <section className="about-us-content">
        <h2>Our Mission</h2>
        <p>Our mission is to streamline asset management processes, providing businesses with the tools they need to manage their resources efficiently. We believe in delivering real-time insights and actionable data, helping our clients make smarter decisions about their assets.</p>

        <h2>Our Vision</h2>
        <p>We envision a world where businesses of all sizes can optimize their asset portfolios with ease. By continuously innovating and improving our platform, we aim to be the leading solution for asset management globally.</p>
        
        <h2>Our Values</h2>
        <p>Our core values guide everything we do:</p>
        <ul>
          <li><strong>Integrity:</strong> We always strive to do the right thing.</li>
          <li><strong>Innovation:</strong> We are always looking for new and better ways to improve asset management.</li>
          <li><strong>Customer-Centric:</strong> Our customers’ needs always come first, and we are committed to their success.</li>
        </ul>
      </section>
    </div>
  );
};

export default AboutUs;
