import React, { useState } from "react";
import axios from "axios";
import "../styles/Contact.css";

import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaInstagram, FaFacebook, FaTwitter, FaLinkedin,
} from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.message.trim()) newErrors.message = "Message cannot be empty";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post("/api/contact/send", formData);
      setStatus("Message sent successfully!");
      setFormData({ name: "", email: "", message: "", phone: "" });
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to send message.");
    }
  };

  return (
    <div className="contact-container">
      <div className="bubble-area">
  {[...Array(10)].map((_, i) => (
    <div key={i} className={`bubble bubble${i + 1}`}></div>
  ))}
</div>

      {/* HEADER */}
      <header className="contact-header">
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&family=Poppins:wght@300;400&display=swap"
          rel="stylesheet"
        />

        <h1>GET IN TOUCH!</h1>
        <br />
        <h3>
          We’d Love to Hear From You! <br />
          Connect with Cremaze
        </h3>
      </header>

      {/* MAP + INFO */}
      <div className="contact-box">
        {/* MAP */}
        <div className="map-box">
          <iframe
            title="Cremaze Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.735829029326!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670b4d4b8c9%3A0x4d2d3b7b4f7ed4c!2sBengaluru%20City!5e0!3m2!1sen!2sin!4v0000000000000"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* CONTACT INFO */}
        <div className="contact-info">
          <h3>Reach Us</h3>

          <div className="info-row">
            <div>
              <FaMapMarkerAlt /> 123 Cream Avenue, Bangalore
            </div>
            <div>
              <FaPhone /> +91 98765 43210
            </div>
            <div>
              <FaEnvelope /> hello@cremaze.com
            </div>
            <div>
              <FaClock /> Mon–Fri: 10 AM - 10 PM <br /> Sat–Sun: 11 AM - 11 PM
            </div>
          </div>

          <h3>Join Us</h3>
          <div className="contact-socials">
            <FaInstagram />
            <FaFacebook />
            <FaTwitter />
            <FaLinkedin />
          </div>
        </div>
      </div>

      {/* CONTACT FORM */}
      <div className="contact-section">
        <h3>
          Got a scoop to share? <br />
          We’d love to swirl your thoughts into something sweet.
        </h3>

        <div className="contact-form-container">
          <h2>Get the Scoop</h2>

          {status && (
            <p
              className={
                status.includes("fail") ? "server-error" : "success-message"
              }
            >
              {status}
            </p>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            {/* Name & Email */}
            {["name", "email"].map((field) => (
              <div className="input-group" key={field}>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  placeholder={`Your ${
                    field.charAt(0).toUpperCase() + field.slice(1)
                  }`}
                  value={formData[field]}
                  onChange={handleChange}
                />
                {errors[field] && (
                  <span className="error">{errors[field]}</span>
                )}
              </div>
            ))}

            {/* Phone */}
            <div className="input-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Message */}
            <div className="input-group">
              <textarea
                name="message"
                placeholder="Message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
              />
              {errors.message && (
                <span className="error">{errors.message}</span>
              )}
            </div>

            {/* Checkbox + Button */}
            <div className="form-footer">
              <label className="checkbox-group">
                <input type="checkbox" name="newsletter" />
                Send offers
              </label>

              <button type="submit" className="contact-btn">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="party-booking">
  <div className="party-booking-content">
    <h2>Cremaze Booking</h2>
    <p className="party-tagline">
      Make Every Celebration Sweet & Memorable!
    </p>

    <p className="party-description">
      Birthdays • Corporate Events • School Parties <br />
      Celebrate with live counters, custom flavors, and handcrafted desserts.
    </p>

    <ul className="party-features">
      <li>🍦 Custom Ice Cream Flavors</li>
      <li>🎨 Live Dessert Counters</li>
      <li>🎁 Party Favors & Goodies</li>
      <li>📸 Fun Photo Booths</li>
    </ul>

    <p className="party-contact">Contact us today to reserve your date!</p>
    <button className="party-btn">Reserve Now</button>
  </div>

  <img src="img.png" alt="Ice Cream Party" />
</div>


      {/* FAQs */}
      <div className="faq-section">
        <h2>FAQs</h2>

        <div className="faq-box">
          {[
            { q: "How soon will you respond?", 
              a: "We usually respond within 24 hours, often much sooner during business hours." },
            { q: "Do you cater events?", 
              a: "Yes! We offer event catering with live counters and customized ice cream flavors." },
            { q: "Do you offer bulk discounts?", 
              a: "Yes, we provide special pricing and discounts for bulk and party orders." },
            { q: "What payment methods do you accept?", 
              a: "We accept cards, UPI payments, and cash on delivery." },

          ].map((faq, i) => (
            <details key={i}>
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
