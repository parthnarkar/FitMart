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
      <span className="text-xl md:text-2xl font-medium text-stone-500">
        {(name?.[0] || "?").toUpperCase()}
      </span>
    )}
  </div>
);

const SkeletonRow = () => (
  <tr className="border-b border-stone-100">
    {[40, 10, 15, 20, 15].map((w, i) => (
      <td key={i} className="px-4 md:px-6 py-4 md:py-5">
        <div className="h-3 bg-stone-100 rounded-full animate-pulse"
          style={{ width: `${w}%`, margin: i > 0 ? "0 auto" : "0" }} />
      </td>
    ))}
  </tr>
);

// ── Mobile order card ──────────────────────────────────────────────────────
const MobileOrderCard = ({ order, expanded, onToggle }) => (
  <div className="border border-stone-100 rounded-xl overflow-hidden mb-3">
    {/* Card header — tappable */}
    <button
      onClick={() => onToggle(order._id)}
      className="w-full text-left px-4 py-4 bg-white active:bg-stone-50
                 flex items-start justify-between gap-3"
    >
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-mono text-stone-400 truncate mb-1.5">
          {order._id}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                            ${STATUS_STYLES[order.status]}`}>
            {order.status}
          </span>
          <span className="text-xs text-stone-400">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <p style={{ fontFamily: "'DM Serif Display', serif" }}
          className="text-lg text-stone-900 leading-none mb-1">
          {fmt(order.total)}
        </p>
        <p className="text-[10px] text-stone-400 whitespace-nowrap">
          {new Date(order.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
          })}
        </p>
      </div>

      <span className="text-stone-300 text-sm flex-shrink-0 mt-0.5">
        {expanded ? "▾" : "▸"}
      </span>
    </button>

    {/* Expanded items */}
    {expanded && (
      <div className="border-t border-stone-100 bg-stone-50 divide-y divide-stone-100">
        {order.items.map((item, idx) => (
          <div key={`${order._id}-${idx}`}
            className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-stone-500 truncate">
                Product #{item.productId}
              </p>
              <p className="text-[10px] text-stone-400 mt-0.5">
                ₹{item.price} each
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-stone-400">×{item.quantity}</p>
              <p className="text-xs font-medium text-stone-600 mt-0.5">
                {fmt(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-12">

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl px-4 md:px-6 py-4 md:py-5 mb-6 md:mb-8">
            <p className="text-sm text-red-600">⚠ {error}</p>
          </div>
        )}

        {/* ── Profile header ─────────────────────────────────────────────── */}
        <div className="mb-8 md:mb-10">
          <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-4 md:mb-5">
            Customer Profile
          </p>

          {loading ? (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-stone-100 animate-pulse flex-shrink-0" />
              <div className="space-y-2 flex-1 min-w-0">
                <div className="h-6 md:h-7 w-40 md:w-48 bg-stone-100 rounded-full animate-pulse" />
                <div className="h-3 w-28 md:w-32 bg-stone-100 rounded-full animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 md:gap-5">
              {/* Avatar — slightly smaller on mobile */}
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden flex-shrink-0
                              bg-stone-200 flex items-center justify-center">
                {customerPhoto ? (
                  <img
                    src={customerPhoto}
                    alt={customerName || "avatar"}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={e => { e.currentTarget.style.display = "none"; }}
                  />
                ) : (
                  <span className="text-xl md:text-2xl font-medium text-stone-500">
                    {(customerName?.[0] || "?").toUpperCase()}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                {/* Name + segment badge */}
                <div className="flex items-start md:items-center gap-2 md:gap-3 flex-wrap mb-1">
                  <h1
                    style={{ fontFamily: "'DM Serif Display', serif" }}
                    className="text-2xl sm:text-3xl md:text-4xl text-stone-900 leading-tight break-words"
                  >
                    {customerName && customerName !== "—" ? customerName : userId}
                  </h1>
                  {segment && (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize flex-shrink-0
                                      ${SEGMENT_STYLES[segment]}`}>
                      {segment}
                    </span>
                  )}
                </div>

                {/* Email — truncate on small screens */}
                {customerEmail && customerEmail !== "—" && (
                  <p className="text-sm text-stone-500 truncate">{customerEmail}</p>
                )}

                {/* UID */}
                <p className="text-[10px] text-stone-300 font-mono mt-1 truncate">{userId}</p>
              </div>
            </div>
          )}
        </div>

        {/* KPI Cards — 2 cols on mobile, 4 on sm+ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-5 mb-8 md:mb-10">
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
              className="bg-white border border-stone-200 rounded-2xl p-4 md:p-7
                            hover:border-stone-300 hover:shadow-lg transition-all duration-300">
              <p className="text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em]
                            uppercase text-stone-400 mb-3 md:mb-5 leading-tight">
                {label}
              </p>
              <div className="flex items-end justify-between gap-1">
                {loading ? (
                  <div className="h-7 md:h-9 w-16 md:w-20 bg-stone-100 rounded-xl animate-pulse" />
                ) : (
                  <p style={{ fontFamily: "'DM Serif Display', serif" }}
                    className="text-2xl md:text-3xl lg:text-4xl text-stone-900 leading-none break-words min-w-0">
                    {value}
                  </p>
                )}
                <span className="text-base md:text-xl text-stone-200 mb-0.5 flex-shrink-0">{icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Order History */}
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden
                        hover:border-stone-300 transition-all duration-300">

          {/* Section header */}
          <div className="px-4 md:px-7 py-4 md:py-5 border-b border-stone-100
                          flex justify-between items-center">
            <div>
              <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-stone-400 mb-0.5">
                History
              </p>
              <h2 style={{ fontFamily: "'DM Serif Display', serif" }}
                className="text-lg md:text-xl text-stone-900">
                Order History
              </h2>
            </div>
            {!loading && orders && (
              <p className="text-xs text-stone-400">{orders.length} orders</p>
            )}
          </div>

          {/* ── Mobile card view (< md) ─────────────────────────────────── */}
          <div className="md:hidden px-4 py-4">
            {loading && (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border border-stone-100 rounded-xl p-4 space-y-2">
                    <div className="h-3 w-3/4 bg-stone-100 rounded-full animate-pulse" />
                    <div className="h-3 w-1/2 bg-stone-100 rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
            )}
            {!loading && orders?.map(order => (
              <MobileOrderCard
                key={order._id}
                order={order}
                expanded={!!expanded[order._id]}
                onToggle={toggleOrder}
              />
            ))}
            {!loading && !orders?.length && (
              <p className="text-sm text-stone-400 text-center py-8">No orders found.</p>
            )}
          </div>

          {/* ── Desktop table view (md+) ───────────────────────────────── */}
          <div className="hidden md:block overflow-x-auto">
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

                {!loading && !orders?.length && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-stone-400">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}