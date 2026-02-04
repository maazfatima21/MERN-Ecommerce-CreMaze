import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import "../styles/Navbar.css";

function Navbar() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;
  const { setSearch } = useContext(ProductContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [adminOpen, setAdminOpen] = useState(false);

  const closeAdminMenu = () => setAdminOpen(false);

const handleAdminKeyDown = (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    setAdminOpen((prev) => !prev);
  }

  if (e.key === "Escape") {
    closeAdminMenu();
  }
};

  const navigate = useNavigate();

  /* ---------------- CART COUNT ---------------- */
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

  /* ---------------- UNREAD ADMIN MESSAGES ---------------- */
 useEffect(() => {
  if (!isAdmin) return;

  const fetchUnreadMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(
        "http://localhost:5000/api/contact/unread-count",
        {
          headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUnreadMessages(data.count || 0);
    } catch (err) {
      console.error("Unread messages error", err);
    }
  };

  fetchUnreadMessages();

  const interval = setInterval(fetchUnreadMessages, 15000);
  window.addEventListener("messagesUpdated", fetchUnreadMessages);

  return () => {
    clearInterval(interval);
    window.removeEventListener("messagesUpdated", fetchUnreadMessages);
  };
}, [isAdmin]);


  /* ---------------- RESPONSIVE ---------------- */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearch(searchQuery);

    navigate("/products");
    setSidebarOpen(false);
  };

  const handleUserClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/profile");
    }
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setSidebarOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav>
        <img src="/logo1.png" alt="CreMaze Logo" className="logo" />

        <div className="hamburger" onClick={(e) => {e.stopPropagation();  setSidebarOpen(true);  }}>
          <img src="/Menu.png" alt="Menu" className="hamburger-image" />
        </div>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Delights</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>

          {isLoggedIn && <Link to="/my-orders">Orders</Link>}

          {isAdmin && (
          <div
            className="admin-menu"
            onMouseEnter={() => setAdminOpen(true)}
            onMouseLeave={() => setAdminOpen(false)}
          >
            <button className="admin-trigger" type="button" aria-haspopup="true" 
              aria-expanded={adminOpen} tabIndex="0" onKeyDown={handleAdminKeyDown}>
              Admin ▾
            </button>


            {adminOpen && (
              <div
                className="admin-dropdown"
                role="menu"
                onKeyDown={(e) => {
                  if (e.key === "Escape") closeAdminMenu();
                }}
              >
                <Link to="/add-product" role="menuitem" tabIndex="0">
                  + Add Item
                </Link>

                <Link to="/admin/orders" role="menuitem" tabIndex="0">
                  Manage Orders
                </Link>

                <Link to="/admin/messages" role="menuitem" tabIndex="0">
                  Messages
                  {unreadMessages > 0 && (
                    <span className="badge">{unreadMessages}</span>
                  )}
                </Link>
              </div>
            )}

          </div>
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
            <button type="submit"><FaSearch /></button>
          </form>
        </div>

        <div className="nav-icons">
          <div className="cart-icon-wrapper" onClick={() => navigate("/cart")}>
            <FaShoppingCart className="icon" />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </div>

          <FaUser className="icon" onClick={handleUserClick} />

          {isLoggedIn && (
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          )}
        </div>
      </nav>

      {/* ================= SIDEBAR ================= */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}
         onClick={(e) => e.stopPropagation()}>

        <form className="sidebar-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit"><FaSearch /></button>
        </form>

        <div className="sidebar-links">
          <Link to="/" onClick={() => setSidebarOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setSidebarOpen(false)}>Delights</Link>
          <Link to="/about" onClick={() => setSidebarOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setSidebarOpen(false)}>Contact</Link>

          {isLoggedIn && (
            <Link to="/my-orders" onClick={() => setSidebarOpen(false)}>Orders</Link>
          )}

          {isAdmin && (
            <>
              <Link to="/add-product" onClick={() => setSidebarOpen(false)}>+ Item</Link>
              <Link to="/admin/orders" onClick={() => setSidebarOpen(false)}>Manage</Link>

              <Link to="/admin/messages" onClick={() => setSidebarOpen(false)}>
                Messages
                {unreadMessages > 0 && (
                  <span className="badge">{unreadMessages}</span>
                )}
              </Link>
            </>
          )}
        </div>

        <div className="sidebar-icons">
          <FaUser className="sidebar-icon" onClick={handleUserClick} />
          <div className="sidebar-cart-icon" onClick={() => { navigate("/cart"); setSidebarOpen(false); }}>
            <FaShoppingCart className="sidebar-icon" />
            {cartCount > 0 && (
              <span className="sidebar-cart-badge">{cartCount}</span>
            )}
          </div>
        </div>

        {isLoggedIn && (
          <div className="sidebar-logout-wrapper">
            <button className="sidebar-logout" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </>
  );
}

export default Navbar;
