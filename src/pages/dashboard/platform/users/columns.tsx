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
  Eye,
  MoreHorizontal,
  Shield,
  Trash2,
} from "lucide-react";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface ActionHandlers {
  onView: (user: User) => void;
  onChangeRole: (user: User) => void;
  onUpdateStatus: (user: User) => void;
  onDelete: (user: User) => void;
}

const getRoleBadge = (role: string) => {
  const variants: Record<string, { variant: BadgeVariant; label: string }> = {
    SuperAdmin: { variant: "destructive", label: "Super Admin" },
    Admin: { variant: "default", label: "Admin" },
    Manager: { variant: "secondary", label: "Manager" },
    Director: { variant: "default", label: "Director" },
    Member: { variant: "outline", label: "Member" },
  };

  const config = variants[role] || variants.Member;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: BadgeVariant; label: string }> = {
    active: { variant: "default", label: "Active" },
    suspended: { variant: "destructive", label: "Suspended" },
    inactive: { variant: "outline", label: "Inactive" },
  };

  const config = variants[status] || variants.active;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const createColumns = (handlers: ActionHandlers): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div>
          <div className="font-medium">{user.name}</div>
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.original.status),
  },
  {
    accessorKey: "organizationId",
    header: "Organization",
    cell: ({ row }) => {
      const user = row.original;
      // Handle both populated and non-populated organizationId
      const orgName =
        typeof user.organizationId === "object" && user.organizationId?.name
          ? user.organizationId.name
          : null;

      return orgName ? (
        <div>
          <div className="font-medium">{orgName}</div>
          {user.isOrganizationOwner && (
            <Badge variant="outline" className="mt-1">
              Owner
            </Badge>
          )}
        </div>
      ) : (
        <span className="text-muted-foreground">No Organization</span>
      );
    },
  },
  {
    accessorKey: "teamCount",
    header: "Teams",
    cell: ({ row }) => {
      return row.original.teamCount || 0;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      return format(new Date(row.original.createdAt), "MMM dd, yyyy");
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
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handlers.onView(user)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlers.onChangeRole(user)}>
              <Shield className="mr-2 h-4 w-4" />
              Change Role
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handlers.onUpdateStatus(user)}
              className={
                user.status === "active" ? "text-orange-600" : "text-green-600"
              }
            >
              {user.status === "active" ? (
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
              className="text-red-600"
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
