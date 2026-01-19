import React, { useState } from "react";
import "../styles/Footer.css";
import { FaInstagram, FaYoutube, FaFacebook, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaTwitter, FaLinkedin } from "react-icons/fa";

function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribeStatus(newsletterEmail ? "Subscribed successfully!" : "Please enter a valid email.");
    if (newsletterEmail) setNewsletterEmail("");
  };

  return (
    <footer>
      <div className="footer-container">

        {/* Logo & Tagline */}
        <div className="footer-section footer-tagline">
          <div className="footer-tagline-top">
            <img src="/logo.png" alt="CreMaze Logo" className="logo" />
            <h2>Where Every Scoop <br /> is a Delight!</h2>
          </div>
          <p>"Dive into a world of creamy flavors and endless happiness!"</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><span className="link-inner"><a href="/">Home</a></span></li>
            <li><span className="link-inner"><a href="/menu">Menu</a></span></li>
            <li><span className="link-inner"><a href="/about">About Us</a></span></li>
            <li><span className="link-inner"><a href="/contact">Contact</a></span></li>
          </ul>

        </div>

        {/* Contact Info */}
        <div className="footer-section footer-connect">
          <h3>Let’s Connect</h3>
          <p><FaMapMarkerAlt /> 123 Cream Avenue, Bangalore, India</p>
          <p><FaEnvelope /> hello@cremaze.com</p>
          <p><FaPhone /> +91 98765 43210</p>
          <p><FaClock /> Mon – Fri: 10:00 AM - 10:00 PM <br></br>Sat – Sun: 11:00 AM - 11:00 PM</p>
          
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer-section footer-newsletter">
          <h3>Get the Scoop!</h3>
          <form onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Your Email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
            />
            <button type="submit">Subscribe</button>
          </form>
          {subscribeStatus && <p className="status-text">{subscribeStatus}</p>}
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        &copy; 2025 CreMaze | All rights reserved.
      </div>
      <img src="footer bg.png" class="footer-right-img" alt="" />

    </footer>
  );
}

export default Footer;
