import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAppSelector } from "@/redux/hook";
import PublicLayout from "@/components/layout/PublicLayout";
import LandingPage from "@/pages/LandingPage";
import FeaturesPage from "@/pages/FeaturesPage";
import PricingPage from "@/pages/PricingPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with Layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Auth Routes (no layout) */}
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
