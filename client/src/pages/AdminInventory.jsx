// src/pages/AdminInventory.jsx
import { useState, useEffect } from "react";

const LOW_STOCK_THRESHOLD = 5;
const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /*useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load inventory");
        setLoading(false);
      });
  }, []);
  */

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-stone-500">Loading inventory...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <h1 className="text-2xl font-bold text-stone-800 mb-2">
        Inventory Management
      </h1>
      <p className="text-stone-500 mb-6">
        Real-time stock levels across all products
      </p>

      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-stone-100 text-stone-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left">Product</th>
              <th className="px-6 py-4 text-left">Category</th>
              <th className="px-6 py-4 text-center">Stock</th>
              <th className="px-6 py-4 text-center">Reserved</th>
              <th className="px-6 py-4 text-center">Available</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {products.map(p => {
              const available = p.stock === null ? null : p.stock - p.reserved;
              const isLow = available !== null && available < LOW_STOCK_THRESHOLD;
              const isUnlimited = p.stock === null;

              return (
                <tr key={p.productId} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-stone-800">
                    {p.name}
                  </td>
                  <td className="px-6 py-4 text-stone-500">
                    {p.category || "—"}
                  </td>
                  <td className="px-6 py-4 text-center text-stone-700">
                    {isUnlimited ? "∞" : p.stock}
                  </td>
                  <td className="px-6 py-4 text-center text-stone-700">
                    {p.reserved}
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-stone-800">
                    {isUnlimited ? "∞" : available}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {isUnlimited ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-stone-100 text-stone-500">
                        Unlimited
                      </span>
                    ) : isLow ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-600 font-semibold">
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600 font-semibold">
                        In Stock
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}