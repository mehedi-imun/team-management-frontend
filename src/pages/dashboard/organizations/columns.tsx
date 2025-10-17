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
import type { Organization } from "@/redux/features/platform/platformApi";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Ban,
  CheckCircle,
  Eye,
  MoreHorizontal,
  Trash2,
  Users,
} from "lucide-react";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface ActionHandlers {
  onView: (org: Organization) => void;
  onUpdateStatus: (org: Organization) => void;
  onDelete: (org: Organization) => void;
  onManageMembers: (org: Organization) => void;
}

const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: BadgeVariant; label: string }> = {
    trial: { variant: "secondary", label: "Trial" },
    active: { variant: "default", label: "Active" },
    suspended: { variant: "destructive", label: "Suspended" },
    cancelled: { variant: "outline", label: "Cancelled" },
  };

  const config = variants[status] || variants.active;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const getPlanBadge = (plan: string) => {
  const variants: Record<string, { variant: BadgeVariant; label: string }> = {
    free: { variant: "outline", label: "Free" },
    professional: { variant: "default", label: "Professional" },
    business: { variant: "secondary", label: "Business" },
    enterprise: { variant: "default", label: "Enterprise" },
  };

  const config = variants[plan] || variants.free;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const createColumns = (
  handlers: ActionHandlers
): ColumnDef<Organization>[] => [
  {
    accessorKey: "name",
    header: "Organization",
    cell: ({ row }) => {
      const org = row.original;
      return (
        <div>
          <div className="font-medium">{org.name}</div>
          <div className="text-sm text-muted-foreground">{org.slug}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "ownerEmail",
    header: "Owner",
    cell: ({ row }) => {
      const org = row.original;
      return (
        <div>
          <div className="font-medium">{org.ownerName || "N/A"}</div>
          <div className="text-sm text-muted-foreground">{org.ownerEmail}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => getPlanBadge(row.original.plan),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.original.status),
  },
  {
    accessorKey: "currentPeriodEnd",
    header: "Subscription",
    cell: ({ row }) => {
      const endDate = row.original.currentPeriodEnd;
      return endDate ? format(new Date(endDate), "MMM dd, yyyy") : "N/A";
    },
  },
  {
    accessorKey: "currentTeamCount",
    header: "Teams",
    cell: ({ row }) => {
      const org = row.original;
      return `${org.currentTeamCount} / ${org.teamLimit}`;
    },
  },
  {
    accessorKey: "currentMemberCount",
    header: "Members",
    cell: ({ row }) => {
      const org = row.original;
      return `${org.currentMemberCount} / ${org.memberLimit}`;
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
    cell: ({ row }) => {
      const org = row.original;

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
            <DropdownMenuItem onClick={() => handlers.onView(org)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlers.onManageMembers(org)}>
              <Users className="mr-2 h-4 w-4" />
              Manage Members
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handlers.onUpdateStatus(org)}
              className={
                org.status === "active" ? "text-orange-600" : "text-green-600"
              }
            >
              {org.status === "active" ? (
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
              onClick={() => handlers.onDelete(org)}
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
