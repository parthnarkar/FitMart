// src/pages/Checkout.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../auth/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { fmt } from "../utils/formatters";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Checkout() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [discountEligible, setDiscountEligible] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(10);

  useEffect(() => { document.title = "My Cart - FitMart"; }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) { navigate("/auth"); return; }
      const userId = user.uid;

      try {
        // Fetch cart, products, and discount status in parallel
        const [cartRes, prodRes, discountRes] = await Promise.all([
          fetch(`${API}/api/cart/${userId}`, { credentials: "include" }),
          fetch(`${API}/api/products`, { credentials: "include" }),
          fetch(`${API}/api/user/discount-status/${userId}`, { credentials: "include" }),
        ]);

        if (!cartRes.ok) throw new Error("Failed to fetch cart");
        if (!prodRes.ok) throw new Error("Failed to fetch products");

        const cart = await cartRes.json();
        const products = await prodRes.json();

        if (discountRes.ok) {
          const d = await discountRes.json();
          setDiscountEligible(d.eligible);
          setDiscountPercent(d.discountPercent ?? 10);
        }

        if (!cart.items?.length) { setItems([]); setLoading(false); return; }

        const productMap = Object.fromEntries(products.map(p => [p.productId, p]));
        const enriched = cart.items
          .map(item => ({ ...item, product: productMap[item.productId] }))
          .filter(item => item.product);

        setItems(enriched);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // ── Totals ─────────────────────────────────────────────────────────────
  const subtotal = items.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
  const discountAmt = discountEligible ? Math.round(subtotal * discountPercent / 100) : 0;
  const total = subtotal - discountAmt;

  const handleProceed = () => {
    navigate("/payment", {
      state: {
        items,
        total,
        subtotal,
        discountAmt,
        discountPercent: discountEligible ? discountPercent : 0,
        discountApplied: discountEligible,
      },
    });
  };

  if (loading) return <PageShell><Spinner /></PageShell>;
  if (error) return <PageShell><ErrorMsg msg={error} /></PageShell>;
  if (!items.length) return <PageShell><EmptyCart navigate={navigate} /></PageShell>;

  return (
    <PageShell>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');`}</style>

      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-16">
        <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-3">Review</p>
        <h1
          style={{ fontFamily: "'DM Serif Display', serif" }}
          className="text-4xl text-stone-900 mb-10"
        >
          Your Order
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Product list ───────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div
                key={product.productId}
                className="bg-white border border-stone-200 rounded-2xl p-6 flex gap-5
                           hover:border-stone-300 hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-xl flex-shrink-0 bg-stone-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] tracking-[0.15em] uppercase text-stone-400 mb-1">
                    {product.brand}
                  </p>
                  <h3
                    style={{ fontFamily: "'DM Serif Display', serif" }}
                    className="text-xl text-stone-900 leading-tight mb-2 truncate"
                  >
                    {product.name}
                  </h3>
                  {product.badge && (
                    <span className="text-[10px] tracking-widest uppercase bg-stone-900
                                     text-white px-2.5 py-1 rounded-full">
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-stone-400 mb-1">Qty {quantity}</p>
                  <p
                    style={{ fontFamily: "'DM Serif Display', serif" }}
                    className="text-2xl text-stone-900"
                  >
                    {fmt(product.price * quantity)}
                  </p>
                  {product.originalPrice > product.price && (
                    <p className="text-xs text-stone-400 line-through">
                      {fmt(product.originalPrice * quantity)}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Welcome discount callout */}
            {discountEligible && (
              <div className="bg-stone-100 border border-stone-200 rounded-2xl px-6 py-4
                              flex items-center gap-4">
                <span className="text-stone-900 text-lg flex-shrink-0">✓</span>
                <div>
                  <p className="text-sm font-medium text-stone-900">
                    Welcome discount applied
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {discountPercent}% off your first order — saving you {fmt(discountAmt)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Order summary sidebar ──────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-stone-900 rounded-2xl p-8 sticky top-8">
              <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-6">
                Summary
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-stone-300">
                  <span>Subtotal ({items.length} item{items.length > 1 ? "s" : ""})</span>
                  <span>{fmt(subtotal)}</span>
                </div>

                {discountEligible && (
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-400">
                      Welcome {discountPercent}% off
                    </span>
                    <span className="text-stone-300">−{fmt(discountAmt)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm text-stone-300">
                  <span>Shipping</span>
                  <span className="text-stone-400">Free</span>
                </div>
                <div className="h-px bg-stone-700 my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white font-medium">Total</span>
                  <span
                    style={{ fontFamily: "'DM Serif Display', serif" }}
                    className="text-3xl text-white"
                  >
                    {fmt(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceed}
                className="w-full bg-white text-stone-900 text-sm px-8 py-3.5 rounded-full
                           hover:bg-stone-100 transition-colors font-medium"
              >
                Proceed to Payment →
              </button>
              <p className="text-xs text-stone-500 text-center mt-4">
                Secured by Razorpay
              </p>
            </div>
          </div>

        </div>
      </div>
    </PageShell>
  );
}

function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {children}
    </div>
  );
}
function Spinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
function ErrorMsg({ msg }) {
  return (
    <div className="max-w-md mx-auto mt-24 bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
      <p className="text-red-600 text-sm">{msg}</p>
    </div>
  );
}
function EmptyCart({ navigate }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center gap-4">
      <p className="text-4xl text-stone-300">∅</p>
      <p className="text-stone-500 text-sm">Your cart is empty</p>
      <button
        onClick={() => navigate("/home")}
        className="bg-stone-900 text-white text-sm px-8 py-3 rounded-full hover:bg-stone-700 transition-colors"
      >
        Continue Shopping
      </button>
    </div>
  );
}