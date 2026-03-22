// src/pages/HomePage.jsx
// ── ONLY THE NAVBAR SECTION CHANGES — rest of HomePage is identical ──────────
// Replace your existing Navbar import and usage with this:
//
// OLD:
//   <Navbar
//     links={["Shop", "Plans", "Community"]}
//     variant="home"
//     onSearchToggle={...}
//     onCartOpen={...}
//     cartCount={cartCount}
//     user={user}                  ← REMOVE
//     menuOpen={menuOpen}
//     setMenuOpen={setMenuOpen}
//     onSignOut={handleSignOut}
//   />
//
// NEW (copy-paste this block into your HomePage.jsx):
//
//   <Navbar
//     variant="home"
//     onSearchToggle={() => { setSearchOpen(p => !p); setSearchQuery(""); }}
//     onCartOpen={() => setCartOpen(true)}
//     cartCount={cartCount}
//     menuOpen={menuOpen}
//     setMenuOpen={setMenuOpen}
//     onSignOut={handleSignOut}
//   />
//
// That's the ONLY change needed in HomePage.jsx.
// - Remove the `links` prop (no nav links in new Navbar)
// - Remove the `user` prop (Navbar now manages its own Firebase auth state)
// - Keep everything else exactly as-is

// ── Full updated HomePage for reference ─────────────────────────────────────
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { signOut } from "firebase/auth";
import { auth } from "../auth/firebase";
import CartDrawer from "../components/CartDrawer";
import { fmt } from "../utils/formatters";
import FitnessChatBot from "../components/FitnessChatBot";
import WelcomeBanner from "../components/WelcomeBanner";
import { useWelcomeDiscount } from "../auth/useWelcomeDiscount";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CATEGORIES = [
  { name: "All", value: "all" },
  { name: "Equipment", value: "Equipment" },
  { name: "Nutrition", value: "Nutrition" },
  { name: "Wearables", value: "Wearables" },
];

const PLANS = [
  { name: "Weight Loss", duration: "12 Weeks", desc: "Caloric-deficit nutrition + cardio-focused programming", tag: "MOST POPULAR", route: "/plans/weight-loss" },
  { name: "Muscle Building", duration: "16 Weeks", desc: "Progressive overload training + protein-optimized meal plans", tag: null, route: "/plans/muscle-building" },
  { name: "Mobility & Recovery", duration: "8 Weeks", desc: "Flexibility-first programming, ideal for desk workers", tag: null, route: "/plans/mobility-recovery" },
];

const Stars = ({ rating }) => (
  <span className="text-stone-500 text-xs">
    {"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}
  </span>
);

function ProductCard({ product, onAdd, cartItems = [], updateQty }) {
  const [added, setAdded] = useState(false);
  const cartItem = cartItems.find(item => item.id === (product.productId || product.id));
  const quantity = cartItem?.qty || 0;

  const handleAdd = () => {
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="group bg-white border border-stone-100 rounded-2xl overflow-hidden
                    hover:border-stone-200 hover:shadow-lg transition-all duration-300">
      <div className="relative bg-stone-100 aspect-square flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            src={product.image} alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={e => { e.currentTarget.onerror = null; e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div className="text-5xl opacity-20 select-none group-hover:scale-110 transition-transform duration-500">
            {product.category === "Nutrition" ? "🧴" : product.category === "Wearables" ? "⌚" : "🏋️"}
          </div>
        )}
        {product.badge && (
          <span className="absolute top-3 left-3 text-[10px] tracking-widest uppercase
                           bg-stone-900 text-white px-2.5 py-1 rounded-full">
            {product.badge}
          </span>
        )}
        {discount && (
          <span className="absolute top-3 right-3 text-[10px] font-medium text-stone-600
                           bg-white px-2 py-1 rounded-full border border-stone-200">
            −{discount}%
          </span>
        )}
      </div>

      <div className="p-5">
        <p className="text-[10px] tracking-[0.15em] uppercase text-stone-400 mb-1">{product.brand}</p>
        <h3 className="text-sm font-medium text-stone-900 leading-snug mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-1.5 mb-3">
          <Stars rating={product.rating} />
          <span className="text-[10px] text-stone-400">({product.reviews})</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-base font-semibold text-stone-900">{fmt(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through ml-2">{fmt(product.originalPrice)}</span>
            )}
          </div>
          {quantity > 0 ? (
            <div className="flex items-center border border-stone-300 rounded-full overflow-hidden">
              <button
                onClick={() => updateQty(product.id || product.productId, -1)}
                className="w-8 h-8 flex items-center justify-center text-stone-600
                           hover:bg-stone-100 transition-colors"
              >
                <span className="text-lg leading-none">−</span>
              </button>
              <span className="w-8 text-xs text-stone-900 text-center font-medium">{quantity}</span>
              <button
                onClick={() => updateQty(product.id || product.productId, 1)}
                className="w-8 h-8 flex items-center justify-center text-stone-600
                           hover:bg-stone-100 transition-colors"
              >
                <span className="text-lg leading-none">+</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className={`text-xs px-4 py-2 rounded-full transition-all duration-200 ${added
                ? "bg-stone-900 text-white"
                : "border border-stone-300 text-stone-700 hover:bg-stone-900 hover:text-white hover:border-stone-900"
                }`}
            >
              {added ? "Added ✓" : "Add to cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [backendError, setBackendError] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showBanner, dismissBanner } = useWelcomeDiscount(user);


  // custom titles for home page 
  useEffect(() => {
    document.title = "FitMart - Fitness & Nutrition Store";
  }, []);

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
    const unsub = auth.onAuthStateChanged(u => {
      setUser(u);
      if (!u) navigate("/auth");
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    async function loadCartFromServer(u) {
      try {
        const res = await fetch(`${API}/api/cart/${u.uid}`);
        if (!res.ok) return;
        const cartDoc = await res.json();
        const mapped = cartDoc.items.map(it => {
          const prod = products.find(p => Number(p.productId) === Number(it.productId));
          if (!prod) return { id: it.productId, qty: it.quantity, name: "Unknown", price: 0 };
          return { ...prod, id: prod.id || prod.productId, qty: it.quantity };
        });
        setCart(mapped);
      } catch (err) {
        console.error("Error loading cart from server", err);
      }
    }
    if (user && products.length > 0) loadCartFromServer(user);
  }, [user, products]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setBackendError(false);
      try {
        const res = await fetch(`${API}/api/products`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setProducts(data.map(p => ({ ...p, id: p.productId || p.id })));
      } catch (err) {
        console.error("Error loading products:", err);
        setBackendError(true);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/");
  };

  const addToCart = product => {
    if (user) {
      (async () => {
        try {
          const res = await fetch(`${API}/api/cart/${user.uid}/add`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: product.productId || product.id, quantity: 1 }),
          });
          if (!res.ok) throw new Error("Failed to add to cart");
          const cartDoc = await res.json();
          setCart(cartDoc.items.map(it => {
            const prod = products.find(p => Number(p.productId) === Number(it.productId));
            return prod
              ? { ...prod, id: prod.id || prod.productId, qty: it.quantity }
              : { id: it.productId, qty: it.quantity, name: "Unknown", price: 0 };
          }));
        } catch (err) { console.error("Add to cart failed", err); }
      })();
      return;
    }
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      return ex
        ? prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = id => {
    if (user) {
      (async () => {
        try {
          const existing = cart.find(i => i.id === id);
          const res = await fetch(`${API}/api/cart/${user.uid}/remove`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: id, quantity: existing?.qty || 1 }),
          });
          if (!res.ok) throw new Error("Failed to remove");
          const cartDoc = await res.json();
          setCart(cartDoc.items.map(it => {
            const prod = products.find(p => Number(p.productId) === Number(it.productId));
            return prod
              ? { ...prod, id: prod.id || prod.productId, qty: it.quantity }
              : { id: it.productId, qty: it.quantity, name: "Unknown", price: 0 };
          }));
        } catch (err) { console.error("Remove failed", err); }
      })();
      return;
    }
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQty = (id, delta) => {
    if (user) {
      (async () => {
        try {
          const url = delta > 0 ? "add" : "remove";
          await fetch(`${API}/api/cart/${user.uid}/${url}`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: id, quantity: Math.abs(delta) }),
          });
          const res = await fetch(`${API}/api/cart/${user.uid}`);
          const cartDoc = await res.json();
          setCart(cartDoc.items.map(it => {
            const prod = products.find(p => Number(p.productId) === Number(it.productId));
            return prod
              ? { ...prod, id: prod.id || prod.productId, qty: it.quantity }
              : { id: it.productId, qty: it.quantity, name: "Unknown", price: 0 };
          }));
        } catch (err) { console.error("Update qty failed", err); }
      })();
      return;
    }
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const firstName = user?.displayName?.split(" ")[0] || "there";

  const filtered = products.filter(p => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const renderProductGrid = () => {
    if (loading) return (
      <div className="text-center py-16 text-stone-400">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4
                        border-stone-300 border-t-stone-900 mb-4" />
        <p className="text-sm">Loading products...</p>
      </div>
    );
    if (backendError) return (
      <div className="text-center py-16 text-stone-400">
        <p className="text-3xl mb-2">🔌</p>
        <p className="text-sm mb-2">Cannot connect to the server</p>
        <p className="text-xs text-stone-400">Make sure the backend is running on port 5000</p>
        <button onClick={() => window.location.reload()}
          className="mt-4 text-xs bg-stone-900 text-white px-4 py-2 rounded-full hover:bg-stone-700 transition-colors">
          Retry Connection
        </button>
      </div>
    );
    if (!filtered.length) return (
      <div className="text-center py-16 text-stone-400">
        <p className="text-3xl mb-2">∅</p>
        <p className="text-sm">No products match your search.</p>
      </div>
    );
    return (
      <div className={`fade-in d3 ${visible ? "show" : ""} grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5`}>
        {filtered.map(p => (
          <ProductCard key={p.id} product={p} onAdd={addToCart} cartItems={cart} updateQty={updateQty} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 font-['DM_Sans',sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
        .fade-in { opacity:0; transform:translateY(16px); transition:opacity .5s ease,transform .5s ease; }
        .fade-in.show { opacity:1; transform:translateY(0); }
        .d1{transition-delay:.05s} .d2{transition-delay:.15s} .d3{transition-delay:.25s}
        .cart-slide { transform:translateX(100%); transition:transform .35s cubic-bezier(.16,1,.3,1); }
        .cart-slide.open { transform:translateX(0); }
        .overlay { opacity:0; pointer-events:none; transition:opacity .3s ease; }
        .overlay.show { opacity:1; pointer-events:auto; }
        .search-expand { max-height:0; overflow:hidden; transition:max-height .3s ease; }
        .search-expand.open { max-height:80px; }
      `}</style>

      {showBanner && <WelcomeBanner onDismiss={dismissBanner} />}

      {/* ── NAVBAR ── only these props — no links, no user prop ── */}
      <Navbar
        variant="home"
        onSearchToggle={() => { setSearchOpen(p => !p); setSearchQuery(""); }}
        onCartOpen={() => setCartOpen(true)}
        cartCount={cartCount}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onSignOut={handleSignOut}
      />

      {/* Search expand */}
      <div className={`search-expand ${searchOpen ? "open" : ""} border-t border-stone-100`}>
        <div className="max-w-7xl mx-auto px-5 lg:px-10 py-3">
          <input
            autoFocus={searchOpen}
            type="text"
            placeholder="Search products, brands…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-sm text-stone-800 placeholder-stone-300 bg-transparent focus:outline-none"
          />
        </div>
      </div>

      {/* Hero banner */}
      <section className="bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 py-14">
          <div className={`fade-in d1 ${visible ? "show" : ""}`}>
            <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-3">
              Welcome back, {firstName}
            </p>
            <h1 className="font-['DM_Serif_Display'] text-3xl md:text-5xl text-white
                           leading-tight max-w-xl mb-5">
              Build something <em className="not-italic text-stone-400">stronger</em> today.
            </h1>
            <div className="flex flex-wrap gap-3">
              <button className="text-sm bg-white text-stone-900 px-6 py-2.5 rounded-full
                                 hover:bg-stone-100 transition-colors">
                Shop Now
              </button>
              <button
                onClick={() => document.getElementById("plans")?.scrollIntoView({ behavior: "smooth" })}
                className="text-sm border border-stone-700 text-stone-300 px-6 py-2.5
                           rounded-full hover:bg-stone-800 transition-colors"
              >
                View Plans
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-10 space-y-16">

        {/* Products */}
        <section>
          <div className={`fade-in d1 ${visible ? "show" : ""} flex items-center justify-between mb-6`}>
            <h2 className="font-['DM_Serif_Display'] text-2xl md:text-3xl text-stone-900">Featured Products</h2>
            {!backendError && !loading && (
              <span className="text-xs text-stone-400">{filtered.length} items</span>
            )}
          </div>
          {!backendError && !loading && (
            <div className={`fade-in d2 ${visible ? "show" : ""} flex gap-2 flex-wrap mb-8`}>
              {CATEGORIES.map(c => (
                <button
                  key={c.value}
                  onClick={() => setActiveCategory(c.value)}
                  className={`text-xs px-4 py-2 rounded-full transition-all ${activeCategory === c.value
                    ? "bg-stone-900 text-white"
                    : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
          {renderProductGrid()}
        </section>

        {/* Plans */}
        <section id="plans">
          <div className="mb-8">
            <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-2">Digital Coaching</p>
            <h2 className="font-['DM_Serif_Display'] text-2xl md:text-3xl text-stone-900">Fitness plans</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {PLANS.map((plan, i) => (
              <div
                key={i}
                className="bg-white border border-stone-200 rounded-2xl p-7 flex flex-col gap-4 hover:border-stone-300 hover:shadow-lg transition-all duration-300"
              >
                {plan.tag && (
                  <span className="text-[9px] tracking-[0.2em] uppercase text-stone-400">{plan.tag}</span>
                )}
                <div>
                  <h3 className="font-['DM_Serif_Display'] text-xl text-stone-900">
                    {plan.name}
                  </h3>
                  <p className="text-xs mt-0.5 text-stone-400">{plan.duration}</p>
                </div>
                <p className="text-sm leading-relaxed flex-1 text-stone-500">
                  {plan.desc}
                </p>
                <button
                  onClick={() => navigate(plan.route)}
                  className="text-xs py-2.5 rounded-full transition-all mt-1 border border-stone-300 text-stone-700 hover:bg-stone-900 hover:text-white hover:border-stone-900">
                  View Plan →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* FitRewards banner */}
        <section>
          <div className="bg-stone-100 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row
                          md:items-center justify-between gap-6">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-2">Loyalty Program</p>
              <h3 className="font-['DM_Serif_Display'] text-2xl md:text-3xl text-stone-900 mb-2">
                Earn FitRewards
              </h3>
              <p className="text-sm text-stone-500 max-w-md leading-relaxed">
                Points for every purchase, and every fitness milestone. Redeem against equipment, supplements, or coaching.
              </p>
            </div>
            <button className="shrink-0 bg-stone-900 text-white text-sm px-7 py-3 rounded-full
                               hover:bg-stone-700 transition-colors self-start md:self-auto">
              Learn More
            </button>
          </div>
        </section>

        {/* Upgrade */}
        <section className="pb-8">
          <div className="mb-8">
            <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-2">Membership</p>
            <h2 className="font-['DM_Serif_Display'] text-2xl md:text-3xl text-stone-900">
              Upgrade your experience
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { tier: "Pro", price: `${fmt(499)}/mo`, desc: "Personalized nutrition plans + 5% flat discount on everything.", cta: "Upgrade to Pro" },
              { tier: "Elite", price: `${fmt(1499)}/mo`, desc: "1-on-1 coaching, early access to limited equipment drops, biometric sync.", cta: "Upgrade to Elite" },
            ].map((p, i) => (
              <div key={i} className="bg-white border border-stone-200 rounded-2xl p-7 flex
                                      flex-col md:flex-row md:items-center justify-between gap-5">
                <div>
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <span className="font-['DM_Serif_Display'] text-2xl text-stone-900">{p.tier}</span>
                    <span className="text-sm text-stone-400">{p.price}</span>
                  </div>
                  <p className="text-sm text-stone-500 leading-relaxed">{p.desc}</p>
                </div>
                <button className="shrink-0 text-xs border border-stone-300 text-stone-700 px-5 py-2.5
                                   rounded-full hover:bg-stone-900 hover:text-white hover:border-stone-900
                                   transition-all self-start">
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 py-8 flex flex-col md:flex-row
                        justify-between items-center gap-4">
          <span className="font-['DM_Serif_Display'] text-lg text-stone-900">FitMart</span>
          <p className="text-xs text-stone-400">© 2026 FitMart. Built at VESIT, Mumbai.</p>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Support"].map(l => (
              <button key={l} className="text-xs text-stone-400 hover:text-stone-600 transition-colors">{l}</button>
            ))}
          </div>
        </div>
      </footer>

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        cartCount={cartCount}
        cartTotal={cartTotal}
        updateQty={updateQty}
        removeFromCart={removeFromCart}
      />

      <FitnessChatBot />
    </div>
  );
}