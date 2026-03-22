// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Authentication from "./pages/Authentication";
import HomePage from "./pages/HomePage";
import Checkout from "./pages/Checkout";
import Payment from "./pages/PaymentPage";
import ProductConfirmation from "./pages/ProductConfirmation";
import NotFound from "./pages/NotFound";
import AdminInventory from "./pages/AdminInventory";
import WeightLossPlans from "./pages/WeightLossPlans";
import MuscleBuildingPlans from "./pages/MuscleBuildingPlans";
import MobilityRecoveryPlans from "./pages/MobilityRecoveryPlans";
import AdminDashboard from './pages/AdminDashboard';
import AdminReports from "./pages/AdminReports";

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
        <Route path="/admin/inventory" element={<AdminInventory />} />
        <Route path="/plans/weight-loss" element={<WeightLossPlans />} />
        <Route path="/plans/muscle-building" element={<MuscleBuildingPlans />} />
        <Route path="/plans/mobility-recovery" element={<MobilityRecoveryPlans />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/reports" element={<AdminReports />} />

        {/* ⚠️ Catchall MUST be LAST — it swallows every route below it */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
