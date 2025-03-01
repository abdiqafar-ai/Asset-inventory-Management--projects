import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      {/* About Us Header */}
      <section className="about-us-header">
        <h1>About Us</h1>
        <p>We are a forward-thinking company dedicated to revolutionizing the way businesses manage and track their assets, helping organizations stay ahead in a rapidly evolving world.</p>
        <p className="about-us-subheading">Empowering businesses with seamless, real-time asset management solutions for sustainable growth and increased efficiency.</p>
      </section>

      {/* About Us Content */}
      <section className="about-us-content">
        <h2>Our Mission</h2>
        <p>Our mission is to empower businesses with seamless asset management solutions, enabling them to optimize resources, increase efficiency, and make data-driven decisions for sustainable growth.</p>

        <h2>Our Vision</h2>
        <p>We envision a future where businesses of all scales are empowered to fully leverage their asset portfolios, unlocking new efficiencies and value with ease and precision.</p>

        <h2>Our Values</h2>
        <p>Our core values are the foundation of our company, shaping our actions and decisions. We remain committed to the highest standards of integrity, innovation, and customer focus.</p>
        <ul>
          <li><strong>Integrity:</strong> We always strive to do the right thing.</li>
          <li><strong>Innovation:</strong> We are always looking for new and better ways to improve asset management.</li>
          <li><strong>Customer-Centric:</strong> Our customers’ needs always come first, and we are committed to their success.</li>
        </ul>
      </section>

      {/* Why We Are Different Section */}
      <section className="why-we-are-different">
        <h2>Why We Are Different</h2>
        <p>We stand out because of our commitment to innovation, customer success, and providing real-time, actionable insights. Here's what makes us unique:</p>

        <div className="difference-box">
          <div className="difference-item">
            <i className="fas fa-cogs fa-3x difference-logo"></i> {/* Gear icon for Innovation */}
            <h3>Innovation</h3>
            <p>We are always ahead of the curve, integrating cutting-edge technology to improve asset management processes.</p>
          </div>

          <div className="difference-item">
            <i className="fas fa-users fa-3x difference-logo"></i> {/* Users icon for Customer-Centric */}
            <h3>Customer-Centric</h3>
            <p>Your needs come first. We listen and provide tailored solutions to ensure your success.</p>
          </div>

          <div className="difference-item">
            <i className="fas fa-chart-line fa-3x difference-logo"></i> {/* Chart icon for Real-Time Insights */}
            <h3>Real-Time Insights</h3>
            <p>Get instant access to real-time data, enabling smarter decisions and optimized resource management.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;
