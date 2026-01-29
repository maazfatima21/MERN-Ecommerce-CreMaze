import React from "react";
import Layout from "../components/Layout";
import "../styles/About.css";
import { FaIceCream, FaHeart, FaLeaf, FaSmile } from "react-icons/fa";

function About() {
  return (
    <Layout>
      <div className="about-container">

      {/* ABOUT + CAROUSEL SECTION */}
      <div className="about-carousel-section">
        
        <div className="about-text-section">
          <h1 className="about-title">About Cremaze</h1>
          <p className="about-text">
            Cremaze is your perfect destination for premium handcrafted ice-creams. <br />
            We blend rich flavors, fresh ingredients, and creative recipes to bring <br />
            you a delightful frozen experience in every scoop.
          </p>
          <p className="about-text">
            Whether you're craving something classic, fruity, chocolatey, <br />
            completely unique — Cremaze has something to melt your heart.
          </p>
        </div>

        <div className="carousel">
          <div className="carousel-track">
            <img src="ice1.png" alt="ice cream" />
            <img src="ice2.png" alt="ice cream" />
            <img src="ice3.png" alt="ice cream" />
            <img src="ice4.png" alt="ice cream" />
            <img src="ice5.png" alt="ice cream" />
            <img src="ice6.png" alt="ice cream" />

            <img src="ice1.png" alt="ice cream" />
            <img src="ice2.png" alt="ice cream" />
            <img src="ice3.png" alt="ice cream" />
            <img src="ice4.png" alt="ice cream" />
            <img src="ice5.png" alt="ice cream" />
            <img src="ice6.png" alt="ice cream" />
          </div>
        </div>

      </div>

      {/* WHY CHOOSE US */}
      <h2 className="section-title why-title">What Makes Cremaze Special?</h2>
      <div className="why-us-grid">
        <div className="why-card why-card-1">
          <FaIceCream className="why-icon" />
          <h3>Premium Quality</h3>
          <p>We use the finest ingredients for rich and creamy scoops.</p>
        </div>

        <div className="why-card why-card-2">
          <FaLeaf className="why-icon" />
          <h3>Fresh Ingredients</h3>
          <p>Every batch is made with love, freshness, and zero shortcuts.</p>
        </div>

        <div className="why-card why-card-3">
          <FaHeart className="why-icon" />
          <h3>Made with Love</h3>
          <p>Each flavor is crafted with passion and creativity.</p>
        </div>

        <div className="why-card why-card-4">
          <FaSmile className="why-icon" />
          <h3>Customer Happiness</h3>
          <p>Your smile is our biggest reward — always serving joy!</p>
        </div>
      </div>

      

      {/* TEAM MEMBERS */}
     
      <h2 className="section-title team-title">Meet Our Makers</h2>
      <div className="team-grid">
        <div className="team-card">
          <img src="M1.png" alt="Maria" />
          <h3>Maria</h3>
          <p>Master Ice-Cream Crafter</p>
        </div>

        <div className="team-card">
          <img src="M2.png" alt="John" />
          <h3>John</h3>
          <p>Flavor Scientist</p>
        </div>

        <div className="team-card">
          <img src="M3.png" alt="Eva" />
          <h3>Eva</h3>
          <p>Creative Designer</p>
        </div>

        <div className="team-card">
          <img src="M4.png" alt="Sarah" />
          <h3>David</h3>
          <p>Quality Expert</p>
        </div>
        
      </div>

      {/* CUSTOMER REVIEWS */}
      <h2 className="section-title review-title">What Our Customers Say</h2>

      <div className="review-grid">

     <div className="review-track">
    {/* Original Reviews */}
    <div className="review-card">
      <p>“Best ice cream I’ve had in years! The texture is unbelievably smooth.”</p>
      <span>⭐⭐⭐⭐⭐</span>
      <h4 className="customer-name">— Ayesha Khan</h4>
    </div>

    <div className="review-card">
      <p>“Super creamy and delicious. Loved it! I can’t stop buying this flavor.”</p>
      <span>⭐⭐⭐⭐</span>
      <h4 className="customer-name">— Rohit Sharma</h4>
    </div>

    <div className="review-card">
      <p>“Caramel swirl is my new addiction 😍 The richness is just perfect.”</p>
      <span>⭐⭐⭐</span>
      <h4 className="customer-name">— Sneha Patel</h4>
    </div>

    <div className="review-card">
      <p>“Fresh flavors and perfect sweetness. Highly recommended! Every scoop tastes premium.”</p>
      <span>⭐⭐⭐⭐⭐</span>
      <h4 className="customer-name">— Arjun Mehta</h4>
    </div>


    <div className="review-card">
      <p>“Smooth, rich, and melts in the mouth — amazing quality! Truly worth every bite.”</p>
      <span>⭐⭐⭐</span>
      <h4 className="customer-name">— Daniel Joseph</h4>
    </div>

    {/* Duplicate Reviews for Infinite Loop */}
    <div className="review-card">
      <p>“Best ice cream I’ve had in years! The texture is unbelievably smooth.”</p>
      <span>⭐⭐⭐⭐⭐</span>
      <h4 className="customer-name">— Ayesha Khan</h4>
    </div>

    <div className="review-card">
      <p>“Super creamy and delicious. Loved it! I can’t stop buying this flavor.”</p>
      <span>⭐⭐⭐⭐</span>
      <h4 className="customer-name">— Rohit Sharma</h4>
    </div>

    <div className="review-card">
      <p>“Caramel swirl is my new addiction 😍 The richness is just perfect.”</p>
      <span>⭐⭐⭐</span>
      <h4 className="customer-name">— Sneha Patel</h4>
    </div>

    <div className="review-card">
      <p>“Fresh flavors and perfect sweetness. Highly recommended! Every scoop tastes premium.”</p>
      <span>⭐⭐⭐⭐⭐</span>
      <h4 className="customer-name">— Arjun Mehta</h4>
    </div>

    <div className="review-card">
      <p>“Smooth, rich, and melts in the mouth — amazing quality! Truly worth every bite.”</p>
      <span>⭐⭐⭐</span>
      <h4 className="customer-name">— Daniel Joseph</h4>
    </div>
</div>
 
</div>
      </div>
    </Layout>
  );
}

export default About;
