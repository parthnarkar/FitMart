import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../auth/firebase";
import { useAuth } from "../auth/useAuth";
import { useState } from "react";

// AdminNavbar: shows brand + "ADMIN" label, optional range buttons, and profile dropdown
export default function AdminNavbar({ range, setRange, menuOpen, setMenuOpen }) {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const handleSignOut = async () => {
    await signOut(auth);
    setMenuOpen?.(false);
    navigate("/");
  };

  const ranges = [
    { key: "today", label: "Today" },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
  ];

  return (
    <div className="bg-white border-b border-stone-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/admin/dashboard")}>
          <span style={{ fontFamily: "'DM Serif Display', serif" }}
            className="text-xl text-stone-900 tracking-tight cursor-pointer"
          >
            FitMart
          </span>
          <div className="h-4 w-px bg-stone-200" />
          <p className="text-xs tracking-[0.2em] uppercase text-stone-400">Admin</p>
        </div>

        <div className="flex items-center gap-2">
          {setRange && range !== undefined ? (
            ranges.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setRange(key)}
                className={`text-xs px-4 py-2 rounded-full transition-all cursor-pointer ${range === key
                  ? "bg-stone-900 text-white"
                  : "border border-stone-200 text-stone-600 hover:bg-stone-100"
                  }`}
              >
                {label}
              </button>
            ))
          ) : (
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="border border-stone-200 text-stone-600 text-xs px-5 py-2 rounded-full hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all cursor-pointer"
            >
              ← Go to Dashboard
            </button>
          )}

          {/* Profile dropdown (mirrors Navbar behaviour) */}
          {!authLoading && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen?.((p) => !p)}
                className="flex items-center gap-2 border rounded-full px-2.5 py-1.5 hover:bg-stone-50 transition-colors ml-1 border-stone-200 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-stone-200 flex items-center justify-center">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || "avatar"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-[11px] font-medium text-stone-600">{(user?.displayName?.[0] || user?.email?.[0] || "U").toUpperCase()}</span>
                  )}
                </div>
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen?.(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-stone-200 rounded-xl shadow-lg py-1 z-50">
                    <div className="px-4 py-2.5 border-b border-stone-100">
                      <p className="text-xs font-medium text-stone-900 truncate">{user?.displayName || 'Account'}</p>
                      <p className="text-[10px] text-stone-400 truncate mt-0.5">{user?.email}</p>
                    </div>
                    <div className="border-t border-stone-100 mt-1">
                      <button onClick={handleSignOut} className="w-full text-left text-xs text-stone-500 hover:bg-stone-50 px-4 py-2 transition-colors cursor-pointer">Sign Out</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
