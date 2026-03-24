// src/pages/AdminInventory.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LOW_STOCK_THRESHOLD = 5;
const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

// ── Status badge config ────────────────────────────────────────────────────
const statusConfig = (p) => {
  const isUnlimited = p.stock === null;
  const available = isUnlimited ? null : p.stock - p.reserved;
  const isLow = !isUnlimited && available < LOW_STOCK_THRESHOLD;

  if (isUnlimited) return { label: "Unlimited", style: "bg-yellow-50 border border-yellow-200 text-yellow-700" };
  if (isLow) return { label: "Low Stock", style: "bg-red-50 border border-red-200 text-red-600" };
  return { label: "In Stock", style: "bg-green-50 border border-green-200 text-green-700" };
};

// ── Skeleton row ──────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="border-b border-stone-100">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="px-6 py-5">
        <div className="h-3 bg-stone-100 rounded-full animate-pulse"
          style={{ width: `${[60, 40, 20, 20, 20, 30][i]}%`, margin: i > 1 ? "0 auto" : "0" }} />
      </td>
    ))}
  </tr>
);

export default function AdminInventory() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all | low | in | unlimited

  useEffect(() => {
    console.log("Fetching from:", `${API_BASE}/products`);
    fetch(`${API_BASE}/products`)
      .then(res => {
        console.log("Response status:", res.status);
        return res.json();
      })
      .then(data => {
        console.log("Data received:", data);
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError("Failed to load inventory");
        setLoading(false);
      });
  }, []);

  // ── Derived stats ──────────────────────────────────────────────────────
  const stats = {
    total: products.length,
    low: products.filter(p => p.stock !== null && (p.stock - p.reserved) < LOW_STOCK_THRESHOLD).length,
    inStock: products.filter(p => p.stock !== null && (p.stock - p.reserved) >= LOW_STOCK_THRESHOLD).length,
    unlimited: products.filter(p => p.stock === null).length,
  };

  // ── Filtered list ──────────────────────────────────────────────────────
  const filtered = products.filter(p => {
    const avail = p.stock === null ? null : p.stock - p.reserved;
    if (filter === "low") return p.stock !== null && avail < LOW_STOCK_THRESHOLD;
    if (filter === "in") return p.stock !== null && avail >= LOW_STOCK_THRESHOLD;
    if (filter === "unlimited") return p.stock === null;
    return true;
  });

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
        .fade-in { animation: fmFade 0.5s ease forwards; }
        @keyframes fmFade { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* ── Sticky top bar ──────────────────────────────────────────────── */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span
              style={{ fontFamily: "'DM Serif Display', serif" }}
              className="text-xl text-stone-900 tracking-tight cursor-pointer"
              onClick={() => navigate("/home")}
            >
              FitMart
            </span>
            <div className="h-4 w-px bg-stone-200" />
            <p className="text-xs tracking-[0.2em] uppercase text-stone-400">ADMIN</p>
          </div>

          <button
            onClick={() => navigate("/home")}
            className="border border-stone-200 text-stone-600 text-xs px-5 py-2
                       rounded-full hover:bg-stone-900 hover:text-white hover:border-stone-900
                       transition-all"
          >
            ← Home
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-12">

        {/* ── Page heading ──────────────────────────────────────────────── */}
        <div className="mb-10">
          <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-2">
            Stock Management
          </p>
          <h1
            style={{ fontFamily: "'DM Serif Display', serif" }}
            className="text-4xl md:text-5xl text-stone-900"
          >
            Inventory
          </h1>
        </div>

        {/* ── Error ─────────────────────────────────────────────────────── */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl px-6 py-5 mb-8">
            <p className="text-sm text-red-600">⚠ {error}</p>
          </div>
        )}

        {/* ── KPI strip ─────────────────────────────────────────────────── */}
        {!error && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-8">
            {[
              { label: "Total Products", value: loading ? "—" : stats.total, icon: "◎" },
              { label: "In Stock", value: loading ? "—" : stats.inStock, icon: "✓" },
              { label: "Low Stock", value: loading ? "—" : stats.low, icon: "⚡" },
              { label: "Unlimited", value: loading ? "—" : stats.unlimited, icon: "─" },
            ].map(({ label, value, icon }) => (
              <div
                key={label}
                className="bg-white border border-stone-200 rounded-2xl p-6
                           hover:border-stone-300 hover:shadow-lg transition-all duration-300"
              >
                <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-4">{label}</p>
                <div className="flex items-end justify-between">
                  <p
                    style={{ fontFamily: "'DM Serif Display', serif" }}
                    className="text-4xl text-stone-900 leading-none"
                  >
                    {value}
                  </p>
                  <span className="text-xl text-stone-300 mb-0.5">{icon}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Filter pills ──────────────────────────────────────────────── */}
        {!loading && !error && (
          <div className="flex gap-2 flex-wrap mb-6">
            {[
              { key: "all", label: `All (${stats.total})` },
              { key: "in", label: `In Stock (${stats.inStock})` },
              { key: "low", label: `Low Stock (${stats.low})` },
              { key: "unlimited", label: `Unlimited (${stats.unlimited})` },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`text-xs px-4 py-2 rounded-full transition-all ${filter === key
                  ? "bg-stone-900 text-white"
                  : "border border-stone-200 text-stone-600 hover:bg-stone-100"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* ── Table card ────────────────────────────────────────────────── */}
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden
                        hover:border-stone-300 transition-all duration-300">

          {/* Card header */}
          <div className="px-7 py-5 border-b border-stone-100 flex justify-between items-center">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-0.5">Live Data</p>
              <h2
                style={{ fontFamily: "'DM Serif Display', serif" }}
                className="text-xl text-stone-900"
              >
                Stock Levels
              </h2>
            </div>
            {!loading && (
              <p className="text-xs text-stone-400">
                {filtered.length} product{filtered.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  {["Product", "Category", "Stock", "Reserved", "Available", "Status"].map((h) => (
                    <th
                      key={h}
                      className={`px-6 py-4 text-xs tracking-[0.15em] uppercase text-stone-400
                                  font-normal ${h !== "Product" && h !== "Category" ? "text-center" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100">
                {/* Skeleton */}
                {loading && [...Array(6)].map((_, i) => <SkeletonRow key={i} />)}

                {/* Empty state */}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <p className="text-3xl text-stone-200 mb-3">∅</p>
                      <p className="text-sm text-stone-400">No products match this filter</p>
                    </td>
                  </tr>
                )}

                {/* Data rows */}
                {!loading && filtered.map((p) => {
                  const isUnlimited = p.stock === null;
                  const available = isUnlimited ? null : p.stock - p.reserved;
                  const { label, style } = statusConfig(p);

                  return (
                    <tr
                      key={p.productId}
                      className="hover:bg-stone-50 transition-colors"
                    >
                      {/* Product name */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          {p.image && (
                            <div className="w-9 h-9 rounded-xl bg-stone-100 overflow-hidden flex-shrink-0">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-full h-full object-cover"
                                onError={e => { e.currentTarget.style.display = "none"; }}
                              />
                            </div>
                          )}
                          <div>
                            <p className="text-stone-900 font-medium leading-tight">{p.name}</p>
                            {p.brand && (
                              <p className="text-[10px] tracking-[0.12em] uppercase text-stone-400 mt-0.5">
                                {p.brand}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-5">
                        <span className="text-xs text-stone-400 border border-stone-200
                                         px-2.5 py-1 rounded-full">
                          {p.category || "─"}
                        </span>
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-5 text-center">
                        <span
                          style={{ fontFamily: "'DM Serif Display', serif" }}
                          className="text-lg text-stone-700"
                        >
                          {isUnlimited ? "∞" : p.stock}
                        </span>
                      </td>

                      {/* Reserved */}
                      <td className="px-6 py-5 text-center text-stone-400 text-sm">
                        {p.reserved ?? 0}
                      </td>

                      {/* Available */}
                      <td className="px-6 py-5 text-center">
                        <span
                          style={{ fontFamily: "'DM Serif Display', serif" }}
                          className={`text-lg ${!isUnlimited && available < LOW_STOCK_THRESHOLD
                            ? "text-red-600"
                            : "text-stone-900"
                            }`}
                        >
                          {isUnlimited ? "∞" : available}
                        </span>
                      </td>

                      {/* Status badge */}
                      <td className="px-6 py-5 text-center">
                        <span
                          className={`text-[10px] tracking-widest uppercase px-3 py-1.5
                                      rounded-full font-medium ${style}`}
                        >
                          {label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-stone-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 py-6 flex justify-between items-center">
          <span
            style={{ fontFamily: "'DM Serif Display', serif" }}
            className="text-stone-900"
          >
            FitMart
          </span>
          <p className="text-xs text-stone-400">Inventory Management · © 2026</p>
        </div>
      </footer>
    </div>
  );
}