import DashboardLayout from "@/components/layout/DashboardLayout";
import PublicLayout from "@/components/layout/PublicLayout";
import { ThemeProvider } from "@/components/theme-provider";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import OrganizationsPage from "@/pages/dashboard/organizations";
import FeaturesPage from "@/pages/FeaturesPage";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import PricingPage from "@/pages/PricingPage";
import RegisterPage from "@/pages/RegisterPage";
import { useAppSelector } from "@/redux/hook";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

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
    <ThemeProvider defaultTheme="dark" storageKey="team-management-theme">
      <BrowserRouter>
        <Routes>
          {/* Public Routes with Layout */}
          <Route element={<PublicLayout />}>
            <Route
              path="/"
              element={user ? <Navigate to="/dashboard" /> : <LandingPage />}
            />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Auth Routes (no layout) */}
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" /> : <RegisterPage />}
          />

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

            {/* SuperAdmin & Admin Only Routes */}
            <Route
              path="organizations"
              element={
                <ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}>
                  <OrganizationsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
