// src/pages/AdminCustomers.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fmt } from "../utils/formatters";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const SEGMENT_STYLES = {
  "high-value": "bg-stone-900 text-white",
  returning: "border border-stone-300 text-stone-600",
  new: "bg-stone-100 text-stone-600",
};

// ── Mirrors Navbar.jsx avatar pattern ─────────────────────────────────────
const CustomerAvatar = ({ name, photoURL, size = 8 }) => (
  <div className={`w-${size} h-${size} rounded-full overflow-hidden flex-shrink-0
                   bg-stone-200 flex items-center justify-center`}>
    {photoURL ? (
      <img
        src={photoURL}
        alt={name || "avatar"}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
        onError={e => { e.currentTarget.style.display = "none"; }}
      />
    ) : (
      <span className="text-xs font-medium text-stone-600">
        {(name?.[0] || "?").toUpperCase()}
      </span>
    )}
  </div>
);

const SkeletonRow = () => (
  <tr className="border-b border-stone-100">
    {[55, 20, 15, 20, 15, 15].map((w, i) => (
      <td key={i} className="px-6 py-5">
        <div className="h-3 bg-stone-100 rounded-full animate-pulse"
          style={{ width: `${w}%`, margin: i > 0 ? "0 auto" : "0" }} />
      </td>
    ))}
  </tr>
);

const Empty = () => (
  <tr>
    <td colSpan={6} className="py-16 text-center">
      <p className="text-3xl text-stone-200 mb-3">∅</p>
      <p className="text-sm text-stone-400 mb-1">No customers found</p>
      <p className="text-xs text-stone-300">Customers appear once a paid order exists</p>
    </td>
  </tr>
);

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/customers`)
      .then(res => res.json())
      .then(json => { setCustomers(json.data); setLoading(false); })
      .catch(() => { setError("Failed to load customers"); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
      `}</style>

      {/* ── Sticky top bar ──────────────────────────────────────────────── */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span
              style={{ fontFamily: "'DM Serif Display', serif" }}
              className="text-xl text-stone-900 tracking-tight cursor-pointer"
              onClick={() => navigate("/admin/dashboard")}
            >
              FitMart
            </span>
            <div className="h-4 w-px bg-stone-200" />
            <p className="text-xs tracking-[0.2em] uppercase text-stone-400">ADMIN</p>
          </div>

          <button
            onClick={() => navigate("/admin/dashboard")}
            className="border border-stone-200 text-stone-600 text-xs px-5 py-2
                       rounded-full hover:bg-stone-900 hover:text-white hover:border-stone-900
                       transition-all"
          >
            ← Go to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 lg:px-10 py-12">

        {/* Page heading */}
        <div className="mb-10">
          <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-2">Management</p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif" }}
            className="text-4xl md:text-5xl text-stone-900">
            Customers
          </h1>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl px-6 py-5 mb-8">
            <p className="text-sm text-red-600">⚠ {error}</p>
            <p className="text-xs text-red-400 mt-1">Please try refreshing the page</p>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 mb-10">
          {[
            { label: "Total Customers", value: customers.length, icon: "◎" },
            { label: "High Value", value: customers.filter(c => c.segment === "high-value").length, icon: "⭑" },
            { label: "New Customers", value: customers.filter(c => c.segment === "new").length, icon: "+" },
          ].map(({ label, value, icon }) => (
            <div key={label}
              className="bg-white border border-stone-200 rounded-2xl p-7
                            hover:border-stone-300 hover:shadow-lg transition-all duration-300">
              <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-5">{label}</p>
              <div className="flex items-end justify-between">
                {loading ? (
                  <div className="h-9 w-16 bg-stone-100 rounded-xl animate-pulse" />
                ) : (
                  <p style={{ fontFamily: "'DM Serif Display', serif" }}
                    className="text-4xl md:text-5xl text-stone-900 leading-none">
                    {value}
                  </p>
                )}
                <span className="text-xl text-stone-200 mb-0.5">{icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Customers Table */}
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden
                        hover:border-stone-300 transition-all duration-300">
          <div className="px-7 py-5 border-b border-stone-100 flex justify-between items-center">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-0.5">Directory</p>
              <h2 style={{ fontFamily: "'DM Serif Display', serif" }}
                className="text-xl text-stone-900">
                All Customers
              </h2>
            </div>
            {!loading && <p className="text-xs text-stone-400">{customers.length} customers</p>}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  {["#", "Customer", "Email", "Orders", "Total Spend", "Segment", "Last Order"].map((h, i) => (
                    <th key={h}
                      className={`px-6 py-4 text-xs tracking-[0.15em] uppercase text-stone-400
                                    font-normal whitespace-nowrap
                                    ${i === 0 || i === 1 || i === 2
                          ? "text-left"
                          : i === 4 ? "text-right" : "text-center"}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100">
                {loading && [...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
                {!loading && customers.length === 0 && <Empty />}

                {!loading && customers.map((c, index) => (
                  <tr
                    key={c.userId}
                    onClick={() => navigate(`/admin/customers/${c.userId}`)}
                    className="hover:bg-stone-50 transition-colors cursor-pointer group"
                  >
                    {/* # */}
                    <td className="px-6 py-5 text-stone-300 text-xs">{index + 1}</td>

                    {/* Customer — avatar + name (or truncated UID fallback) */}
                    <td className="px-6 py-5">
                      {c.customerName && c.customerName !== "—" ? (
                        <div className="flex items-center gap-3">
                          <CustomerAvatar
                            name={c.customerName}
                            photoURL={c.customerPhoto}
                            size={8}
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-stone-700
                                          group-hover:text-stone-900 truncate">
                              {c.customerName}
                            </p>
                          </div>
                        </div>
                      ) : (
                        // Fallback: truncated UID before backend is enriched
                        <span className="text-xs text-stone-400 font-mono">
                          {c.userId?.slice(0, 14)}…
                        </span>
                      )}
                    </td>

                    {/* Email */}
                    <td className="px-6 py-5">
                      {c.customerEmail && c.customerEmail !== "—" ? (
                        <span className="text-xs text-stone-500">{c.customerEmail}</span>
                      ) : (
                        <span className="text-xs text-stone-300">—</span>
                      )}
                    </td>

                    {/* Orders */}
                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7
                                       rounded-full bg-stone-100 text-stone-600 text-xs font-medium">
                        {c.orderCount}
                      </span>
                    </td>

                    {/* Total Spend */}
                    <td className="px-6 py-5 text-right">
                      <span style={{ fontFamily: "'DM Serif Display', serif" }}
                        className="text-lg text-stone-900">
                        {fmt(c.totalSpend)}
                      </span>
                    </td>

                    {/* Segment */}
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                                        ${SEGMENT_STYLES[c.segment]}`}>
                        {c.segment}
                      </span>
                    </td>

                    {/* Last Order */}
                    <td className="px-6 py-5 text-center text-stone-400 text-xs whitespace-nowrap">
                      {new Date(c.lastOrder).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}