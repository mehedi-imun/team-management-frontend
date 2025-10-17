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
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2, UserPlus, Users } from "lucide-react";

export type Team = {
  _id: string;
  name: string;
  description: string;
  managerId?: string;
  managerName?: string;
  memberCount: number;
  members: Array<{
    _id: string;
    email: string;
    name?: string;
    role: "TeamLead" | "Member";
    isActive: boolean;
  }>;
  managerApproved: "0" | "1" | "-1";
  directorApproved: "0" | "1" | "-1";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<Team>[] = [
  {
    accessorKey: "name",
    header: "Team Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Users className="h-4 w-4 text-blue-600" />
        </div>
        <div>
          <div className="font-semibold">{row.original.name}</div>
          <div className="text-sm text-gray-500 max-w-xs truncate">
            {row.original.description}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "managerName",
    header: "Manager",
    cell: ({ row }) => {
      const manager = row.original.managerName;
      return manager ? (
        <span className="text-sm font-medium">{manager}</span>
      ) : (
        <Badge variant="outline">No Manager</Badge>
      );
    },
  },
  {
    accessorKey: "memberCount",
    header: "Members",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Badge variant="secondary">{row.original.members.length}</Badge>
        <span className="text-xs text-gray-500">members</span>
      </div>
    ),
  },
  {
    accessorKey: "managerApproved",
    header: "Manager Approval",
    cell: ({ row }) => {
      const status = row.original.managerApproved;
      const variants: Record<string, { label: string; className: string }> = {
        "1": { label: "Approved", className: "bg-green-100 text-green-800" },
        "0": { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
        "-1": { label: "Rejected", className: "bg-red-100 text-red-800" },
      };
      const variant = variants[status] || variants["0"];
      return (
        <Badge className={variant.className} variant="outline">
          {variant.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "directorApproved",
    header: "Director Approval",
    cell: ({ row }) => {
      const status = row.original.directorApproved;
      const variants: Record<string, { label: string; className: string }> = {
        "1": { label: "Approved", className: "bg-green-100 text-green-800" },
        "0": { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
        "-1": { label: "Rejected", className: "bg-red-100 text-red-800" },
      };
      const variant = variants[status] || variants["0"];
      return (
        <Badge className={variant.className} variant="outline">
          {variant.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? "default" : "secondary"}>
        {row.original.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const team = row.original;

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(team._id)}
            >
              Copy Team ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              View Members
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Team
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Team
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
