import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import "../styles/Home.css";

const slidesData = [
  {
    id: 1, title: "Hazelnut Praline Truffle",
    description: "Decadent chocolate combined with roasted hazelnut praline for a deep, crunchy, and silky indulgence.",
    image: "/H1.png",
  },
  {
    id: 2, title: "Pistachio Matcha Delight",
    description:  "Earthy matcha infused with creamy pistachio, creating a smooth, nutty, and perfectly balanced flavour.",
    image: "/H2.png",
  },
  {
    id: 3, title: "Crimson Velvet",
    description:   "A luxurious blend of red berries and velvety cream, offering a rich, smooth, and elegant taste experience.",
    image: "/H3.png",
  },
  {
    id: 4, title: "Honey Fig Mascarpone",
    description:   "Sweet honey and ripe figs blended with smooth mascarpone for a rich, creamy, and naturally indulgent scoop.",
    image: "/H4.png",
  },
  {
    id: 5, title: "The Midnight Cascade",
    description: "Intense dark chocolate layered with bold espresso notes for a powerful, late-night indulgence.",
    image: "/H5.png",
  },
];

const AUTO_SLIDE_TIME = 6000;

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    }, AUTO_SLIDE_TIME);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    startAutoSlide();
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + slidesData.length) % slidesData.length
    );
    startAutoSlide();
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    startAutoSlide();
  };

  return (
    <div className="home-container">
      <div className="home-carousel">
        {slidesData.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide slide-${slide.id} ${
              index === currentSlide ? "active" : ""
            }`}
          >
            {/* WAVE */}
            <svg
              className="wave"
              viewBox="0 0 1400 320"
              preserveAspectRatio="none"
            >
              <path
                className="wave-path"
                d=" m 0,318 h 24 c 24,0 72,0 120,-37.3 48,-37.7 20.13469,-95.71113 68.13469,-106.71113 48,-11 81.12592,33.90273 129.12592,28.20273 
                  48,-5.3 35.30163,-107.252582 91.97658,-96.48462 25.028,4.7552 47.50854,29.53697 68.07698,18.37637 34.99116,-18.98649 13.3008,-88.683394 
                  61.3008,-77.983394 28.43696,5.226617 37.81682,5.744837 54.63135,2.606646 15.77796,-2.944733 22.69649,-31.162434 46.17373,-35.712387 
                  47.99999,-5.2999996 54.39809,15.413415 104.94759,17.591599 51.4458,2.216805 84.08973,-22.2216131 97.31349,-27.4973566 4.19151,-3.02039697 
                  4.14655,-2.93529204 1.01321,-2.97013898 -7.3257,-0.08147144 -105.16076,0.0180854 -145.54574,0.0180854 h -144 -144 -144 -144 -120 -24.0000001 z "
              />
              <foreignObject x="0" y="0" width="1400" height="320">
                <div className="wave-welcome">
                  <span className="welcome-top">WELCOME TO</span>
                  <span className="welcome-brand">CREMAZE</span>
                </div>
              </foreignObject>
            </svg>

            {/* CONTENT */}
            <div className="slide-inner">
              <div className="slide-text">
                <h3 className="slide-title">{slide.title}</h3>
                <p className="slide-description">{slide.description}</p>
                <Link to="/products" className="products-link">
                    <button className="products-btn">  View Products  </button>
                </Link>
              </div>

              <div className="slide-image">
                <img src={slide.image} alt={slide.title} />
              </div>
            </div>
          </div>
        ))}

        {/* ARROWS */}
        <button className="arrow left-arrow" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="arrow right-arrow" onClick={nextSlide}>
          &#10095;
        </button>

        {/* INDICATORS */}
        <div className="carousel-indicators">
          {slidesData.map((_, index) => (
            <span
              key={index}
              className={index === currentSlide ? "active" : ""}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>


      <div className="home-after-hero">
        
    {/* BRAND INTRO */}
    <section className="home-intro">
      <h2>Luxury Ice Cream Crafted for Curious Palates</h2>
      <p>Slow-churned flavours made with premium ingredients.</p>
    </section>

    {/* SIGNATURE FLAVORS */}
    <section className="signature-flavors">
      <h2 className="section-title">Our Signature Flavors</h2>

      <div className="flavor-grid">
        <div className="flavor-card">
          <img src="111.jpeg" alt="Strawberry Splash" />
          <h3 className="pink">Strawberry Splash</h3>
        </div>

        <div className="flavor-card">
          <img src="112.jpg" alt="Emerald Scoop" />
          <h3 className="green">Emerald Scoop</h3>
        </div>

        <div className="flavor-card">
          <img src="113.png" alt="Indigo Mist" />
          <h3 className="blue">Indigo Mist</h3>
        </div>

        <div className="flavor-card">
          <img src="114.png" alt="Dark Secret Scoop" />
          <h3 className="brown">Dark Secret Scoop</h3>
        </div>
      </div>
    </section>

    {/* DISCOVERY CTA */}
    <section className="flavour-discovery">
      <h3>Your Next Favourite Scoop Awaits</h3>
      <Link to="/products">
        <button>Browse All Flavours</button>
      </Link>
    </section>

    {/* SEASONAL */}
<section className="seasonal-highlight">
  <div className="seasonal-content">
    
    {/* LEFT IMAGE */}
    <div className="seasonal-image">
      <img src="/H5.png" alt="The Midnight Cascade" />
    </div>

    {/* RIGHT TEXT */}
    <div className="seasonal-text">
      <h3>Limited Edition</h3>
      <p>
        The Midnight Cascade — bold dark chocolate with espresso notes.
      </p>
    </div>

  </div>
</section>


  </div>
</div>
  );
}

export default Home;
