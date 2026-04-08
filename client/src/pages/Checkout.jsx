// src/pages/Checkout.jsx
import { normalizeProduct } from "../utils/productAdapter";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../auth/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { fmt } from "../utils/formatters";
import { getAuthHeaders } from "../utils/getAuthHeaders";
import Navbar from "../components/Navbar";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Checkout() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [discountEligible, setDiscountEligible] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(10);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { document.title = "My Cart - FitMart"; }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) { navigate("/auth"); return; }
      const userId = user.uid;

      try {
        const headers = await getAuthHeaders();

        const [cartRes, prodRes, discountRes] = await Promise.all([
          fetch(`${API}/api/cart/${userId}`, { headers, credentials: "include" }),
          fetch(`${API}/api/products`),
          fetch(`${API}/api/user/discount-status/${userId}`, { credentials: "include" }),
        ]);

        if (!cartRes.ok) throw new Error("Failed to fetch cart");
        if (!prodRes.ok) throw new Error("Failed to fetch products");

        const cart = await cartRes.json();
        const products = await prodRes.json();

        // ✅ NORMALIZATION ADDED HERE
        const normalizedProducts = products.map(normalizeProduct);

        if (discountRes.ok) {
          const d = await discountRes.json();
          setDiscountEligible(d.eligible);
          setDiscountPercent(d.discountPercent ?? 10);
        }

        if (!cart.items?.length) { setItems([]); setLoading(false); return; }

        // ✅ USING NORMALIZED PRODUCTS
        const productMap = Object.fromEntries(
          normalizedProducts.map(p => [p.productId, p])
        );

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

  const subtotal = items.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
  const discountAmt = discountEligible ? Math.round(subtotal * discountPercent / 100) : 0;
  const total = subtotal - discountAmt;

  const handleProceed = () => {
    navigate("/payment", {
      state: {
        items, total, subtotal, discountAmt,
        discountPercent: discountEligible ? discountPercent : 0,
        discountApplied: discountEligible,
      },
    });
  };

  if (loading) return (
    <PageShell menuOpen={menuOpen} setMenuOpen={setMenuOpen}>
      <Spinner />
    </PageShell>
  );

  if (error) return (
    <PageShell menuOpen={menuOpen} setMenuOpen={setMenuOpen}>
      <ErrorMsg msg={error} />
    </PageShell>
  );

  if (!items.length) return (
    <PageShell menuOpen={menuOpen} setMenuOpen={setMenuOpen}>
      <EmptyCart navigate={navigate} />
    </PageShell>
  );

  return (
    <PageShell menuOpen={menuOpen} setMenuOpen={setMenuOpen}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">Your Order</h1>

        {items.map(({ product, quantity }) => (
          <div key={product.productId} className="border p-4 mb-2 rounded">
            <h3>{product.name}</h3>
            <p>Qty: {quantity}</p>
            <p>{fmt(product.price * quantity)}</p>
          </div>
        ))}

        <div className="mt-6">
          <p>Subtotal: {fmt(subtotal)}</p>
          {discountEligible && <p>Discount: -{fmt(discountAmt)}</p>}
          <p className="font-bold">Total: {fmt(total)}</p>
        </div>

        <button
          onClick={handleProceed}
          className="mt-4 bg-black text-white px-4 py-2 rounded"
        >
          Proceed to Payment
        </button>
      </div>
    </PageShell>
  );
}

// helper components (unchanged)
function PageShell({ children, menuOpen, setMenuOpen }) {
  return (
    <div>
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {children}
    </div>
  );
}

function Spinner() {
  return <div>Loading...</div>;
}

function ErrorMsg({ msg }) {
  return <div>Error: {msg}</div>;
}

function EmptyCart({ navigate }) {
  return (
    <div>
      <p>Your cart is empty</p>
      <button onClick={() => navigate("/home")}>Go Shopping</button>
    </div>
  );
}