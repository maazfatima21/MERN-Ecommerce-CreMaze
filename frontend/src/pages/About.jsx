import React from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import "../styles/About.css";

const About = () => {
  return (
    <Layout>
      <div className="about-page">

        {/* HERO */}
        <section className="about-hero">
          <div className="about-hero-content">
            <p className="about-tag">OUR STORY</p>
            <h1>
              Crafted Slowly,<br />Remembered Always.
            </h1>
            <p>
              Step into a realm of rich flavors and pure delight. Every bite sparks a moment of joy. 
              Experience a world where each creation is a celebration of taste.
            </p>
          </div>
        </section>

        <div className="about-divider" />

        {/* CRAFT CAROUSEL */}
        <section className="about-carousel">
          <div className="about-carousel-container">
            <h2>The Beginning</h2>
            <p>
              CreMaze was born from a desire to slow things down. In a world of
              instant indulgence, we chose patience — believing that time is the
              most important ingredient of all.
            </p>
            <p className="origin-line">
              Intention over trends. Taste beyond time.
            </p>
          </div>

          <div className="about-carousel-track">
            <div className="about-carousel-slide">
            <img src="ice1.png" alt="ice cream" loading="lazy" />
            <img src="ice2.png" alt="ice cream" loading="lazy" />
            <img src="ice3.png" alt="ice cream" loading="lazy" />
            <img src="ice4.png" alt="ice cream" loading="lazy" />
            <img src="ice5.png" alt="ice cream" loading="lazy" />
            <img src="ice6.png" alt="ice cream" loading="lazy" />

            <img src="ice1.png" alt="ice cream" loading="lazy" />
            <img src="ice2.png" alt="ice cream" loading="lazy" />
            <img src="ice3.png" alt="ice cream" loading="lazy" />
            <img src="ice4.png" alt="ice cream" loading="lazy" />
            <img src="ice5.png" alt="ice cream" loading="lazy" />
            <img src="ice6.png" alt="ice cream" loading="lazy" />
            </div>
          </div>
        </section>

        <div className="about-divider" />

        {/* PHILOSOPHY */}
        <section className="about-philosophy">
          <div className="about-container">
            <h2>Our Philosophy</h2>

            <div className="philosophy-grid">
              <div className="philosophy-card">
                <h4>Art in Every Bite</h4>
                <p>
                  We transform ingredients into edible masterpieces, where flavor meets finesse.
                </p>
              </div>

              <div className="philosophy-card">
                <h4>Sourced with Integrity</h4>
                <p>
                  Only the finest, ethically chosen ingredients make it into our creations.
                </p>
              </div>

              <div className="philosophy-card">
                <h4>Crafted with Heart</h4>
                <p>
                  Each dessert is a labor of love, from concept to presentation.
                </p>
              </div>

              <div className="philosophy-card">
                <h4>Excellence, Always</h4>
                <p>
                  No shortcuts, no compromises—just unforgettable taste in every scoop.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MAKERS */}
        <section className="about-makers">
          <div className="about-container">
            <h2>The Makers Behind CreMaze</h2>
            <p className="makers-intro">
              At CreMaze, dessert is craft—each creation shaped by artisans, not assembly lines.
            </p>

            <div className="makers-grid">
              <div className="maker-card">
                <img src="/M1.png" alt="image" loading="lazy" />
                <h4>Flavor Curator</h4>
                <span>Vision · Direction · Taste</span>
              </div>

              <div className="maker-card">
                <img src="/M2.png" alt="image" loading="lazy" />
                <h4>Master Artisan</h4>
                <span>Texture · Technique · Precision</span>
              </div>

              <div className="maker-card">
                <img src="/M3.png" alt="image" loading="lazy" />
                <h4>Ingredient Specialist</h4>
                <span>Sourcing · Integrity</span>
              </div>
            </div>
          </div>
        </section>

      <div className="about-divider" />
      
        {/* EXPERIENCE + VALUES */}
        <section className="about-experience">
          <div className="about-container narrow experience-intro">
            <h2>The CreMaze Experience</h2>
            <p>
              Every scoop is designed to unfold — first impression,
              middle note, and a finish that stays with you long after.
            </p>
            <p>
              This is indulgence without urgency. Dessert, at its most refined.
            </p>
          </div>

          <div className="experience-values">
            <div className="values-grid">
              <div className="value-card">
                <h3>Craft Over Scale</h3>
                <p>
                  We create in limited quantities, ensuring every batch
                  meets our uncompromising standards.
                </p>
              </div>

              <div className="value-card">
                <h3>Respect for Ingredients</h3>
                <p>
                  Real cream. Real fruit. No unnecessary additions.
                </p>
              </div>

              <div className="value-card">
                <h3>Designed for Moments</h3>
                <p>
                  CreMaze is meant to be savored — not rushed.
                </p>
              </div>
            </div>
          </div>
        </section>


  {/* CLOSING */}
        <section className="about-closing">
          <h2>Where Flavor Meets Art.</h2>
          <p>
            Crafted to delight, made to be remembered. Every scoop is a journey of flavor, designed to spark joy in every moment.
          </p>

          {/* Optional ultra-soft CTA */}
          <Link to="/products" className="about-cta">
            Explore Our Flavors
          </Link>
        </section>

        {/* SIGNATURE */}
        <section className="about-signature">
          <div className="about-container narrow">
            <p className="signature-text">
              “CreMaze is our idea of indulgence done right.
              Nothing more. Nothing less.”
            </p>
            <span className="signature-author">— Founder, CreMaze</span>
          </div>
        </section>

       

      </div>
    </Layout>
  );
};

export default About;
