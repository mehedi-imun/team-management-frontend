import DashboardLayout from "@/components/layout/DashboardLayout";
import PublicLayout from "@/components/layout/PublicLayout";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import PlatformAnalyticsPage from "@/pages/dashboard/analytics";
import OrganizationAnalyticsPage from "@/pages/dashboard/org-analytics";
import BillingPage from "@/pages/dashboard/billing";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import MembersPage from "@/pages/dashboard/members";
import OrganizationsPage from "@/pages/dashboard/organizations";
import ReportsPage from "@/pages/dashboard/reports";
import SettingsPage from "@/pages/dashboard/settings";
import OrgSettingsPage from "@/pages/dashboard/settings/OrgSettingsPage";
import TeamsPage from "@/pages/dashboard/teams/TeamsPage";
import UsersPage from "@/pages/dashboard/users";
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

            {/* Teams - Available for all authenticated users */}
            <Route path="teams" element={<TeamsPage />} />

            {/* Organization Owner */}
            <Route path="members" element={<MembersPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="org-settings" element={<OrgSettingsPage />} />
            <Route path="org-analytics" element={<OrganizationAnalyticsPage />} />

            {/* SuperAdmin & Admin Only Routes */}
            <Route
              path="organizations"
              element={
                <ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}>
                  <OrganizationsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="users"
              element={
                <ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}>
                  <UsersPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="platform-analytics"
              element={
                <ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}>
                  <PlatformAnalyticsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="settings"
              element={
                <ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="reports"
              element={
                <ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
