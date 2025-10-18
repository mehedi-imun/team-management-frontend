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
  Crown,
  FolderKanban,
  Mail,
  Shield,
  ShieldCheck,
  User as UserIcon,
  Users,
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

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
        icon: React.ReactElement;
        className?: string;
      }
    > = {
      SuperAdmin: {
        variant: "destructive",
        label: "Super Admin",
        icon: <Shield className="h-4 w-4" />,
      },
      Admin: {
        variant: "default",
        label: "Admin",
        icon: <ShieldCheck className="h-4 w-4" />,
      },
      OrgOwner: {
        variant: "default",
        label: "Organization Owner",
        icon: <Crown className="h-4 w-4" />,
        className: "bg-yellow-500 hover:bg-yellow-600 text-white",
      },
      OrgAdmin: {
        variant: "default",
        label: "Organization Admin",
        icon: <ShieldCheck className="h-4 w-4" />,
        className: "bg-blue-500 hover:bg-blue-600 text-white",
      },
      OrgMember: {
        variant: "outline",
        label: "Organization Member",
        icon: <Users className="h-4 w-4" />,
      },
    };

    const config = roleConfig[role] || roleConfig.OrgMember;
    return (
      <Badge
        variant={config.variant}
        className={`flex items-center gap-2 w-fit ${config.className || ""}`}
      >
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <UserIcon className="h-6 w-6" />
            User Details
          </DialogTitle>
          <DialogDescription className="text-base">
            Complete profile and activity information for this user
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-base text-muted-foreground">{user.email}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {getRoleBadge(user.role)}
              <Badge
                variant={user.isActive ? "default" : "destructive"}
                className="flex items-center gap-2"
              >
                <div
                  className={`h-2 w-2 rounded-full ${
                    user.isActive ? "bg-green-300" : "bg-red-300"
                  }`}
                />
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          {/* User Info */}
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-start gap-3">
              <UserIcon className="h-5 w-5 mt-1 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-base font-medium">User ID</p>
                <p className="text-sm text-muted-foreground font-mono break-all">
                  {user._id}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 mt-1 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-base font-medium">Email Address</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 mt-1 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-base font-medium">System Role</p>
                <p className="text-sm text-muted-foreground">
                  {user.role === "SuperAdmin" && "Super Administrator - Full platform access"}
                  {user.role === "Admin" && "Platform Administrator - Manage organizations"}
                  {user.role === "OrgOwner" && "Organization Owner - Full control + billing"}
                  {user.role === "OrgAdmin" && "Organization Administrator - Manage users & teams"}
                  {user.role === "OrgMember" && "Organization Member - View-only access"}
                </p>
              </div>
            </div>
          </div>

          {/* Organization Info */}
          <div className="border-t pt-4">
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 mt-1 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-base font-medium">Organization</p>
                {user.role === "SuperAdmin" || user.role === "Admin" ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-sm">
                      Platform Level User
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      (No organization affiliation)
                    </span>
                  </div>
                ) : user.organizationId && typeof user.organizationId === "object" ? (
                  <>
                    <p className="text-base text-muted-foreground mt-1">
                      {user.organizationId.name}
                    </p>
                    {user.role === "OrgOwner" && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        <Crown className="h-3 w-3 mr-1" />
                        Organization Owner
                      </Badge>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    Not assigned to any organization
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Team Info */}
          <div className="border-t pt-4">
            <div className="flex items-start gap-3">
              <FolderKanban className="h-5 w-5 mt-1 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-base font-medium">Team Membership</p>
                <p className="text-base text-muted-foreground mt-1">
                  {user.teamCount ? (
                    <>
                      Member of <span className="font-semibold">{user.teamCount}</span> team{user.teamCount !== 1 ? 's' : ''}
                    </>
                  ) : (
                    "Not a member of any teams yet"
                  )}
                </p>
                {user.managedTeamIds && user.managedTeamIds.length > 0 && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    Manages {user.managedTeamIds.length} team{user.managedTeamIds.length !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="border-t pt-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 mt-1 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-base font-medium">Member Since</p>
                <p className="text-base text-muted-foreground mt-1">
                  {format(new Date(user.createdAt), "MMMM dd, yyyy 'at' hh:mm a")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Last updated: {format(new Date(user.updatedAt), "MMM dd, yyyy")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
