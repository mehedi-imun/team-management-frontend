import { useAppSelector } from "@/redux/hook";
import { cn } from "@/lib/utils";
import {
  Building2,
  Users,
  LayoutDashboard,
  Settings,
  BarChart3,
  FileText,
  UserCog,
  CreditCard,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  FolderKanban,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { useNavigate } from "react-router-dom";
import { clearUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hook";
import { ModeToggle } from "@/components/mode-toggle";

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

  // Navigation items based on role
  const getNavigationItems = () => {
    const role = user?.role;
    const isOrgOwner = user?.isOrganizationOwner;
    const isOrgAdmin = user?.isOrganizationAdmin;

    const items = [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        roles: ["SuperAdmin", "Admin", "Member"],
      },
    ];

    // SuperAdmin & Admin items
    if (role === "SuperAdmin" || role === "Admin") {
      items.push(
        {
          title: "Organizations",
          icon: Building2,
          href: "/dashboard/organizations",
          roles: ["SuperAdmin", "Admin"],
        },
        {
          title: "All Users",
          icon: Users,
          href: "/dashboard/users",
          roles: ["SuperAdmin", "Admin"],
        },
        {
          title: "Platform Analytics",
          icon: BarChart3,
          href: "/dashboard/platform-analytics",
          roles: ["SuperAdmin", "Admin"],
        },
        {
          title: "System Settings",
          icon: Settings,
          href: "/dashboard/system-settings",
          roles: ["SuperAdmin"],
        }
      );
    }

    // Organization Owner & Admin items
    if (role === "Member" && (isOrgOwner || isOrgAdmin)) {
      items.push(
        {
          title: "Teams",
          icon: FolderKanban,
          href: "/dashboard/teams",
          roles: ["Member"],
        },
        {
          title: "Members",
          icon: Users,
          href: "/dashboard/members",
          roles: ["Member"],
        },
        {
          title: "Invitations",
          icon: UserCog,
          href: "/dashboard/invitations",
          roles: ["Member"],
        },
        {
          title: "Analytics",
          icon: BarChart3,
          href: "/dashboard/analytics",
          roles: ["Member"],
        }
      );

      // Only Organization Owner can access billing
      if (isOrgOwner) {
        items.push({
          title: "Billing",
          icon: CreditCard,
          href: "/dashboard/billing",
          roles: ["Member"],
        });
      }

      items.push({
        title: "Organization Settings",
        icon: Settings,
        href: "/dashboard/settings",
        roles: ["Member"],
      });
    }

    // Regular Member items
    if (role === "Member" && !isOrgOwner && !isOrgAdmin) {
      items.push(
        {
          title: "My Teams",
          icon: FolderKanban,
          href: "/dashboard/my-teams",
          roles: ["Member"],
        },
        {
          title: "Notifications",
          icon: Bell,
          href: "/dashboard/notifications",
          roles: ["Member"],
        }
      );
    }

    // Common items for all
    items.push({
      title: "Reports",
      icon: FileText,
      href: "/dashboard/reports",
      roles: ["SuperAdmin", "Admin", "Member"],
    });

    return items.filter((item) => item.roles.includes(role || "Member"));
  };

  const navigationItems = getNavigationItems();

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
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navigationItems.map((item) => {
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
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        {/* Theme Toggle */}
        <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between px-3")}>
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
