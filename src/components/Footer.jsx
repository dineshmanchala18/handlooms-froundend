import React from 'react';

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-section">
        <h3>About TribalArtisan</h3>
        <p>We are dedicated to preserving and promoting traditional tribal crafts by providing a global platform for artisans.</p>
        <div className="social-links">
          <a href="#"><span>📘</span></a>
          <a href="#"><span>📷</span></a>
          <a href="#"><span>🐦</span></a>
          <a href="#"><span>📌</span></a>
        </div>
      </div>
      
      <div className="footer-section">
        <h3>Quick Links</h3>
        <p>▶ About Us</p>
        <p>▶ Our Artisans</p>
        <p>▶ Cultural Heritage</p>
        <p>▶ Blog</p>
        <p>▶ FAQs</p>
      </div>
      
      <div className="footer-section">
        <h3>Contact Info</h3>
        <p>📍 123 Heritage Street, Craft Village</p>
        <p>📞 +1 234 567 890</p>
        <p>✉️ info@tribalartisan.com</p>
        <p>🕒 Mon-Fri: 9:00 AM - 6:00 PM</p>
      </div>
      
      <div className="footer-section">
        <h3>Newsletter</h3>
        <p>Subscribe for updates</p>
        <div className="newsletter-form">
          <input type="email" placeholder="Your email" />
          <button className="btn btn-primary">Subscribe</button>
        </div>
      </div>
    </div>
    
    <div className="footer-bottom">
      <p>&copy; 2024 TribalArtisan. All rights reserved. | Preserving Cultural Heritage Through Craft</p>
    </div>
  </footer>
);

export default Footer;
