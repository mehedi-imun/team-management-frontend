import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useGetTeamsQuery } from "@/redux/features/team/teamApi";
import type { ITeam } from "@/types";
import { AlertCircle, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateTeamDialog } from "../teams/CreateTeamDialog";
import { AddMemberDialog } from "./components/AddMemberDialog";
import { createTeamColumns } from "./components/columns";
import { DeleteTeamDialog } from "./components/DeleteTeamDialog";
import { EditTeamDialog } from "./components/EditTeamDialog";
import { ViewMembersDialog } from "./components/ViewMembersDialog";

export default function TeamsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    team: ITeam | null;
  }>({
    open: false,
    team: null,
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    team: ITeam | null;
  }>({
    open: false,
    team: null,
  });
  const [viewMembersDialog, setViewMembersDialog] = useState<{
    open: boolean;
    team: ITeam | null;
  }>({
    open: false,
    team: null,
  });
  const [addMemberDialog, setAddMemberDialog] = useState<{
    open: boolean;
    team: ITeam | null;
  }>({
    open: false,
    team: null,
  });

  const { toast } = useToast();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, error } = useGetTeamsQuery({
    page,
    limit: 10,
    searchTerm: debouncedSearch,
  });

  // Trial warning toast (show once)
  useEffect(() => {
    const shown = sessionStorage.getItem("trial-warning-shown");
    if (!shown) {
      const daysLeft = 5; // TODO: Get from organization context
      if (daysLeft <= 7) {
        toast({
          title: "Trial Ending Soon",
          description: `Your trial ends in ${daysLeft} days. Please upgrade your plan to continue using all features.`,
          variant: "default",
        });
        sessionStorage.setItem("trial-warning-shown", "true");
      }
    }
  }, [toast]);

  // Action handlers
  const handleEdit = (team: ITeam) => {
    setEditDialog({ open: true, team });
  };

  const handleDelete = (team: ITeam) => {
    setDeleteDialog({ open: true, team });
  };

  const handleViewMembers = (team: ITeam) => {
    setViewMembersDialog({ open: true, team });
  };

  const handleAddMember = (team: ITeam) => {
    setAddMemberDialog({ open: true, team });
  };

  const columns = createTeamColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onViewMembers: handleViewMembers,
    onAddMember: handleAddMember,
  });

  const teams = data?.data || [];
  const meta = data?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };

  console.log("Teams data:", data);
  console.log("Teams array:", teams);
  console.log("Meta:", meta);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Teams</CardTitle>
              <CardDescription>
                Manage your organization's teams and members
              </CardDescription>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Error state */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load teams. Please try again later.
              </AlertDescription>
            </Alert>
          )}

          {/* Teams table */}
          <DataTable columns={columns} data={teams} isLoading={isLoading} />

          {/* Pagination */}
          {!isLoading && teams.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {teams.length} of {meta.total} teams
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= meta.totalPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateTeamDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
      <EditTeamDialog
        team={editDialog.team}
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ open, team: null })}
      />
      <DeleteTeamDialog
        team={deleteDialog.team}
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, team: null })}
      />
      <ViewMembersDialog
        team={viewMembersDialog.team}
        open={viewMembersDialog.open}
        onOpenChange={(open) => setViewMembersDialog({ open, team: null })}
      />
      <AddMemberDialog
        team={addMemberDialog.team}
        open={addMemberDialog.open}
        onOpenChange={(open) => setAddMemberDialog({ open, team: null })}
      />
    </div>
  );
}
