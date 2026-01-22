import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/Cart.css";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(cart);
      setLoading(false);
    }, 700);
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  const handleQuantityChange = (id, qty, stock = 10) => {
    if (qty > stock) {
      showToast(`Only ${stock} items in stock`);
      return;
    }
    if (qty < 1) return;

    const updatedCart = cartItems.map(item =>
      item._id === id ? { ...item, qty } : item
    );

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemove = (id) => {
    const updatedCart = cartItems.filter(item => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    showToast("Item removed from cart");
  };

  const handleClearCart = () => {
    localStorage.removeItem("cart");
    setCartItems([]);
    showToast("Cart cleared");
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
          {[1, 2].map(i => (
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

      {toast && <div className="toast">{toast}</div>}

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <img src="/empty-cart.png" alt="Empty cart" />
          <p>Your cart is empty</p>
          <Link to="/products" className="shop-btn">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <img
                  src={`http://localhost:5000/uploads/${item.image}`}
                  alt={item.name}
                />

                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p className="item-price">₹{item.price}</p>

                  <p className="item-subtotal">
                    Subtotal: ₹{item.price * item.qty}
                  </p>

                  {/* QUANTITY CONTROLS */}
                  <div className="qty-control">
                    <button
                      disabled={item.qty === 1}
                      onClick={() =>
                        handleQuantityChange(
                          item._id,
                          item.qty - 1,
                          item.stock || 10
                        )
                      }
                    >
                      −
                    </button>

                    <span className="qty-animate">{item.qty}</span>

                    <button
                      disabled={item.qty >= (item.stock || 10)}
                      onClick={() =>
                        handleQuantityChange(
                          item._id,
                          item.qty + 1,
                          item.stock || 10
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ORDER SUMMARY */}
          <div className="cart-summary">
            <div className="summary-details">
              <p>Items: {cartItems.length}</p>
              <p>
                Delivery: <span className="free">Free</span>
              </p>
              <h2>Total: ₹{totalPrice}</h2>
            </div>

            <button  className="checkout-btn"  
              disabled={cartItems.length === 0}
              onClick={() => navigate("/checkout")}>
              Checkout
            </button>


            <p className="checkout-info">
              🔒 Secure checkout · 🚚 Fast delivery · 💳 Easy payments
            </p>

            <button className="clear-cart-btn" onClick={handleClearCart}>
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
