// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Authentication from "./pages/Authentication";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import Checkout from "./pages/Checkout";
import Payment from "./pages/PaymentPage";
import ProductConfirmation from "./pages/ProductConfirmation";
import NotFound from "./pages/NotFound";
import AdminInventory from "./pages/AdminInventory";
import AdminRoute from "./components/AdminRoute";
import WeightLossPlans from "./pages/WeightLossPlans";
import MuscleBuildingPlans from "./pages/MuscleBuildingPlans";
import MobilityRecoveryPlans from "./pages/MobilityRecoveryPlans";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReports from "./pages/AdminReports";
import AdminCustomers from "./pages/AdminCustomers";
import AdminCustomerDetail from "./pages/AdminCustomerDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        // Public routes
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Authentication />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-confirmation" element={<ProductConfirmation />} />
        <Route path="/plans/weight-loss" element={<WeightLossPlans />} />
        <Route path="/plans/muscle-building" element={<MuscleBuildingPlans />} />
        <Route path="/plans/mobility-recovery" element={<MobilityRecoveryPlans />} />

        {/* Admin routes (guarded) */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <AdminReports />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <AdminRoute>
              <AdminCustomers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/customers/:userId"
          element={
            <AdminRoute>
              <AdminCustomerDetail />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/inventory"
          element={
            <AdminRoute>
              <AdminInventory />
            </AdminRoute>
          }
        />

        // Redirect unknown routes to NotFound
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
