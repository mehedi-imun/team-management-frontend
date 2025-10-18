import { ModeToggle } from "@/components/mode-toggle";
import { getUserRoutes } from "@/config/routes.config";
import { cn } from "@/lib/utils";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { clearUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  getUserDisplayRole,
  groupRoutes,
  mapUserRole,
} from "@/utils/navigation.helper";
import { ChevronLeft, ChevronRight, LogOut, Shield } from "lucide-react";
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

  // Get user routes dynamically based on role
  const userRole = mapUserRole(user);
  const isPlatformAdmin = user?.role === "SuperAdmin" || user?.role === "Admin";
  const userRoutes = getUserRoutes(userRole, isPlatformAdmin);
  const navigationSections = groupRoutes(userRoutes);

  const displayRole = getUserDisplayRole(user);

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 border-r border-sidebar-border",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-sidebar-primary" />
            <span className="font-bold text-lg">TeamHub</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-sidebar-border">
        {!collapsed ? (
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-semibold">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-sidebar-primary/20 text-sidebar-primary">
                {displayRole}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-10 w-10 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-semibold">
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
              <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </h3>
            )}

            {/* Section Items */}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      collapsed && "justify-center"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && (
                      <span className="text-sm">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        {/* Theme Toggle */}
        <div
          className={cn(
            "flex items-center",
            collapsed ? "justify-center" : "justify-between px-3"
          )}
        >
          {!collapsed && <span className="text-sm text-muted-foreground">Theme</span>}
          <ModeToggle />
        </div>

        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full",
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
