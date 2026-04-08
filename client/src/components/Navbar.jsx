// src/components/Navbar.jsx
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../auth/firebase";
import { useAuth } from "../auth/useAuth";

export default function Navbar({
  variant = "landing",
  navOpaque = true,
  onSearchToggle,
  cartCount = 0,
  onCartOpen,
  menuOpen = false,
  setMenuOpen,
  onSignOut,
}) {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const handleSignOut = async () => {
    if (onSignOut) {
      onSignOut();
    } else {
      await signOut(auth);
      navigate("/");
    }
    setMenuOpen?.(false);
  };

  const isLanding = variant === "landing";

  const positionClass = isLanding
    ? "fixed top-0 left-0 right-0 z-50"
    : "sticky top-0 z-40";

  const bgClass = isLanding
    ? navOpaque
      ? "bg-white/95 backdrop-blur-sm border-b border-stone-200 shadow-sm"
      : "bg-transparent"
    : "bg-white border-b border-stone-200";

  const logoColor = isLanding && !navOpaque ? "text-white" : "text-stone-900";
  const iconColor =
    isLanding && !navOpaque
      ? "text-white/80 hover:text-white"
      : "text-stone-500 hover:text-stone-900";

  // Keyboard handler for brand logo
  const handleBrandKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isLanding) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/home");
      }
    }
  };

  // Keyboard handler for buttons
  const handleButtonKeyDown = (callback) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  // Keyboard handler for menu toggle
  const handleMenuToggleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setMenuOpen?.((p) => !p);
    }
  };

  return (
    <nav className={`w-full ${positionClass} transition-all duration-300 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-10 h-14 sm:h-16
                      flex items-center justify-between">

        {/* ── Brand / Logo - FIXED: Now accessible ── */}
        <a
          href={isLanding ? "#top" : "/home"}
          className={`font-['DM_Serif_Display'] text-lg sm:text-xl tracking-tight
                       cursor-pointer transition-colors focus:outline-none focus:ring-2 
                       focus:ring-stone-400 focus:ring-offset-2 rounded-sm ${logoColor}`}
          onClick={(e) => {
            e.preventDefault();
            if (isLanding) {
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              navigate("/home");
            }
          }}
          onKeyDown={handleBrandKeyDown}
          aria-label="FitMart - Go to homepage"
        >
          FitMart
        </a>

        {/* ── Right side ── */}
        <div className="flex items-center gap-0.5 sm:gap-1.5">

          {/* Search icon — FIXED: Added keyboard handler */}
          {onSearchToggle && (
            <button
              onClick={onSearchToggle}
              onKeyDown={handleButtonKeyDown(onSearchToggle)}
              className={`p-2 transition-colors min-w-[40px] min-h-[40px] flex items-center
                          justify-center rounded-full focus:outline-none focus:ring-2 
                          focus:ring-stone-400 focus:ring-offset-2 ${iconColor}`}
              aria-label="Search products"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor"
                strokeWidth={1.8} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <path d="m16.5 16.5 4 4" />
              </svg>
            </button>
          )}

          {/* Cart icon — FIXED: Added keyboard handler */}
          {onCartOpen && (
            <button
              onClick={onCartOpen}
              onKeyDown={handleButtonKeyDown(onCartOpen)}
              className={`relative p-2 transition-colors min-w-[40px] min-h-[40px]
                          flex items-center justify-center rounded-full focus:outline-none 
                          focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 ${iconColor}`}
              aria-label={`Shopping cart, ${cartCount} items`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor"
                strokeWidth={1.8} viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-stone-900 text-white
                                 text-[9px] w-4 h-4 rounded-full flex items-center
                                 justify-center font-semibold"
                      aria-label={`${cartCount} items in cart`}>
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* ── Auth area ── */}
          {!authLoading && (
            <>
              {user ? (
                /* ── Logged IN: avatar + dropdown - FIXED with ARIA attributes ── */
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen?.((p) => !p)}
                    onKeyDown={handleMenuToggleKeyDown}
                    className={`flex items-center gap-1.5 sm:gap-2 border rounded-full
                                px-2 sm:px-2.5 py-1.5 hover:bg-stone-50 transition-colors ml-0.5
                                min-h-[36px] focus:outline-none focus:ring-2 
                                focus:ring-stone-400 focus:ring-offset-2
                                ${isLanding && !navOpaque
                        ? "border-white/30 hover:bg-white/10"
                        : "border-stone-200"
                      }`}
                    aria-expanded={menuOpen}
                    aria-controls="user-dropdown-menu"
                    aria-label={menuOpen ? "Close user menu" : "Open user menu"}
                  >
                    {/* Avatar */}
                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0
                                    bg-stone-200 flex items-center justify-center">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || "User avatar"}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className={`text-[11px] font-medium
                                          ${isLanding && !navOpaque
                            ? "text-stone-700"
                            : "text-stone-600"
                          }`}>
                          {(user.displayName?.[0] || user.email?.[0] || "U").toUpperCase()}
                        </span>
                      )}
                    </div>
                    {/* Name — hidden on mobile */}
                    {!isLanding && (
                      <span className="hidden sm:block text-xs text-stone-700
                                       max-w-[80px] sm:max-w-[96px] truncate">
                        {user.displayName || user.email?.split("@")[0]}
                      </span>
                    )}
                  </button>

                  {/* Dropdown - FIXED with ARIA attributes */}
                  {menuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setMenuOpen?.(false)}
                        aria-hidden="true"
                      />
                      <div 
                        id="user-dropdown-menu"
                        className="absolute right-0 top-full mt-2 w-44 sm:w-48 bg-white
                                  border border-stone-200 rounded-xl shadow-lg py-1 z-50"
                        role="menu"
                        aria-label="User menu"
                      >
                        <div className="px-4 py-2.5 border-b border-stone-100">
                          <p className="text-xs font-medium text-stone-900 truncate">
                            {user.displayName || "Account"}
                          </p>
                          <p className="text-[10px] text-stone-400 truncate mt-0.5">
                            {user.email}
                          </p>
                        </div>

                        {isLanding && (
                          <button
                            onClick={() => {
                              navigate("/home");
                              setMenuOpen?.(false);
                            }}
                            onKeyDown={handleButtonKeyDown(() => {
                              navigate("/home");
                              setMenuOpen?.(false);
                            })}
                            className="w-full text-left text-xs text-stone-700 font-medium
                                       hover:bg-stone-50 px-4 py-2.5 transition-colors
                                       min-h-[36px] focus:outline-none focus:bg-stone-50
                                       focus:ring-2 focus:ring-stone-400"
                            role="menuitem"
                          >
                            Go to Shop →
                          </button>
                        )}

                        <div className="border-t border-stone-100 mt-1">
                          <button
                            onClick={handleSignOut}
                            onKeyDown={handleButtonKeyDown(handleSignOut)}
                            className="w-full text-left text-xs text-stone-500 hover:bg-stone-50
                                       px-4 py-2.5 transition-colors min-h-[36px]
                                       focus:outline-none focus:bg-stone-50 focus:ring-2
                                       focus:ring-stone-400"
                            role="menuitem"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

              ) : (
                /* ── Logged OUT - FIXED: Added keyboard handlers ── */
                <div className="flex items-center gap-1.5 sm:gap-2 ml-0.5 sm:ml-1">
                  {/* "Sign In" text link — hidden on mobile */}
                  <button
                    onClick={() => navigate("/auth")}
                    onKeyDown={handleButtonKeyDown(() => navigate("/auth"))}
                    className={`hidden sm:block text-sm px-3 sm:px-4 py-2 transition-colors
                                 focus:outline-none focus:ring-2 focus:ring-stone-400 
                                 focus:ring-offset-2 rounded-md
                                 ${isLanding && !navOpaque
                        ? "text-white/80 hover:text-white"
                        : "text-stone-600 hover:text-stone-900"
                      }`}
                    aria-label="Sign in to your account"
                  >
                    Sign In
                  </button>
                  {/* Primary CTA */}
                  <button
                    onClick={() => navigate("/auth")}
                    onKeyDown={handleButtonKeyDown(() => navigate("/auth"))}
                    className={`text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-full
                                 transition-colors min-h-[36px] focus:outline-none 
                                 focus:ring-2 focus:ring-stone-400 focus:ring-offset-2
                                 ${isLanding && !navOpaque
                        ? "bg-white text-stone-900 hover:bg-stone-100"
                        : "bg-stone-900 text-white hover:bg-stone-700"
                      }`}
                    aria-label={isLanding ? "Get started with FitMart" : "Sign in to your account"}
                  >
                    {isLanding ? "Get Started" : "Sign In"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}