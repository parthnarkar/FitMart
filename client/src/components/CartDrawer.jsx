// src/components/CartDrawer.jsx
import { useEffect } from "react";
import { fmt } from "../utils/formatters";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function CartDrawer({
  isOpen,
  onClose,
  cart,
  cartCount,
  cartTotal,
  updateQty,
  removeFromCart,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <div
        className={`overlay fixed inset-0 bg-black/30 z-50 ${isOpen ? "show" : ""}`}
        onClick={onClose}
      />

      <aside
        className={`cart-slide fixed right-0 top-0 h-full z-50 shadow-2xl flex flex-col
                    bg-white w-full sm:max-w-sm ${isOpen ? "open" : ""}`}
      >
        <div className="flex items-center justify-between px-5 sm:px-7 py-5 sm:py-6
                        border-b border-stone-200 flex-shrink-0">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-0.5">
              Your
            </p>
            <h2 className="font-['DM_Serif_Display'] text-xl sm:text-2xl text-stone-900">
              Cart
              {cartCount > 0 && (
                <span className="text-stone-400"> — {cartCount}</span>
              )}
            </h2>
          </div>
          <button onClick={onClose}>×</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-4">
          {cart.length === 0 ? (
            <div>Cart is empty</div>
          ) : (
            <div>
              {cart.map((item) => (
                <div key={item.id}>
                  <p>{item.name}</p>
                  <p>{fmt(item.price)}</p>
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                  <button onClick={() => updateQty(item.id, -1)}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)}>+</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div>
            <p>{fmt(cartTotal)}</p>
            <Link to="/checkout" onClick={onClose}>
              <button>Checkout</button>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;

/* ✅ PropTypes */
CartDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      qty: PropTypes.number.isRequired,
      image: PropTypes.string,
      brand: PropTypes.string,
    })
  ).isRequired,
  cartCount: PropTypes.number.isRequired,
  cartTotal: PropTypes.number.isRequired,
  updateQty: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
};