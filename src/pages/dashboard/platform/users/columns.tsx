import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/redux/features/platform/platformApi";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Ban,
  CheckCircle,
  Crown,
  Eye,
  MoreHorizontal,
  Shield,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface ActionHandlers {
  onView: (user: User) => void;
  onChangeRole: (user: User) => void;
  onUpdateStatus: (user: User) => void;
  onDelete: (user: User) => void;
}

const getRoleBadge = (role: string) => {
  const variants: Record<
    string,
    {
      variant: BadgeVariant;
      label: string;
      icon: React.ReactElement;
      className?: string;
    }
  > = {
    SuperAdmin: {
      variant: "destructive",
      label: "Super Admin",
      icon: <Shield className="h-3 w-3" />,
    },
    Admin: {
      variant: "default",
      label: "Admin",
      icon: <ShieldCheck className="h-3 w-3" />,
    },
    OrgOwner: {
      variant: "default",
      label: "Org Owner",
      icon: <Crown className="h-3 w-3" />,
      className: "bg-yellow-500 hover:bg-yellow-600 text-white",
    },
    OrgAdmin: {
      variant: "default",
      label: "Org Admin",
      icon: <ShieldCheck className="h-3 w-3" />,
      className: "bg-blue-500 hover:bg-blue-600 text-white",
    },
    OrgMember: {
      variant: "outline",
      label: "Member",
      icon: <Users className="h-3 w-3" />,
    },
  };

  const config = variants[role] || variants.OrgMember;
  return (
    <Badge
      variant={config.variant}
      className={`text-sm px-3 py-1 flex items-center gap-1.5 w-fit ${
        config.className || ""
      }`}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
};

const getStatusBadge = (isActive: boolean) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-2.5 w-2.5 rounded-full ${
          isActive ? "bg-green-500" : "bg-gray-400"
        }`}
      />
      <span className="text-base">{isActive ? "Active" : "Inactive"}</span>
    </div>
  );
};

export const createColumns = (handlers: ActionHandlers): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div>
          <div className="font-medium text-base">{user.name}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => getRoleBadge(row.original.role),
  },
  {
    accessorKey: "organizationId",
    header: "Organization",
    cell: ({ row }) => {
      const user = row.original;

      // Platform admins (SuperAdmin, Admin) don't belong to organizations
      if (user.role === "SuperAdmin" || user.role === "Admin") {
        return (
          <Badge variant="secondary" className="text-sm px-3 py-1">
            Platform Level
          </Badge>
        );
      }

      // Handle both populated and non-populated organizationId
      const orgName =
        typeof user.organizationId === "object" && user.organizationId?.name
          ? user.organizationId.name
          : null;

      return orgName ? (
        <div>
          <div className="font-medium text-base">{orgName}</div>
          {user.role === "OrgOwner" && (
            <Badge variant="outline" className="mt-1 text-xs">
              <Crown className="h-3 w-3 mr-1" />
              Owner
            </Badge>
          )}
        </div>
      ) : (
        <span className="text-muted-foreground text-base">Not Assigned</span>
      );
    },
  },
  {
    accessorKey: "teamCount",
    header: "Teams",
    cell: ({ row }) => {
      const count = row.original.teamCount || 0;
      return (
        <div className="text-base">
          <span className="font-medium">{count}</span>
          <span className="text-muted-foreground">
            {" "}
            team{count !== 1 ? "s" : ""}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.original.isActive),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      return (
        <div className="text-base">
          {format(new Date(row.original.createdAt), "MMM dd, yyyy")}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 w-9 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-base font-semibold">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => handlers.onView(user)}
              className="text-base py-2.5"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handlers.onChangeRole(user)}
              className="text-base py-2.5"
            >
              <Shield className="mr-2 h-4 w-4" />
              Change Role
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handlers.onUpdateStatus(user)}
              className={`text-base py-2.5 ${
                user.isActive ? "text-orange-600" : "text-green-600"
              }`}
            >
              {user.isActive ? (
                <>
                  <Ban className="mr-2 h-4 w-4" />
                  Suspend
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Activate
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handlers.onDelete(user)}
              className="text-red-600 text-base py-2.5"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
