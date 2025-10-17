import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { clearUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  BarChart3,
  Bell,
  Building2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearUser());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getUserRole = () => {
    if (!user) return "Member";
    if (user.role === "SuperAdmin") return "SuperAdmin";
    if (user.role === "Admin") return "Admin";
    if (user.isOrganizationOwner) return "Organization Owner";
    if (user.isOrganizationAdmin) return "Organization Admin";
    return "Member";
  };

  // Navigation items based on role - Scalable Structure
  const getNavigationItems = () => {
    const role = user?.role;
    const isOrgOwner = user?.isOrganizationOwner;
    const isOrgAdmin = user?.isOrganizationAdmin;
    const isAdmin = role === "SuperAdmin" || role === "Admin";
    const hasMemberRole = role === "Member";

    type NavigationItem = {
      title: string;
      icon: React.ComponentType<{ className?: string }>;
      href: string;
      condition: boolean;
    };

    const sections: {
      title: string;
      items: NavigationItem[];
    }[] = [];

    // Main Dashboard (Everyone)
    sections.push({
      title: "",
      items: [
        {
          title: "Dashboard",
          icon: LayoutDashboard,
          href: "/dashboard",
          condition: true,
        },
      ],
    });

    // Platform Admin Section (SuperAdmin & Admin)
    if (isAdmin) {
      sections.push({
        title: "Platform",
        items: [
          {
            title: "Analytics",
            icon: BarChart3,
            href: "/dashboard/platform/analytics",
            condition: true,
          },
          {
            title: "Organizations",
            icon: Building2,
            href: "/dashboard/platform/organizations",
            condition: true,
          },
          {
            title: "All Users",
            icon: Users,
            href: "/dashboard/platform/users",
            condition: true,
          },
          {
            title: "Reports",
            icon: FileText,
            href: "/dashboard/platform/reports",
            condition: true,
          },
          {
            title: "Settings",
            icon: Settings,
            href: "/dashboard/platform/settings",
            condition: true,
          },
        ],
      });
    }

    // Organization Section (Org Owner & Admin)
    if (hasMemberRole && (isOrgOwner || isOrgAdmin)) {
      sections.push({
        title: "Organization",
        items: [
          {
            title: "Overview",
            icon: LayoutDashboard,
            href: "/dashboard/org/overview",
            condition: true,
          },
          {
            title: "Members",
            icon: Users,
            href: "/dashboard/org/members",
            condition: true,
          },
          {
            title: "Teams",
            icon: FolderKanban,
            href: "/dashboard/org/teams",
            condition: true,
          },
          {
            title: "Analytics",
            icon: BarChart3,
            href: "/dashboard/org/analytics",
            condition: true,
          },
          {
            title: "Billing",
            icon: CreditCard,
            href: "/dashboard/org/billing",
            condition: Boolean(isOrgOwner), // Only owner can access billing
          },
          {
            title: "Settings",
            icon: Settings,
            href: "/dashboard/org/settings",
            condition: true,
          },
        ],
      });
    }

    // Regular Member Section (No org ownership)
    if (hasMemberRole && !isOrgOwner && !isOrgAdmin) {
      sections.push({
        title: "My Workspace",
        items: [
          {
            title: "My Teams",
            icon: FolderKanban,
            href: "/dashboard/my-teams",
            condition: true,
          },
          {
            title: "Notifications",
            icon: Bell,
            href: "/dashboard/notifications",
            condition: true,
          },
        ],
      });
    }

    return sections;
  };

  const navigationSections = getNavigationItems();

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-gray-900 text-gray-100 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="font-bold text-lg">TeamHub</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-800">
        {!collapsed ? (
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                {getUserRole()}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
              {user?.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-4">
        {navigationSections.map((section, sectionIdx) => (
          <div key={sectionIdx}>
            {/* Section Title */}
            {section.title && !collapsed && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </h3>
            )}

            {/* Section Items */}
            <div className="space-y-1">
              {section.items
                .filter((item) => item.condition)
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                        isActive
                          ? "bg-primary text-white"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white",
                        collapsed && "justify-center"
                      )}
                      title={collapsed ? item.title : undefined}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        {/* Theme Toggle */}
        <div
          className={cn(
            "flex items-center",
            collapsed ? "justify-center" : "justify-between px-3"
          )}
        >
          {!collapsed && <span className="text-sm text-gray-400">Theme</span>}
          <ModeToggle />
        </div>

        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-red-600/10 hover:text-red-500 transition-colors w-full",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
