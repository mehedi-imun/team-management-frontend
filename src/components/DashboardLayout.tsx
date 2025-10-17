import {
  BarChart3,
  Building2,
  CreditCard,
  FileText,
  Home,
  LogOut,
  Mail,
  Settings,
  Users,
  UsersRound,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLogoutMutation } from "../redux/features/auth/authApi";
import { clearUser } from "../redux/features/auth/authSlice";
import type { RootState } from "../redux/store";
import { Button } from "./ui/button";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles?: string[]; // If undefined, visible to all
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Teams", href: "/teams", icon: UsersRound },
  {
    name: "Users",
    href: "/users",
    icon: Users,
    roles: ["SuperAdmin", "Admin"],
  },
  { name: "Invitations", href: "/invitations", icon: Mail },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    roles: ["SuperAdmin", "Admin"],
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FileText,
    roles: ["SuperAdmin", "Admin"],
  },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Organization", href: "/organization", icon: Building2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearUser());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      dispatch(clearUser());
      navigate("/login");
    }
  };

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter((item) => {
    if (!item.roles) return true; // No role restriction
    return user?.role && item.roles.includes(user.role);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="flex items-center gap-2 h-16 px-6 border-b border-gray-200">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="text-xl font-bold text-gray-900">TeamHub</span>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          {user?.role && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-700">
                {user.role}
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 h-16 flex items-center px-8">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {navigation.find((item) => item.href === location.pathname)
                ?.name || "Dashboard"}
            </h1>
          </div>
          {/* Quick Actions */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/teams/new")}
            >
              + New Team
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/invitations")}
            >
              + Invite Member
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
