import DashboardLayout from "@/components/layout/DashboardLayout";
import PublicLayout from "@/components/layout/PublicLayout";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";

// Auth Pages
import AcceptInvitationPage from "@/pages/AcceptInvitationPage";
import ChangePasswordPage from "@/pages/ChangePasswordPage";

// Platform Pages (SuperAdmin/Admin)
import PlatformAnalyticsPage from "@/pages/dashboard/platform/analytics";
import OrganizationsPage from "@/pages/dashboard/platform/organizations";
import ReportsPage from "@/pages/dashboard/platform/reports";
import PlatformSettingsPage from "@/pages/dashboard/platform/settings";
import UsersPage from "@/pages/dashboard/platform/users";

// Organization Pages (Org Owner/Member)
import DashboardPage from "@/pages/dashboard/DashboardPage";
import OrganizationAnalyticsPage from "@/pages/dashboard/organization/analytics";
import BillingPage from "@/pages/dashboard/organization/billing";
import MembersPage from "@/pages/dashboard/organization/members";
import OrganizationOverviewPage from "@/pages/dashboard/organization/overview";
import OrgSettingsPage from "@/pages/dashboard/organization/settings";
import TeamsPage from "@/pages/dashboard/organization/teams/TeamsPage";

import FeaturesPage from "@/pages/FeaturesPage";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import PricingPage from "@/pages/PricingPage";
import RegisterPage from "@/pages/RegisterPage";
import ThemePreview from "@/pages/ThemePreview";
import { useAppSelector } from "@/redux/hook";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, mustChangePassword } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user must change password, redirect to change password page
  // But allow access to the change-password page itself
  if (mustChangePassword && location.pathname !== "/change-password") {
    return <Navigate to="/change-password" replace />;
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
            <Route path="/theme-preview" element={<ThemePreview />} />
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

          {/* Password Change Route - Requires authentication */}
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePasswordPage />
              </ProtectedRoute>
            }
          />

          {/* Public Invitation Accept Route - No authentication required */}
          <Route
            path="/accept-invitation/:token"
            element={<AcceptInvitationPage />}
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
            {/* Main Dashboard - Auto redirects based on role */}
            <Route index element={<DashboardPage />} />

            {/* Platform Admin Routes - Grouped under /platform prefix */}
            <Route path="platform">
              <Route
                path="analytics"
                element={
                  <ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}>
                    <PlatformAnalyticsPage />
                  </ProtectedRoute>
                }
              />
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
                path="reports"
                element={
                  <ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}>
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="settings"
                element={
                  <ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}>
                    <PlatformSettingsPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Organization Routes - Grouped under /org prefix */}
            <Route path="org">
              <Route path="overview" element={<OrganizationOverviewPage />} />
              <Route path="members" element={<MembersPage />} />
              <Route path="teams" element={<TeamsPage />} />
              <Route path="billing" element={<BillingPage />} />
              <Route path="analytics" element={<OrganizationAnalyticsPage />} />
              <Route path="settings" element={<OrgSettingsPage />} />
            </Route>

            {/* Backward Compatibility - Old Routes (Optional - can remove after migration) */}
            <Route
              path="teams"
              element={<Navigate to="/dashboard/org/teams" replace />}
            />
            <Route
              path="members"
              element={<Navigate to="/dashboard/org/members" replace />}
            />
            <Route
              path="billing"
              element={<Navigate to="/dashboard/org/billing" replace />}
            />
            <Route
              path="org-settings"
              element={<Navigate to="/dashboard/org/settings" replace />}
            />
            <Route
              path="org-analytics"
              element={<Navigate to="/dashboard/org/analytics" replace />}
            />
            <Route
              path="organizations"
              element={
                <Navigate to="/dashboard/platform/organizations" replace />
              }
            />
            <Route
              path="users"
              element={<Navigate to="/dashboard/platform/users" replace />}
            />
            <Route
              path="platform-analytics"
              element={<Navigate to="/dashboard/platform/analytics" replace />}
            />
            <Route
              path="settings"
              element={<Navigate to="/dashboard/platform/settings" replace />}
            />
            <Route
              path="reports"
              element={<Navigate to="/dashboard/platform/reports" replace />}
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
