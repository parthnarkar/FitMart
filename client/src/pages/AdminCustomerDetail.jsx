// src/pages/AdminCustomerDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import { fmt } from "../utils/formatters";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const SEGMENT_STYLES = {
  "high-value": "bg-stone-900 text-white",
  returning: "border border-stone-300 text-stone-600",
  new: "bg-stone-100 text-stone-600",
};

const STATUS_STYLES = {
  paid: "bg-stone-900 text-white",
  created: "border border-stone-300 text-stone-600",
  failed: "bg-red-50 border border-red-100 text-red-600",
};

// ── Mirrors Navbar.jsx avatar pattern ─────────────────────────────────────
const CustomerAvatar = ({ name, photoURL, size = "16" }) => (
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
      <span className="text-2xl font-medium text-stone-500">
        {(name?.[0] || "?").toUpperCase()}
      </span>
    )}
  </div>
);

const SkeletonRow = () => (
  <tr className="border-b border-stone-100">
    {[40, 10, 15, 20, 15].map((w, i) => (
      <td key={i} className="px-6 py-5">
        <div className="h-3 bg-stone-100 rounded-full animate-pulse"
          style={{ width: `${w}%`, margin: i > 0 ? "0 auto" : "0" }} />
      </td>
    ))}
  </tr>
);

export default function AdminCustomerDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleOrder = (id) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  useEffect(() => {
    fetch(`${API_BASE}/customers/${userId}`)
      .then(res => res.json())
      .then(json => {
        if (!json.success) throw new Error(json.error);
        setData(json.data);
        setLoading(false);
      })
      .catch(() => { setError("Customer not found"); setLoading(false); });
  }, [userId]);

  const {
    customerName, customerEmail, customerPhoto,
    orderCount, totalSpend, firstOrder, lastOrder,
    segment, orders,
  } = data || {};

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
      `}</style>

      <AdminNavbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="max-w-6xl mx-auto px-5 lg:px-10 py-12">

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl px-6 py-5 mb-8">
            <p className="text-sm text-red-600">⚠ {error}</p>
          </div>
        )}

        {/* ── Profile header ─────────────────────────────────────────────── */}
        <div className="mb-10">
          <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-5">
            Customer Profile
          </p>

          {loading ? (
            // Skeleton header
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-stone-100 animate-pulse flex-shrink-0" />
              <div className="space-y-2">
                <div className="h-7 w-48 bg-stone-100 rounded-full animate-pulse" />
                <div className="h-3 w-32 bg-stone-100 rounded-full animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-5 flex-wrap">
              {/* Large avatar */}
              <CustomerAvatar
                name={customerName}
                photoURL={customerPhoto}
                size="16"
              />

              <div className="min-w-0">
                {/* Name or UID fallback */}
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h1
                    style={{ fontFamily: "'DM Serif Display', serif" }}
                    className="text-3xl md:text-4xl text-stone-900"
                  >
                    {customerName && customerName !== "—" ? customerName : userId}
                  </h1>
                  {segment && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                                      ${SEGMENT_STYLES[segment]}`}>
                      {segment}
                    </span>
                  )}
                </div>

                {/* Email */}
                {customerEmail && customerEmail !== "—" && (
                  <p className="text-sm text-stone-500">{customerEmail}</p>
                )}

                {/* UID — always shown as a small reference */}
                <p className="text-[10px] text-stone-300 font-mono mt-1">{userId}</p>
              </div>
            </div>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 md:gap-5 mb-10">
          {[
            { label: "Total Orders", value: loading ? null : orderCount, icon: "◎" },
            { label: "Total Spend", value: loading ? null : fmt(totalSpend), icon: "₹" },
            {
              label: "First Order",
              value: loading ? null : new Date(firstOrder).toLocaleDateString("en-IN", {
                day: "2-digit", month: "short", year: "numeric",
              }),
              icon: "─",
            },
            {
              label: "Last Order",
              value: loading ? null : new Date(lastOrder).toLocaleDateString("en-IN", {
                day: "2-digit", month: "short", year: "numeric",
              }),
              icon: "─",
            },
          ].map(({ label, value, icon }) => (
            <div key={label}
              className="bg-white border border-stone-200 rounded-2xl p-7
                            hover:border-stone-300 hover:shadow-lg transition-all duration-300">
              <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-5">{label}</p>
              <div className="flex items-end justify-between">
                {loading ? (
                  <div className="h-9 w-20 bg-stone-100 rounded-xl animate-pulse" />
                ) : (
                  <p style={{ fontFamily: "'DM Serif Display', serif" }}
                    className="text-3xl md:text-4xl text-stone-900 leading-none">
                    {value}
                  </p>
                )}
                <span className="text-xl text-stone-200 mb-0.5">{icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Order History */}
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden
                        hover:border-stone-300 transition-all duration-300">
          <div className="px-7 py-5 border-b border-stone-100 flex justify-between items-center">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-0.5">History</p>
              <h2 style={{ fontFamily: "'DM Serif Display', serif" }}
                className="text-xl text-stone-900">
                Order History
              </h2>
            </div>
            {!loading && orders && (
              <p className="text-xs text-stone-400">{orders.length} orders</p>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  {["Order ID", "Items", "Status", "Total", "Date"].map((h, i) => (
                    <th key={h}
                      className={`px-6 py-4 text-xs tracking-[0.15em] uppercase
                                    text-stone-400 font-normal
                                    ${i === 0 ? "text-left" : i === 3 ? "text-right" : "text-center"}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100">
                {loading && [...Array(3)].map((_, i) => <SkeletonRow key={i} />)}

                {!loading && orders?.map(order => (
                  <>
                    {/* Order row — click to expand */}
                    <tr
                      key={order._id}
                      onClick={() => toggleOrder(order._id)}
                      className="hover:bg-stone-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 text-stone-400 text-xs font-mono">
                        <span className="mr-2 text-stone-300">
                          {expanded[order._id] ? "▾" : "▸"}
                        </span>
                        {order._id}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7
                                         rounded-full bg-stone-100 text-stone-600 text-xs font-medium">
                          {order.items.length}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                                          ${STATUS_STYLES[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span style={{ fontFamily: "'DM Serif Display', serif" }}
                          className="text-lg text-stone-900">
                          {fmt(order.total)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-stone-400 text-xs whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric",
                        })}
                      </td>
                    </tr>

                    {/* Product breakdown row — shown when expanded */}
                    {expanded[order._id] && order.items.map((item, idx) => (
                      <tr key={`${order._id}-${idx}`}
                        className="bg-stone-50 border-t border-stone-100">
                        <td className="pl-14 pr-6 py-2.5 text-stone-500 text-xs">
                          └ Product #{item.productId}
                        </td>
                        <td className="px-6 py-2.5 text-center text-stone-400 text-xs">
                          ×{item.quantity}
                        </td>
                        <td className="px-6 py-2.5" />
                        <td className="px-6 py-2.5 text-right text-stone-500 text-xs">
                          {fmt(item.price * item.quantity)}
                        </td>
                        <td className="px-6 py-2.5 text-center text-stone-300 text-xs">
                          ₹{item.price} each
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}