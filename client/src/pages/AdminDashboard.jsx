import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

// ── Helpers ────────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

const STATUS_STYLES = {
  paid: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  created: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  failed: "bg-red-500/15 text-red-400 border border-red-500/30",
};

// ── Sub-components ─────────────────────────────────────────────────────────
const KPICard = ({ label, value, sub, icon, accent }) => (
  <div
    className="relative overflow-hidden rounded-2xl p-6 flex flex-col gap-3"
    style={{ background: "var(--card)", border: "1px solid var(--border)" }}
  >
    {/* accent glow */}
    <div
      className="absolute -top-6 -right-6 w-28 h-28 rounded-full blur-2xl opacity-20"
      style={{ background: accent }}
    />
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
      style={{ background: accent + "22", border: `1px solid ${accent}44` }}
    >
      {icon}
    </div>
    <div>
      <p className="text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
        {value}
      </p>
      <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
    </div>
    {sub && (
      <p className="text-xs" style={{ color: "var(--text-muted)", opacity: 0.7 }}>
        {sub}
      </p>
    )}
  </div>
);

const SectionCard = ({ title, children }) => (
  <div
    className="rounded-2xl p-6"
    style={{ background: "var(--card)", border: "1px solid var(--border)" }}
  >
    <h2 className="text-sm font-semibold uppercase tracking-widest mb-5" style={{ color: "var(--text-muted)" }}>
      {title}
    </h2>
    {children}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-4 py-3 text-sm shadow-xl" style={{ background: "var(--card-hover)", border: "1px solid var(--border)" }}>
      <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === "revenue" ? fmt(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [range, setRange] = useState("month");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/dashboard?range=${range}`);
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [range]);

  return (
    <>
      {/* ── Global Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --bg: #0a0c10;
          --card: #10131a;
          --card-hover: #161a24;
          --border: #1e2433;
          --text-primary: #eef0f6;
          --text-muted: #6b7694;
          --accent-green: #00e5a0;
          --accent-blue: #3b82f6;
          --accent-orange: #f97316;
          --accent-purple: #a855f7;
          --accent-red: #ef4444;
        }

        .fitmart-dash * { box-sizing: border-box; }
        .fitmart-dash { font-family: 'DM Sans', sans-serif; background: var(--bg); min-height: 100vh; color: var(--text-primary); }
        .fitmart-dash h1, .fitmart-dash h2, .fitmart-dash .font-bold { font-family: 'Syne', sans-serif; }

        .range-btn {
          padding: 6px 18px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-muted);
          font-size: 13px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
        }
        .range-btn:hover { border-color: var(--accent-green); color: var(--text-primary); }
        .range-btn.active {
          background: var(--accent-green);
          border-color: var(--accent-green);
          color: #0a0c10;
          font-weight: 600;
        }

        .skeleton {
          background: linear-gradient(90deg, var(--card) 25%, var(--card-hover) 50%, var(--card) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 12px;
        }
        @keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }

        .fade-in { animation: fadeIn 0.4s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="fitmart-dash p-6 md:p-10">
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🏋️</span>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--accent-green)" }}>
                FitMart Admin
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Command Center
            </h1>
          </div>

          {/* Range Filter */}
          <div className="flex gap-2">
            {["today", "week", "month"].map((r) => (
              <button
                key={r}
                className={`range-btn ${range === r ? "active" : ""}`}
                onClick={() => setRange(r)}
              >
                {r === "today" ? "Today" : r === "week" ? "This Week" : "This Month"}
              </button>
            ))}
          </div>
        </div>

        {/* ── Error State ── */}
        {error && (
          <div className="rounded-2xl p-5 mb-8 text-sm" style={{ background: "#ef444415", border: "1px solid #ef444440", color: "#ef4444" }}>
            ⚠️ {error} — make sure the backend server is running.
          </div>
        )}

        {/* ── Loading Skeletons ── */}
        {loading && (
          <div className="fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-36" />)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="skeleton h-64" />
              <div className="skeleton h-64" />
            </div>
            <div className="skeleton h-64" />
          </div>
        )}

        {/* ── Dashboard Content ── */}
        {!loading && data && (
          <div className="fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <KPICard
                label="Total Revenue"
                value={fmt(data.kpis.totalRevenue)}
                icon="💰"
                accent="var(--accent-green)"
              />
              <KPICard
                label="Total Orders"
                value={data.kpis.totalOrders.toLocaleString()}
                icon="📦"
                accent="var(--accent-blue)"
              />
              <KPICard
                label="Customers"
                value={data.kpis.totalCustomers.toLocaleString()}
                icon="👥"
                accent="var(--accent-purple)"
              />
              <KPICard
                label="Low on Stock"
                value={data.kpis.lowStockCount}
                sub="Products below 10 units"
                icon="⚠️"
                accent="var(--accent-orange)"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Revenue Over Time */}
              <SectionCard title="Revenue Over Time">
                {data.revenueOverTime.length === 0 ? (
                  <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>No data for this period</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={data.revenueOverTime} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00e5a0" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#00e5a0" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e2433" />
                      <XAxis dataKey="date" tick={{ fill: "#6b7694", fontSize: 11 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fill: "#6b7694", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="revenue" name="revenue" stroke="#00e5a0" strokeWidth={2} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 4, fill: "#00e5a0" }} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </SectionCard>

              {/* Top 5 Products */}
              <SectionCard title="Top 5 Selling Products">
                {data.topProducts.length === 0 ? (
                  <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>No data for this period</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data.topProducts} layout="vertical" margin={{ top: 0, right: 4, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e2433" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "#6b7694", fontSize: 11 }} tickLine={false} axisLine={false} />
                      <YAxis dataKey="name" type="category" tick={{ fill: "#6b7694", fontSize: 11 }} tickLine={false} axisLine={false} width={100} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="totalQuantity" name="Units Sold" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </SectionCard>
            </div>

            {/* Recent Orders Table */}
            <SectionCard title="Recent Orders">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      {["Order ID", "Customer", "Items", "Total", "Status", "Date"].map((h) => (
                        <th key={h} className="pb-3 text-left font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center" style={{ color: "var(--text-muted)" }}>
                          No recent orders
                        </td>
                      </tr>
                    ) : (
                      data.recentOrders.map((order, i) => (
                        <tr
                          key={order._id}
                          className="transition-colors"
                          style={{
                            borderBottom: i < data.recentOrders.length - 1 ? "1px solid var(--border)" : "none",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--card-hover)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <td className="py-3 pr-4 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                            #{order._id?.slice(-6).toUpperCase()}
                          </td>
                          <td className="py-3 pr-4" style={{ color: "var(--text-primary)" }}>
                            {order.userId?.slice(0, 12)}…
                          </td>
                          <td className="py-3 pr-4" style={{ color: "var(--text-muted)" }}>
                            {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                          </td>
                          <td className="py-3 pr-4 font-semibold" style={{ color: "var(--accent-green)" }}>
                            {fmt(order.total)}
                          </td>
                          <td className="py-3 pr-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status]}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3" style={{ color: "var(--text-muted)" }}>
                            {fmtDate(order.createdAt)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </div>
        )}
      </div>
    </>
  );
}