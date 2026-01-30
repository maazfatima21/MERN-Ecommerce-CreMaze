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
            <img src="111.jpeg" alt="Strawberry splash" />
            <h4>Strawberry splash</h4>
          </div>

          <div className="signature-card">
            <img src="112.jpg" alt="Emerald Scoop" />
            <h4>Emerald Scoop</h4>
          </div>

          <div className="signature-card">
            <img src="113.png" alt="Indigo Mist" />
            <h4>Indigo Mist</h4>
          </div>

          <div className="signature-card">
            <img src="114.png" alt="Dark Secret Scoop" />
            <h4>Dark Secret Scoop</h4>
          </div>
          
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="manifesto">
        <h2>Flavors That Stay.</h2>
        <p>
          CreMaze is where every detail matters — from the first smooth bite to the subtle interplay of flavors and textures, 
          each creation is meant to linger on your palate and in your memory.
        </p>
      </section>

      {/* FLAVOUR MAZE */}
      <section className="flavour-maze">
        <h2 className="section-title">Enter the Cre-Maze</h2>

        <div className="maze-grid">
          <div className="maze-card tall">
            <img src="/H1.jpg" alt="Crimson Rose Berry" />
          </div>

          <div className="maze-card">
            <img src="/H2.jpg" alt="Pistachio Matcha Reserve" />
          </div>

          <div className="maze-card">
            <img src="/H4.jpg" alt="Golden Fig Mascarpone" />
          </div>

          <div className="maze-card">
            <img src="/H3.jpg" alt="Salted Caramel Symphony" />
          </div>

          <div className="maze-card wide">
            <img src="/H5.jpg" alt="Midnight Cascade" />
          </div>

          <div className="maze-card wide">
            <img src="/H6.jpg" alt="Vanilla Bean Reverie" />
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
