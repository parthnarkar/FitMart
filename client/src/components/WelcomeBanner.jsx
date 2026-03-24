// src/components/WelcomeBanner.jsx
import { useEffect, useState } from "react";

export default function WelcomeBanner({ onDismiss }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setLeaving(true);
    setTimeout(() => onDismiss?.(), 350);
  };

  return (
    <div
      style={{
        transform: visible && !leaving ? "translateY(0)" : "translateY(-100%)",
        opacity: visible && !leaving ? 1 : 0,
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease",
      }}
      className="w-full bg-stone-900 px-5 lg:px-10 py-3.5 flex items-center justify-between gap-4"
    >
      {/* Left: message */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-stone-400 flex-shrink-0 text-base">✓</span>
        <p className="text-sm text-white leading-snug">
          Welcome to FitMart!{" "}
          <span className="text-stone-300">
            Enjoy{" "}
            <span
              style={{ fontFamily: "'DM Serif Display', serif" }}
              className="text-white text-base"
            >
              10% off
            </span>{" "}
            your first order — applied automatically at checkout.
          </span>
        </p>
      </div>

      {/* Right: dismiss */}
      <button
        onClick={dismiss}
        aria-label="Dismiss welcome banner"
        className="flex-shrink-0 text-stone-500 hover:text-white transition-colors
                   text-xl leading-none px-1"
      >
        ×
      </button>
    </div>
  );
}