// src/pages/PaymentPage.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../auth/firebase";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

function useRazorpayScript() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (window.Razorpay) { setLoaded(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setLoaded(true);
    script.onerror = () => console.error("Failed to load Razorpay script");
    document.body.appendChild(script);
    return () => { try { document.body.removeChild(script); } catch { } };
  }, []);
  return loaded;
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const rzpReady = useRazorpayScript();

  const [paying, setPaying] = useState(false);
  const [bypassing, setBypassing] = useState(false);
  const [error, setError] = useState(null);

  // Unpack state passed from Checkout (includes discount info)
  const {
    items = [],
    total = 0,
    subtotal = 0,
    discountAmt = 0,
    discountPercent = 0,
    discountApplied = false,
  } = location.state || {};

  useEffect(() => {
    if (!items.length) navigate("/checkout");
  }, [items, navigate]);

  // ── Shared post-payment cleanup ────────────────────────────────────────
  const finishOrder = async (userId, paymentId) => {
    // Clear cart
    await fetch(`${API}/api/payment/clear-cart`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId }),
    });

    // Mark discount as used if it was applied
    if (discountApplied) {
      try {
        await fetch(`${API}/api/user/use-discount`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ userId }),
        });
      } catch (err) {
        console.error("use-discount error:", err);
        // non-fatal — order still completes
      }
    }

    navigate("/payment-confirmation", {
      state: { items, total, subtotal, discountAmt, discountPercent, discountApplied, paymentId },
    });
  };

  // ── Demo bypass ────────────────────────────────────────────────────────
  const handleDemoSuccess = async () => {
    const user = auth.currentUser;
    if (!user) { navigate("/auth"); return; }
    setBypassing(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/payment/demo-success`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: user.uid }),
      });
      if (!res.ok) throw new Error("Demo order failed");
      const data = await res.json();
      await finishOrder(user.uid, data.paymentId);
    } catch (err) {
      setError(err.message);
      setBypassing(false);
    }
  };

  // ── Real Razorpay flow ─────────────────────────────────────────────────
  const handlePay = async () => {
    if (!rzpReady) { setError("Payment SDK not loaded. Please refresh."); return; }
    const user = auth.currentUser;
    if (!user) { navigate("/auth"); return; }
    const userId = user.uid;
    setPaying(true);
    setError(null);

    try {
      const orderRes = await fetch(`${API}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amount: total, currency: "INR", userId }),
      });
      if (!orderRes.ok) {
        const e = await orderRes.json().catch(() => ({}));
        throw new Error(e.error || "Could not create order");
      }
      const order = await orderRes.json();

      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "FitMart",
        description: `Order #${order.id}`,
        order_id: order.id,
        prefill: { name: user.displayName || "", email: user.email || "" },
        theme: { color: "#1c1917" },

        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${API}/api/payment/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ ...response, userId }),
            });
            if (!verifyRes.ok) throw new Error("Payment verification failed");
            await finishOrder(userId, response.razorpay_payment_id);
          } catch (err) {
            setError(err.message);
            setPaying(false);
          }
        },

        modal: {
          ondismiss: () => {
            setPaying(false);
            setError("Payment was cancelled. Use the button below to simulate success.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp) => {
        setPaying(false);
        setError(`Payment failed: ${resp.error?.description || "Unknown error"}`);
      });
      rzp.open();

    } catch (err) {
      setError(err.message);
      setPaying(false);
    }
  };

  const busy = paying || bypassing;

  const fmt = (n) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');`}</style>

      <div className="max-w-xl mx-auto px-5 py-16">
        <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-3">Checkout</p>
        <h1
          style={{ fontFamily: "'DM Serif Display', serif" }}
          className="text-4xl text-stone-900 mb-10"
        >
          Payment
        </h1>

        {/* Order summary */}
        <div className="bg-white border border-stone-200 rounded-2xl p-7 mb-5
                        hover:border-stone-300 transition-all duration-300">
          <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-4">
            Order Summary
          </p>
          <div className="space-y-3 mb-5">
            {items.map(({ product, quantity }) => (
              <div key={product.productId} className="flex items-center gap-3">
                <img
                  src={product.image} alt={product.name}
                  className="w-10 h-10 object-cover rounded-lg bg-stone-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-stone-900 truncate">{product.name}</p>
                  <p className="text-xs text-stone-400">Qty {quantity}</p>
                </div>
                <p className="text-sm text-stone-900 flex-shrink-0">
                  {fmt(product.price * quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="h-px bg-stone-200 mb-4" />

          <div className="space-y-2">
            {subtotal !== total && (
              <div className="flex justify-between text-sm text-stone-500">
                <span>Subtotal</span>
                <span>{fmt(subtotal)}</span>
              </div>
            )}
            {discountApplied && (
              <div className="flex justify-between text-sm text-stone-500">
                <span>Welcome {discountPercent}% off</span>
                <span>−{fmt(discountAmt)}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm text-stone-500">Total payable</span>
              <span
                style={{ fontFamily: "'DM Serif Display', serif" }}
                className="text-3xl text-stone-900"
              >
                {fmt(total)}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4 mb-5">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handlePay}
          disabled={busy || !rzpReady}
          className="w-full bg-stone-900 text-white text-sm px-8 py-3.5 rounded-full
                     hover:bg-stone-700 transition-colors disabled:opacity-50
                     disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {paying ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Opening payment…
            </>
          ) : `Pay ${fmt(total)} →`}
        </button>

        <p className="text-xs text-stone-400 text-center mt-4">
          100% secure · powered by Razorpay
        </p>

        {/* Demo bypass */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-[10px] tracking-[0.15em] uppercase text-stone-400">
              Demo / Testing
            </span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>
          <button
            onClick={handleDemoSuccess}
            disabled={busy}
            className="w-full border border-stone-300 text-stone-600 text-sm px-8 py-3.5
                       rounded-full hover:bg-stone-900 hover:text-white hover:border-stone-900
                       transition-all disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
          >
            {bypassing ? (
              <>
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Processing…
              </>
            ) : "Simulate Successful Payment ✓"}
          </button>
          <p className="text-[10px] text-stone-400 text-center mt-2">
            Skips Razorpay · clears cart · goes to confirmation
          </p>
        </div>

        <button
          onClick={() => navigate("/checkout")}
          className="w-full mt-4 border border-stone-200 text-stone-400 text-sm
                     px-8 py-3 rounded-full hover:bg-stone-100 transition-colors"
        >
          ← Back to cart
        </button>
      </div>
    </div>
  );
}