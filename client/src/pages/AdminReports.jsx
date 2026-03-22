// src/pages/AdminReports.jsx
import { useState, useEffect } from "react";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

export default function AdminReports() {
  const [range, setRange] = useState("weekly");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <div className="w-8 h-8 border-4 border-stone-300 border-t-stone-700 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-stone-500 text-sm">Loading report...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="bg-white border border-red-200 rounded-xl px-8 py-6 text-center">
        <p className="text-red-500 font-medium">{error}</p>
        <p className="text-stone-400 text-sm mt-1">Please try refreshing the page</p>
      </div>
    </div>
  );

  const { summary, revenueByDate, productPerformance } = data;

  const RANGE_LABELS = { daily: "Last 24 Hours", weekly: "Last 7 Days", monthly: "Last 30 Days" };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-800 mb-1">Sales Reports</h1>
          <p className="text-stone-400">Revenue and product performance insights</p>
        </div>

        {/* Range Selector */}
        <div className="flex gap-2 mb-8 bg-white border border-stone-200 rounded-xl p-1.5 w-fit">
          {["daily", "weekly", "monthly"].map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                range === r
                  ? "bg-stone-800 text-white shadow-sm"
                  : "text-stone-500 hover:text-stone-700 hover:bg-stone-50"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Range label */}
        <p className="text-xs text-stone-400 uppercase tracking-widest font-medium mb-4">
          {RANGE_LABELS[range]}
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-sm transition-shadow">
            <p className="text-stone-400 text-xs uppercase tracking-wider mb-3">Total Revenue</p>
            <p className="text-3xl font-bold text-stone-800">
              ₹{summary.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-sm transition-shadow">
            <p className="text-stone-400 text-xs uppercase tracking-wider mb-3">Total Orders</p>
            <p className="text-3xl font-bold text-stone-800">{summary.totalOrders}</p>
          </div>
          <div className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-sm transition-shadow">
            <p className="text-stone-400 text-xs uppercase tracking-wider mb-3">Avg Order Value</p>
            <p className="text-3xl font-bold text-stone-800">
              ₹{summary.avgOrderValue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Revenue by Date Table */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-stone-700">Revenue by Date</h2>
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
                  <tr className="border-b border-stone-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-stone-400 uppercase tracking-wider">Orders</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-stone-400 uppercase tracking-wider">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {revenueByDate.map(row => (
                    <tr key={row.date} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 text-stone-700 font-medium">{row.date}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-stone-100 text-stone-600 text-xs font-semibold">
                          {row.orderCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-stone-800">
                        ₹{row.totalRevenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Product Performance Table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-stone-700">Product Performance</h2>
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
                  <tr className="border-b border-stone-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-400 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-stone-400 uppercase tracking-wider">Units Sold</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-stone-400 uppercase tracking-wider">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {productPerformance.map((p, index) => (
                    <tr key={p.productId} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-500 text-xs font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="text-stone-700 font-medium">Product #{p.productId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-stone-600 font-medium">{p.totalQuantitySold}</td>
                      <td className="px-6 py-4 text-right font-semibold text-stone-800">
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
