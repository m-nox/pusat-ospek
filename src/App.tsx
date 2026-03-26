import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { seedData } from './lib/seed';
import { ProtectedRoute } from './components/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import ProductsPage from './pages/public/ProductsPage';
import FeaturesPage from './pages/public/FeaturesPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import OrderFormPage from './pages/public/OrderFormPage';
import ThankYouPage from './pages/public/ThankYouPage';

// Auth Page
import LoginPage from './pages/auth/LoginPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import SalesManagementPage from './pages/admin/SalesManagementPage';
import LeadManagementPage from './pages/admin/LeadManagementPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import ReportsPage from './pages/admin/ReportsPage';

// Sales Pages
import SalesDashboardPage from './pages/sales/SalesDashboardPage';
import MyReferralPage from './pages/sales/MyReferralPage';
import MyLeadsPage from './pages/sales/MyLeadsPage';
import LeadDetailPage from './pages/sales/LeadDetailPage';
import PerformancePage from './pages/sales/PerformancePage';

function App() {
  useEffect(() => {
    seedData();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/order" element={<OrderFormPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
          </Route>

          {/* Auth Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboardPage />} />
            <Route path="sales" element={<SalesManagementPage />} />
            <Route path="leads" element={<LeadManagementPage />} />
            <Route path="products" element={<ProductManagementPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>

          {/* Sales Routes */}
          <Route path="/sales" element={
            <ProtectedRoute allowedRoles={['sales']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<SalesDashboardPage />} />
            <Route path="referral" element={<MyReferralPage />} />
            <Route path="leads" element={<MyLeadsPage />} />
            <Route path="leads/:id" element={<LeadDetailPage />} />
            <Route path="performance" element={<PerformancePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
