// src/pages/AdminCustomers.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fmt } from "../utils/formatters";
import AdminNavbar from "../components/AdminNavbar";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const SEGMENT_STYLES = {
  "high-value": "bg-stone-900 text-white",
  returning: "border border-stone-300 text-stone-600",
  new: "bg-stone-100 text-stone-600",
};

const CustomerAvatar = ({ name, photoURL, size = 8 }) => (
  <div className={`w-${size} h-${size} rounded-full overflow-hidden flex-shrink-0
                   bg-stone-200 flex items-center justify-center`}>
    {photoURL ? (
      <img src={photoURL} alt={name || "avatar"}
        className="w-full h-full object-cover" referrerPolicy="no-referrer"
        onError={e => { e.currentTarget.style.display = "none"; }} />
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
      <td key={i} className="px-4 sm:px-6 py-4 sm:py-5">
        <div className="h-3 bg-stone-100 rounded-full animate-pulse"
          style={{ width: `${w}%`, margin: i > 0 ? "0 auto" : "0" }} />
      </td>
    ))}
  </tr>
);

const Empty = () => (
  <tr>
    <td colSpan={7} className="py-12 sm:py-16 text-center">
      <p className="text-3xl text-stone-200 mb-3">∅</p>
      <p className="text-sm text-stone-400 mb-1">No customers found</p>
      <p className="text-xs text-stone-300">Customers appear once a paid order exists</p>
    </td>
  </tr>
);

// ── Mobile customer card ──────────────────────────────────────────────────
const CustomerMobileCard = ({ c, index, onClick }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
    onMouseDown={(e) => e.preventDefault()}
    className="select-none flex items-center gap-3 py-3.5 border-b border-stone-100 last:border-0
               cursor-pointer active:bg-stone-50 transition-colors"
  >
    <span className="text-xs text-stone-300 w-5 flex-shrink-0 text-center">{index + 1}</span>

    <CustomerAvatar name={c.customerName} photoURL={c.customerPhoto} size={8} />

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-0.5">
        {c.customerName && c.customerName !== "—" ? (
          <p className="text-sm font-medium text-stone-700 truncate">{c.customerName}</p>
        ) : (
          <p className="text-xs text-stone-400 font-mono">{c.userId?.slice(0, 12)}…</p>
        )}
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize flex-shrink-0
                          ${SEGMENT_STYLES[c.segment]}`}>
          {c.segment}
        </span>
      </div>
      {c.customerEmail && c.customerEmail !== "—" && (
        <p className="text-xs text-stone-400 truncate">{c.customerEmail}</p>
      )}
    </div>

    <div className="text-right flex-shrink-0">
      <p style={{ fontFamily: "'DM Serif Display', serif" }} className="text-base text-stone-900">
        {fmt(c.totalSpend)}
      </p>
      <p className="text-[10px] text-stone-400 mt-0.5">{c.orderCount} order{c.orderCount !== 1 ? "s" : ""}</p>
    </div>
  </div>
);

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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

      <AdminNavbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-10 py-8 sm:py-12">

        {/* Page heading */}
        <div className="mb-8 sm:mb-10">
          <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-2">Management</p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif" }}
            className="text-3xl sm:text-4xl md:text-5xl text-stone-900">
            Customers
          </h1>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl px-4 sm:px-6 py-4 mb-6 sm:mb-8">
            <p className="text-sm text-red-600">⚠ {error}</p>
            <p className="text-xs text-red-400 mt-1">Please try refreshing the page</p>
          </div>
        )}

        {/* KPI Cards — single col on mobile, 3-col on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5 mb-8 sm:mb-10">
          {[
            { label: "Total Customers", value: customers.length, icon: "◎" },
            { label: "High Value", value: customers.filter(c => c.segment === "high-value").length, icon: "⭑" },
            { label: "New Customers", value: customers.filter(c => c.segment === "new").length, icon: "+" },
          ].map(({ label, value, icon }) => (
            <div key={label}
              className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-7
                         hover:border-stone-300 hover:shadow-lg transition-all duration-300">
              <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-4 sm:mb-5">{label}</p>
              <div className="flex items-end justify-between">
                {loading ? (
                  <div className="h-8 sm:h-9 w-16 bg-stone-100 rounded-xl animate-pulse" />
                ) : (
                  <p style={{ fontFamily: "'DM Serif Display', serif" }}
                    className="text-3xl sm:text-4xl md:text-5xl text-stone-900 leading-none">
                    {value}
                  </p>
                )}
                <span className="text-xl text-stone-200 mb-0.5">{icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Customer list card */}
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden
                        hover:border-stone-300 transition-all duration-300">
          <div className="px-4 sm:px-7 py-4 sm:py-5 border-b border-stone-100
                          flex justify-between items-center">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-0.5">Directory</p>
              <h2 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-xl text-stone-900">
                All Customers
              </h2>
            </div>
            {!loading && <p className="text-xs text-stone-400">{customers.length} customers</p>}
          </div>

          {/* Mobile card list */}
          <div className="md:hidden px-4 py-2">
            {loading && (
              [...Array(5)].map((_, i) => (
                <div key={i} className="h-14 bg-stone-100 rounded-xl animate-pulse mb-3" />
              ))
            )}
            {!loading && customers.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-3xl text-stone-200 mb-3">∅</p>
                <p className="text-sm text-stone-400 mb-1">No customers found</p>
                <p className="text-xs text-stone-300">Customers appear once a paid order exists</p>
              </div>
            )}
            {!loading && customers.map((c, index) => (
              <CustomerMobileCard
                key={c.userId}
                c={c}
                index={index}
                onClick={() => navigate(`/admin/customers/${c.userId}`)}
              />
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
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
                  <tr key={c.userId}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/admin/customers/${c.userId}`)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigate(`/admin/customers/${c.userId}`); } }}
                    onMouseDown={(e) => e.preventDefault()}
                    className="select-none hover:bg-stone-50 transition-colors cursor-pointer group">
                    <td className="px-6 py-5 text-stone-300 text-xs">{index + 1}</td>
                    <td className="px-6 py-5">
                      {c.customerName && c.customerName !== "—" ? (
                        <div className="flex items-center gap-3">
                          <CustomerAvatar name={c.customerName} photoURL={c.customerPhoto} size={8} />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-stone-700
                                          group-hover:text-stone-900 truncate">
                              {c.customerName}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-stone-400 font-mono">{c.userId?.slice(0, 14)}…</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      {c.customerEmail && c.customerEmail !== "—" ? (
                        <span className="text-xs text-stone-500">{c.customerEmail}</span>
                      ) : (
                        <span className="text-xs text-stone-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full
                                       bg-stone-100 text-stone-600 text-xs font-medium">
                        {c.orderCount}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span style={{ fontFamily: "'DM Serif Display', serif" }} className="text-lg text-stone-900">
                        {fmt(c.totalSpend)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                                        ${SEGMENT_STYLES[c.segment]}`}>
                        {c.segment}
                      </span>
                    </td>
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