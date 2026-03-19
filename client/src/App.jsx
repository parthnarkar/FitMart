// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Authentication from "./pages/Authentication";
import HomePage from "./pages/HomePage";
import Checkout from "./pages/Checkout";
import Payment from "./pages/PaymentPage";
import ProductConfirmation from "./pages/ProductConfirmation";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Authentication />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-confirmation" element={<ProductConfirmation />} />

        {/* ⚠️ Catchall MUST be LAST — it swallows every route below it */}
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  );
}
