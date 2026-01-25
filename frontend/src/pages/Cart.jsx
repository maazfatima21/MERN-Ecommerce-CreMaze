import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Cart.css";

// ================= TOAST COMPONENT =================
const Toast = ({ message, type }) => {
  if (!message) return null;
  return <div className={`toast ${type}`}>{message}</div>;
};

// ================= CART ITEM COMPONENT =================
const CartItem = ({ item, onQtyChange, onRemove }) => {
  return (
    <div className="cart-item">
      <img
        src={`http://localhost:5000/uploads/${item.image}`}
        alt={item.name}
      />
      <div className="cart-item-info">
        <h3>{item.name}</h3>
        <p className="item-price">₹{item.price}</p>
        <p className="item-subtotal">Subtotal: ₹{item.price * item.qty}</p>

        <div className="qty-control">
          <button
            aria-label="Decrease quantity"
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
              onQtyChange(item._id, Math.min(Math.max(1, e.target.value), item.stock || 10))
            }
          />
          <button
            aria-label="Increase quantity"
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

// ================= MAIN CART COMPONENT =================
function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage
  useEffect(() => {
    setTimeout(() => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(cart);
      setLoading(false);
    }, 700);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(""), 2000);
  };

  const handleQuantityChange = (id, qty) => {
    const item = cartItems.find((i) => i._id === id);
    const stock = item?.stock || 10;

    if (qty > stock) {
      showToast(`Only ${stock} items in stock`, "error");
      return;
    }

    if (qty < 1) return;

    const updatedCart = cartItems.map((i) =>
      i._id === id ? { ...i, qty } : i
    );

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemove = (id) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    showToast("Item removed from cart", "error");
  };

  const handleClearCart = () => {
    localStorage.removeItem("cart");
    setCartItems([]);
    showToast("Cart cleared", "error");
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  /* ================= SKELETON LOADER ================= */
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

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <p className="cart-tagline">
        Almost there — review your items before checkout ✨
      </p>

      {toast && <Toast message={toast.message || toast} type={toast.type} />}

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Uh-oh! Your cone is empty 🍦</h2>
          <p>
            Looks like you haven’t picked any sweet delights yet. Let’s fix
            that!
          </p>
          <div className="empty-cart-buttons">
            <Link to="/products" className="shop-btn">
              Browse Flavors
            </Link>
          </div>
        </div>
      ) : (
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
              disabled={cartItems.length === 0}
              onClick={() => navigate("/checkout")}
            >
              Checkout
            </button>

            <p className="checkout-info">
              🔒 Secure checkout · 💳 Easy payments
            </p>

            <button className="clear-cart-btn" onClick={handleClearCart}>
              Clear Cart
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Cart;
