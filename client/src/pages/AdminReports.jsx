// src/pages/AdminReports.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

export default function AdminReports() {
  const [range, setRange] = useState("weekly");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/reports/sales?range=${range}`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load report data");
        setLoading(false);
      });
  }, [range]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-700 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-stone-400 text-sm">Loading report...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* ── Go to Home ── */}
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors mb-8 group"
        >
          <span className="text-lg leading-none group-hover:-translate-x-0.5 transition-transform">←</span>
          <span>Go to Home</span>
        </button>
        <div className="flex items-center justify-center py-32">
          <div className="bg-white border border-red-100 rounded-2xl px-8 py-6 text-center">
            <p className="text-red-600 text-sm font-medium">{error}</p>
            <p className="text-stone-400 text-xs mt-1">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    </div>
  );

  const { summary, revenueByDate, productPerformance } = data;

  const RANGE_LABELS = {
    daily: "Last 24 Hours",
    weekly: "Last 7 Days",
    monthly: "Last 30 Days"
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ── Go to Home ── */}
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors mb-8 group"
        >
          <span className="text-lg leading-none group-hover:-translate-x-0.5 transition-transform">←</span>
          <span>Go to Home</span>
        </button>

        {/* ── Header ── */}
        <div className="mb-8">
          <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-1">Admin</p>
          <h1 className="font-['DM_Serif_Display'] text-4xl text-stone-900 mb-1">
            Sales Reports
          </h1>
          <p className="text-sm text-stone-400">Revenue and product performance insights</p>
        </div>

        {/* ── Range Selector ── */}
        <div className="flex gap-2 mb-8 w-fit">
          {["daily", "weekly", "monthly"].map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-6 py-2.5 rounded-full text-sm capitalize transition-all duration-200 ${
                range === r
                  ? "bg-stone-900 text-white"
                  : "border border-stone-300 text-stone-500 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* ── Range label ── */}
        <p className="text-xs text-stone-400 uppercase tracking-[0.2em] mb-5">
          {RANGE_LABELS[range]}
        </p>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Revenue", value: `₹${summary.totalRevenue.toLocaleString()}` },
            { label: "Total Orders", value: summary.totalOrders },
            { label: "Avg Order Value", value: `₹${summary.avgOrderValue.toLocaleString()}` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl border border-stone-200 p-6 hover:border-stone-300 hover:shadow-lg transition-all duration-300">
              <p className="text-xs tracking-[0.15em] uppercase text-stone-400 mb-3">{label}</p>
              <p className="font-['DM_Serif_Display'] text-3xl text-stone-900">{value}</p>
            </div>
          ))}
        </div>

        {/* ── Revenue by Date Table ── */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-['DM_Serif_Display'] text-2xl text-stone-900">Revenue by Date</h2>
            <span className="text-xs text-stone-400">{revenueByDate.length} entries</span>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
            {revenueByDate.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <p className="text-stone-400 text-sm">No orders found for this period</p>
                <p className="text-stone-300 text-xs mt-1">Try switching to a wider range</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="px-6 py-4 text-left text-xs uppercase tracking-[0.15em] text-stone-400">Date</th>
                    <th className="px-6 py-4 text-center text-xs uppercase tracking-[0.15em] text-stone-400">Orders</th>
                    <th className="px-6 py-4 text-right text-xs uppercase tracking-[0.15em] text-stone-400">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {revenueByDate.map(row => (
                    <tr key={row.date} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 text-stone-700">{row.date}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-stone-100 text-stone-600 text-xs font-medium">
                          {row.orderCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-stone-900 font-medium">
                        ₹{row.totalRevenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── Product Performance Table ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-['DM_Serif_Display'] text-2xl text-stone-900">Product Performance</h2>
            <span className="text-xs text-stone-400">{productPerformance.length} products</span>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
            {productPerformance.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <p className="text-stone-400 text-sm">No product data for this period</p>
                <p className="text-stone-300 text-xs mt-1">Try switching to a wider range</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="px-6 py-4 text-left text-xs uppercase tracking-[0.15em] text-stone-400">Product</th>
                    <th className="px-6 py-4 text-center text-xs uppercase tracking-[0.15em] text-stone-400">Units Sold</th>
                    <th className="px-6 py-4 text-right text-xs uppercase tracking-[0.15em] text-stone-400">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {productPerformance.map((p, index) => (
                    <tr key={p.productId} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-500 text-xs font-medium flex items-center justify-center flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-stone-700">Product #{p.productId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-stone-600">{p.totalQuantitySold}</td>
                      <td className="px-6 py-4 text-right text-stone-900 font-medium">
                        ₹{p.totalRevenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}