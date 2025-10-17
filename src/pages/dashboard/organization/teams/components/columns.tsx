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
import type { ITeam } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";

export type TeamActions = {
  onEdit: (team: ITeam) => void;
  onDelete: (team: ITeam) => void;
  onViewMembers: (team: ITeam) => void;
  onAddMember: (team: ITeam) => void;
};

export const createTeamColumns = (actions: TeamActions): ColumnDef<ITeam>[] => [
  {
    accessorKey: "name",
    header: "Team Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Users className="h-4 w-4 text-primary" />
        </div>
        <div className="max-w-[200px]">
          <div className="font-semibold truncate">{row.original.name}</div>
          <div className="text-sm text-muted-foreground truncate">
            {row.original.description}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "members",
    header: "Members",
    cell: ({ row }) => {
      const count = row.original.members?.length || 0;
      return (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono">
            {count}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {count === 1 ? "member" : "members"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "managerApproved",
    header: "Manager",
    cell: ({ row }) => {
      const status = row.original.managerApproved;
      if (status === "1") {
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        );
      }
      if (status === "-1") {
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        );
      }
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    },
  },
  {
    accessorKey: "directorApproved",
    header: "Director",
    cell: ({ row }) => {
      const status = row.original.directorApproved;
      if (status === "1") {
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        );
      }
      if (status === "-1") {
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        );
      }
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = row.original.createdAt;
      if (!date) return <span className="text-muted-foreground">N/A</span>;
      return (
        <span className="text-sm">
          {new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const team = row.original;

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuLabel>Team Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(team._id)}
              >
                Copy Team ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => actions.onViewMembers(team)}>
                <Users className="mr-2 h-4 w-4" />
                View Members
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => actions.onAddMember(team)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Member
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => actions.onEdit(team)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Team
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => actions.onDelete(team)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Team
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
