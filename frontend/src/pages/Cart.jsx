import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/Cart.css";

/* ================= TOAST COMPONENT ================= */
const Toast = ({ message, type = "success" }) => {
  if (!message) return null;
  return <div className={`toast ${type}`}>{message}</div>;
};

/* ================= CART ITEM ================= */
const CartItem = ({ item, onQtyChange, onRemove }) => {
  const BASE_URL = "http://localhost:5000";

  return (
    <div className="cart-item">
      <img
        src={`${BASE_URL}/uploads/${item.image}`}
        alt={item.name}
        onError={(e) => (e.target.src = "/placeholder.png")}
      />
      <div className="cart-item-info">
        <h3>{item.name}</h3>
        <p className="item-price">₹{item.price}</p>
        <p className="item-subtotal">Subtotal: ₹{item.price * item.qty}</p>

        <div className="qty-control">
          <button
            disabled={item.qty === 1}
            onClick={() => onQtyChange(item._id, item.qty - 1)}
          >
            −
          </button>
          <input
            type="number"
            min="1"
            max={item.stock || 10}
            value={item.qty}
            onChange={(e) =>
              onQtyChange(
                item._id,
                Math.min(Math.max(1, Number(e.target.value)), item.stock || 10)
              )
            }
          />
          <button
            disabled={item.qty >= (item.stock || 10)}
            onClick={() => onQtyChange(item._id, item.qty + 1)}
          >
            +
          </button>
        </div>

        <button className="remove-btn" onClick={() => onRemove(item._id)}>
          Remove
        </button>
      </div>
    </div>
  );
};

/* ================= MAIN CART PAGE ================= */
function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (showConfirm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showConfirm]);

  /* ========== LOAD CART ========== */
  useEffect(() => {
    const timer = setTimeout(() => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      
      // Check if there are reorder items and merge them
      const reorderItems = localStorage.getItem("reorderItems");
      if (reorderItems) {
        const reordered = JSON.parse(reorderItems);
        // Clear the reorderItems after reading
        localStorage.removeItem("reorderItems");
        // Set the reordered items as the new cart
        cart = reordered;
      }
      
      setCartItems(cart);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  /* ========== TOAST HANDLER ========== */
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  };

  /* ========== QUANTITY CHANGE ========== */
  const handleQuantityChange = (id, qty) => {
    const item = cartItems.find((i) => i._id === id);
    const stock = item?.stock || 10;

    if (qty > stock) {
      showToast(`Only ${stock} items in stock`, "error");
      return;
    }
    if (qty < 1) return;

    const updatedCart = cartItems.map((i) => (i._id === id ? { ...i, qty } : i));
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  /* ========== REMOVE ITEM ========== */
  const handleRemove = (id) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    showToast("Item removed from cart", "error");
  };

  /* ========== CLEAR CART ========== */
  const handleClearCart = () => {
    setShowConfirm(true);
  };

  const confirmClearCart = () => {
    localStorage.removeItem("cart");
    setCartItems([]);
    showToast("Cart cleared", "error");
    setShowConfirm(false);
  };

  const cancelClearCart = () => {
    setShowConfirm(false);
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="cart-page">
        <h1>Your Cart</h1>
        <p className="cart-tagline">
          Almost there — review your items before checkout ✨
        </p>
        <div className="cart-skeleton">
          {[1, 2].map((i) => (
            <div key={i} className="skeleton-item">
              <div className="skeleton-img"></div>
              <div className="skeleton-lines">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ================= PAGE ================= */
  return (
    <Layout>
      <div className="cart-page">
        {toast && <Toast message={toast.message} type={toast.type} />}

        {cartItems.length === 0 ? (
          <div className="cremaze-empty-cart">
            <div className="empty-cart-wrapper">
              <div className="empty-cart-illustration">
                <img src="/Emptycart 1.png" alt="Empty Cart" />
              </div>

              <h1>Your Cart</h1>
              <p className="cart-tagline">
                Your Cart feels a bit empty..  Time for a sweet Scoop!
              </p>

              <Link to="/products" className="empty-cart-btn">
                Explore Flavours
              </Link>

            </div>
          </div>
        ) : (
          <>
            <h1>Your Cart</h1>
            <p className="cart-tagline">
              Almost there — review your items before checkout ✨
            </p>

            <div className="cart-content">
              <div className="cart-items">
                {cartItems.map((item) => (
                  <CartItem
                    key={item._id}
                    item={item}
                    onQtyChange={handleQuantityChange}
                    onRemove={handleRemove}
                  />
                ))}
              </div>

              <aside className="cart-summary">
                <div className="summary-details">
                  <p>Items: {cartItems.length}</p>
                  <p>
                    Delivery: <span className="free">Free</span>
                  </p>
                  <h2>Total: ₹{totalPrice}</h2>
                </div>

                <button
                  className="checkout-btn"
                  onClick={() => navigate("/checkout")}> 
                  Checkout
                </button>

                <p className="checkout-info">
                  🔒 Secure checkout · 🧾 Order summary next
                </p>

                <button className="clear-cart-btn" onClick={handleClearCart}>
                  Clear Cart
                </button>
              </aside>
            </div>
          </>
        )}
      </div>

      {showConfirm && (
      <div className="confirm-modal-backdrop" onClick={cancelClearCart}>
        <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
          <h2>Clear Cart?</h2>
          <p>
            Are you sure you want to remove all items from your cart?
          </p>

          <div className="confirm-modal-buttons">
            <button className="cancel-btn" onClick={cancelClearCart}>
              Cancel
            </button>
            <button className="confirm-btn" onClick={confirmClearCart}>
              Yes, Clear
            </button>
            
          </div>
        </div>
      </div>
    )}

    </Layout>
  );
}

export default Cart;
