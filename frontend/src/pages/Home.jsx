import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* HERO SECTION */}
      <div className="home-container">
      <section className="hero">
        <div className="hero-left">
          <span className="brand-tag">CREMAZE</span>
          <h1>
            Taste Elevated <br /> Moments Remembered
          </h1>
          <p>
            An experience you don’t rush. A flavor you don’t forget. — Every scoop, a masterpiece of indulgence.
          </p>

          <div className="hero-actions">
            <button className="primary-btn" onClick={() => navigate("/products")}>
              Explore Flavours
            </button>
            <button className="secondary-btn" onClick={() => navigate("/about")}>
              Our Story
            </button>
          </div>
        </div>

        <div className="hero-right">
          <img src="Home.png" alt="CreMaze Signature Creation" />
        </div>
      </section>


      {/* SIGNATURE FLAVOURS */}
      <section className="signature">
        <h2>Signature Flavors</h2>
        <p className="signature-sub">
          These creations define who we are — composed, expressive, unmistakable.
        </p>

        <div className="signature-grid">
        <div className="signature-card">
          <img src="111.jpeg" alt="Strawberry Splash" />
          <div className="signature-overlay">
            <h4>Strawberry Splash</h4>
            <span>Bright · Silken</span>
          </div>
        </div>

        <div className="signature-card">
          <img src="112.jpg" alt="Emerald Scoop" />
          <div className="signature-overlay">
            <h4>Emerald Scoop</h4>
            <span>Herbal · Calm</span>
          </div>
        </div>

        <div className="signature-card">
          <img src="113.png" alt="Indigo Mist" />
          <div className="signature-overlay">
            <h4>Indigo Mist</h4>
            <span>Floral · Velvet</span>
          </div>
        </div>

        <div className="signature-card">
          <img src="114.png" alt="Dark Secret Scoop" />
          <div className="signature-overlay">
            <h4>Dark Secret</h4>
            <span>Deep · Decadent</span>
          </div>
        </div>
          
        </div>
      </section>

      {/* FLAVOUR MAZE */}
      <section className="flavour-maze">
        <h1 className="section-maze">Flavors That Stay.</h1>
        <p>
          CreMaze is where every detail matters — from the first smooth bite to the subtle interplay of flavors and textures, 
          each creation is meant to linger on your palate and in your memory.
        </p>

      {/* FLAVOUR MAZE */}
        <h2 className="section-title">Enter the Cre-Maze</h2>

        <div className="maze-grid">
          <div className="maze-card tall">
            <img src="/H1.jpg" alt="Exquisite" />
            <div className="maze-text">
              <h4>Exquisite</h4>              
            </div>
          </div>

          <div className="maze-card">
            <img src="/H2.jpg" alt="Botanical" />
            <div className="maze-text">
              <h4>Botanical</h4>              
            </div>
          </div>

          <div className="maze-card">
            <img src="/H4.jpg" alt="Pure Bliss" />
            <div className="maze-text">
              <h4>Pure Bliss</h4>
            </div>
          </div>

          <div className="maze-card">
            <img src="/H3.jpg" alt="Unforgettable Moments" />
            <div className="maze-text">
              <h4>Unforgettable Moments</h4>              
            </div>
          </div>

          <div className="maze-card wide">
            <img src="/H5.jpg" alt="Legacy" />
            <div className="maze-text">
              <h4>Legacy</h4>
            </div>
          </div>

          <div className="maze-card wide">
            <img src="/H6.jpg" alt="Perfection" />
            <div className="maze-text">
              <h4>Perfection</h4>              
            </div>
          </div>
        </div>
      </section>    

      {/* STATEMENT */}
      <section className="statement">
        <div className="statement-box">
          <h2>Moments That Last</h2>
          <p>
            Time is our ingredient. Balance is our signature.
            What remains is a moment you carry with you.
          </p>
          <button className="secondary-btn light" onClick={() => navigate("/about")}>
            Discover CreMaze
          </button>
        </div>
      </section>
      </div>
    </Layout>
  );
};

export default Home;
