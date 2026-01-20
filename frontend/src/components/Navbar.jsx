import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';
import '../styles/Navbar.css';

function Navbar() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;

  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.reduce((sum, item) => sum + (item.qty || 1), 0));
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    setSidebarOpen(false);
  };

  const handleUserClick = () => {
    navigate(isLoggedIn ? '/profile' : '/login');
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('token'); // clear token too
    setSidebarOpen(false);
    navigate('/login');
    window.location.reload();
  };

  return (
    <>
      <nav>
        <img src="/logo1.png" alt="CreMaze Logo" className="logo" />
        <div
          className="hamburger"
          onClick={() => setSidebarOpen(prev => !prev)}
        >
          <img src="/Menu.png" alt="Menu" className="hamburger-image" />
        </div>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Delights</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
          {isAdmin && (
            <Link to="/add-product" className="admin-link">
              Add Product
            </Link>
          )}
        </div>

        <div className="nav-search">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <FaSearch />
            </button>
          </form>
        </div>

        <div className="nav-icons">
          <div
            className="cart-icon-wrapper"
            onClick={() => navigate('/cart')}
          >
            <FaShoppingCart className="icon" />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </div>

          <FaUser className="icon" onClick={handleUserClick} />

          {isLoggedIn && (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </nav>

      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <form className="sidebar-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <FaSearch />
          </button>
        </form>

        <div className="sidebar-icons">
          <div
            className="cart-icon-wrapper"
            onClick={() => {
              navigate('/cart');
              setSidebarOpen(false);
            }}
          >
            <FaShoppingCart className="icon" />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </div>

          <FaUser className="icon" onClick={handleUserClick} />
        </div>

        <div className="sidebar-links">
          <Link to="/" onClick={() => setSidebarOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setSidebarOpen(false)}>Delights</Link>
          <Link to="/about" onClick={() => setSidebarOpen(false)}>About Us</Link>
          <Link to="/contact" onClick={() => setSidebarOpen(false)}>Contact Us</Link>
        </div>

        <div className="sidebar-logout-wrapper">
          <button className="sidebar-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>

      </div>
    </>
  );
}

export default Navbar;
