import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { User } from "@/redux/features/platform/platformApi";
import { format } from "date-fns";
import {
  Building2,
  Calendar,
  FolderKanban,
  Mail,
  Shield,
  User as UserIcon,
} from "lucide-react";

interface ViewUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export function ViewUserDialog({
  open,
  onOpenChange,
  user,
}: ViewUserDialogProps) {
  if (!user) return null;

  const getRoleBadge = (
    role: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    const colors: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      SuperAdmin: "destructive",
      Admin: "default",
      Manager: "secondary",
      Director: "default",
      Member: "outline",
    };
    return colors[role] || "outline";
  };

  const getStatusBadge = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    const colors: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      active: "default",
      suspended: "destructive",
      inactive: "outline",
    };
    return colors[status] || "outline";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View detailed information about this user
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>

            <div className="flex gap-2">
              <Badge variant={getRoleBadge(user.role)}>
                {user.role === "SuperAdmin"
                  ? "SUPER ADMIN"
                  : user.role?.toUpperCase() || "N/A"}
              </Badge>
              <Badge variant={getStatusBadge(user.status || "active")}>
                {user.status?.toUpperCase() || "ACTIVE"}
              </Badge>
              {user.isOrganizationOwner && (
                <Badge variant="secondary">ORGANIZATION OWNER</Badge>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-start gap-2">
              <UserIcon className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">User ID</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {user._id}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email Address</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Role</p>
                <p className="text-sm text-muted-foreground">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Organization Info */}
          {user.organizationId && typeof user.organizationId === "object" && (
            <div className="border-t pt-4">
              <div className="flex items-start gap-2">
                <Building2 className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Organization</p>
                  <p className="text-sm text-muted-foreground">
                    {user.organizationId.name || "N/A"}
                  </p>
                  {user.isOrganizationOwner && (
                    <p className="text-xs text-muted-foreground mt-1">
                      (Organization Owner)
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Team Info */}
          <div className="border-t pt-4">
            <div className="flex items-start gap-2">
              <FolderKanban className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Teams</p>
                <p className="text-sm text-muted-foreground">
                  Member of {user.teamCount || 0} team(s)
                </p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="border-t pt-4">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Member Since</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(user.createdAt), "PPP")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
