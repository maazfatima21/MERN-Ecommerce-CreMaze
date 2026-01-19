import React, { useState, useEffect } from "react";
import "../styles/Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
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

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {toast && <div className="toast">{toast}</div>}

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item._id} className="cart-item">
              <img
                src={`http://localhost:5000/uploads/${item.image}`}
                alt={item.name}
              />

              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>

                {/* PLUS / MINUS */}
                <div className="qty-control">
                  <button
                    disabled={item.qty === 1}
                    onClick={() =>
                      handleQuantityChange(item._id, item.qty - 1, item.stock || 10)
                    }
                  >
                    −
                  </button>

                  <span className="qty-animate">{item.qty}</span>

                  <button
                    onClick={() =>
                      handleQuantityChange(item._id, item.qty + 1, item.stock || 10)
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

          <div className="cart-total">
            <h2>Total: ₹{totalPrice}</h2>
            <button className="checkout-btn">Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
