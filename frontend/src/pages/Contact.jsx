import React, { useState } from "react";
import API from "../api/axios";
import Layout from "../components/Layout";
import "../styles/Contact.css";
import {
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, 
  FaInstagram, FaFacebook, FaTwitter, FaLinkedin,
   FaStar, FaPalette, FaGift, FaCamera
} from "react-icons/fa";

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
  const [successMsg, setSuccessMsg] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ---------- VALIDATION ---------- */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Please enter your name";

    if (!formData.email.trim())
      newErrors.email = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email";

    if (!formData.phone.trim())
      newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Enter a valid 10-digit number";

    if (!formData.message.trim())
      newErrors.message = "Please share a message";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await API.post("/contact/send", formData);

      setFormData({ name: "", email: "", phone: "", message: "" });
      setErrors({});
      setSuccessMsg("Your message has been perfectly scooped 🍨");
      setSubmitted(true);

      setTimeout(() => {
        setSuccessMsg("");
        setSubmitted(false);
      }, 4000);
    } catch (err) {
      setToast({
        show: true,
        message:
          err.response?.data?.message ||
          "Something melted along the way. Please try again.",
      });

      setTimeout(() => setToast({ show: false, message: "" }), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      
      <div className="contact-page">
        <section className="contact-box">
        {/* ---------- HERO ---------- */}
          <p className="contact-tag">Let’s Connect</p>
          <h2>Connect. Indulge. Delight.</h2>
        
        {/* ---------- MAP & INFO ---------- */}
         
          <div className="map-box">
            <iframe
              title="CreMaze Location"
              src="https://www.google.com/maps?q=12.9716,77.5946&z=14&output=embed"
              loading="lazy"
              allowFullScreen
            />
          </div>

          <div className="contact-info">
            <h3>Visit or Reach Us</h3>

            <div className="info-row">
              <div>
                <FaMapMarkerAlt />
                <span>123 Cream Avenue, Bengaluru</span>
              </div>

              <div>
                <FaPhone />
                <span>Speak with us: +91 98765 43210</span>
              </div>

              <div>
                <FaEnvelope />
                <span>Email our team: hello@cremaze.com</span>
              </div>

              <div>
                <FaClock />
                <span>
                  Weekdays: 10 AM – 10 PM <br />
                  Weekends: 11 AM – 11 PM
                </span>
              </div>
            </div>

            <p>Follow the Flavor</p>
            <div className="contact-socials">
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <FaInstagram />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <FaTwitter />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                <FaLinkedin />
              </a>
            </div>
          </div>
        
        </section>

    <div className="contact-divider" />

        {/* ---------- CONTACT FORM ---------- */}
        
        <section className="contact-content">
          <h3>
            Got a scoop to share? <br />
            We’d love to swirl your thoughts into something sweet.
          </h3>

          <div className="contact-form">
            <h2>Get in Touch</h2>

            {successMsg && (
              <p className="contact-success">{successMsg}</p>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  aria-label="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <span>{errors.name}</span>}
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span>{errors.email}</span>}
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span>{errors.phone}</span>}
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                />
                {errors.message && <span>{errors.message}</span>}
              </div>

              <button
                type="submit"
                disabled={loading || submitted}
              >
                {loading ? "Sending..." : submitted ? "Sent ✓" : "Send Message"}
              </button>
            </form>

            <span className="form-note">
              We respond thoughtfully within 24–48 hours.
            </span>
          </div>
        </section>

        {/* ---------- PARTY BOOKING ---------- */}
        <section className="party-section">
          <h1>Moments worth celebrating. Flavors worth remembering.</h1>
        <section className="party-booking">
          <div className="party-booking-content">
            <h2>Crafted for Your Special Moments</h2>
            <p className="party-tagline">
             Thoughtfully crafted creations for gatherings worth remembering.
            </p>

            <ul className="party-features">
              <li><FaStar /> Custom-Crafted Selections</li>
              <li><FaPalette /> Live Dessert Experiences</li>
              <li><FaGift /> Signature Event Details</li>
              <li><FaCamera /> Styled Serving Experiences</li>
            </ul>

            <button className="party-btn">Reserve Yours</button>
          </div>

          <img src="/images/img.png" alt="CreMaze Celebration" />
        </section>
        </section>
        
        <div className="contact-divider" />

        {/* ---------- FAQ ---------- */}
        <section className="faq-section">
          <h2>The CreMaze Scoop</h2>

          <div className="faq-box">
            {[
              [
                "Do you provide on-site dessert experiences?",
                "Yes, our team can set up live dessert counters, styled displays, and tasting stations for gatherings and celebrations."
              ],
              [
                "What sizes and quantities do you offer?",
                "We cater to all occasions—individual servings, party packs, and large-scale orders are all available with personalized options."
              ],
              [
                "Where can I enjoy CreMaze creations?",
                "Our delicacies are available in select cities. Reach out, and we’ll let you know how to bring the magic to your location."
              ],
              [
                "Do you offer seasonal or limited-edition desserts?",
                "Yes! Explore our rotating seasonal menu featuring exclusive creations crafted with premium ingredients."
              ],
            ].map(([q, a], i) => (
              <details key={i}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>


        {/* ---------- TOAST ---------- */}
        {toast.show && (
          <div className="contact-toast">
            <span>{toast.message}</span>
            <button
              aria-label="Close notification"
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