// src/auth/useWelcomeDiscount.js
// Handles the full first-login banner + discount lifecycle.
// Import this hook in HomePage — it talks to /api/user/login once per login session.

import { useState, useEffect, useRef } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function useWelcomeDiscount(user) {
  const [showBanner, setShowBanner] = useState(false);
  const [discountEligible, setDiscountEligible] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(10);
  const calledRef = useRef(false);   // prevent double-call in React StrictMode

  useEffect(() => {
    if (!user || calledRef.current) return;
    calledRef.current = true;

    (async () => {
      try {
        const res = await fetch(`${API}/api/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ userId: user.uid }),
        });
        if (!res.ok) return;
        const data = await res.json();

        if (data.showBanner && !data.discountUsed) {
          setShowBanner(true);
          setDiscountEligible(true);
          setDiscountPercent(data.discountPercent ?? 10);
        }
      } catch (err) {
        console.error("useWelcomeDiscount error:", err);
      }
    })();
  }, [user]);

  const dismissBanner = async () => {
    setShowBanner(false);
    if (!user) return;
    try {
      await fetch(`${API}/api/user/dismiss-banner`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: user.uid }),
      });
    } catch (err) {
      console.error("dismissBanner error:", err);
    }
  };

  return { showBanner, discountEligible, discountPercent, dismissBanner };
}