import React, { useState } from "react";
import API from "../api/axios";
import Layout from "../components/Layout";
import "../styles/Contact.css";
import { FaMapMarkerAlt,  FaPhone,  FaEnvelope,  FaClock,  FaInstagram,  FaFacebook,  FaTwitter,  FaLinkedin, } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [scoopSuccess, setScoopSuccess] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" }); 

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ---------------- VALIDATION ---------------- */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 10 digits";

    if (!formData.message.trim())
      newErrors.message = "Message cannot be empty";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await API.post("/contact/send", formData);

      setFormData({ name: "", email: "", phone: "", message: "" });
      setScoopSuccess(
        "Yum! CreMaze got your scoop 🍨"
      );
      setSubmitted(true);

      setTimeout(() => {
        setScoopSuccess("");
        setSubmitted(false);
      }, 4000);

      setTimeout(() => {
        document
          .querySelector(".scoop-success-message")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to send message ❌";
      setToast({ show: true, message: errorMsg });
      setTimeout(() => {
        setToast({ show: false, message: "" });
      }, 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="contact-container">
      
      {/* HEADER */}
      <header className="contact-header">
        <h1>GET IN TOUCH!</h1>
        <h3>
          We’d Love to Hear From You! <br />
          Connect with CreMaze
        </h3>
      </header>

      {/* MAP + INFO */}
      <div className="contact-box">
        <div className="map-box">
          <iframe
            title="CreMaze Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.7358!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670b4d4b8c9%3A0x4d2d3b7b4f7ed4c!2sBengaluru!5e0!3m2!1sen!2sin!4v1710000000000"
            loading="lazy"
            allowFullScreen
          />
        </div>

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
              <FaClock /> Mon–Fri: 10 AM - 10 PM <br />
              Sat–Sun: 11 AM - 11 PM
            </div>
          </div>

          <h3>Join Us</h3>
          <div className="contact-socials">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
            >
              <FaInstagram />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
            >
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <FaTwitter />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* SCOOP FORM */}
      <div className="scoop-contact-section">
        <h3>
          Got a scoop to share? <br />
          We’d love to swirl your thoughts into something sweet.
        </h3>

        <div className="scoop-form-container">
          <h2>Get the Scoop</h2>
          {scoopSuccess && (
            <div className="scoop-success-message">{scoopSuccess}</div>
          )}

          <form onSubmit={handleSubmit} className="scoop-contact-form">
            {["name", "email"].map((field) => (
              <div className="scoop-input-group" key={field}>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  placeholder={`Your ${field}`}
                  value={formData[field]}
                  onChange={handleChange}
                />
                {errors[field] && (
                  <span className="scoop-form-error">{errors[field]}</span>
                )}
              </div>
            ))}

            {/* PHONE */}
            <div className="scoop-input-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <span className="scoop-form-error">{errors.phone}</span>
              )}
            </div>

            {/* MESSAGE */}
            <div className="scoop-input-group">
              <textarea
                name="message"
                placeholder="Message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
              />
              {errors.message && (
                <span className="scoop-form-error">{errors.message}</span>
              )}
            </div>

            <div className="scoop-form-footer">
              <label className="scoop-checkbox-group">
                <input type="checkbox" /> Send offers
              </label>

              <button
                type="submit"
                className="scoop-contact-btn"
                disabled={loading || submitted}
              >
                {submitted ? "Message Sent ✓" : loading ? "Sending..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* PARTY BOOKING */}
      <div className="party-booking">
        <div className="party-booking-content">
          <h2>CreMaze Booking</h2>
          <p className="party-tagline">Make Every Celebration Sweet!</p>

          <ul className="party-features">
            <li>🍦 Custom Ice Cream Flavors</li>
            <li>🎨 Live Dessert Counters</li>
            <li>🎁 Party Favors</li>
            <li>📸 Photo Booths</li>
          </ul>

          <button className="party-btn">Reserve Now</button>
        </div>

        <img src="/img.png" alt="Ice Cream Party" />
      </div>

      {/* FAQ */}
      <div className="faq-section">
        <h2>FAQs</h2>
        <div className="faq-box">
          {[
            ["How soon will you respond?", "Within 24 hours."],
            ["Do you cater events?", "Yes, with live counters."],
            ["Do you offer bulk discounts?", "Yes, for party orders."],
            ["Payment methods?", "Cards, UPI & COD."],
          ].map(([q, a], i) => (
            <details key={i}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>

      {toast.show && (
        <div className="contact-toast">
          <span>{toast.message}</span>
          <button
            className="contact-toast-close"
            onClick={() => setToast({ show: false, message: "" })}
          >
            ✕
          </button>
        </div>
      )}
    </div>
    </Layout>
  );
};

export default Contact;
