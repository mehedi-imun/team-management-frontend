import TrialBanner from "@/components/trial/TrialBanner";
import TrialExpiredModal from "@/components/trial/TrialExpiredModal";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/redux/hook";
import { useGetTeamsQuery } from "@/redux/features/team/teamApi";
import { useGetTrialStatusQuery } from "@/redux/features/trial/trialApi";
import type { ITeam } from "@/types";
import { AlertCircle, Lock, Plus, Search, Users, Filter } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
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
  const [showMyTeamsOnly, setShowMyTeamsOnly] = useState(false);

  // Get current user
  const { user } = useAppSelector((state) => state.auth);

  // Trial status
  const { data: trialResponse } = useGetTrialStatusQuery();
  const trialStatus = trialResponse?.data;
  const canCreateTeam = trialStatus?.canAccessFeatures ?? true;

  // Trial expired modal state
  const [trialExpiredModalOpen, setTrialExpiredModalOpen] = useState(false);

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

  const teams = useMemo(() => data?.data || [], [data?.data]);
  const meta = data?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };

  // Filter teams based on user role and filter selection
  const filteredTeams = useMemo(() => {
    if (!user) return teams;

    // If user is OrgMember and "My Teams" filter is active, show only teams they're in
    if (showMyTeamsOnly && user.role === "OrgMember") {
      return teams.filter((team: ITeam) =>
        team.members?.some((member) => member.userId === user._id)
      );
    }

    // For OrgOwner/OrgAdmin, show all teams
    return teams;
  }, [teams, showMyTeamsOnly, user]);

  const isOrgMember = user?.role === "OrgMember";
  const myTeamsCount = useMemo(() => {
    if (!user || !isOrgMember) return 0;
    return teams.filter((team: ITeam) =>
      team.members?.some((member) => member.userId === user._id)
    ).length;
  }, [teams, user, isOrgMember]);

  console.log("Teams data:", data);
  console.log("Teams array:", teams);
  console.log("Filtered teams:", filteredTeams);
  console.log("Meta:", meta);

  // Handle create team button click
  const handleCreateTeamClick = () => {
    if (!canCreateTeam) {
      setTrialExpiredModalOpen(true);
    } else {
      setCreateDialogOpen(true);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Trial Banner */}
      <TrialBanner />

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Teams</CardTitle>
              <CardDescription>
                Manage your organization's teams and members
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {/* Show trial status badge if on trial */}
              {trialStatus?.isOnTrial && (
                <Badge variant={trialStatus.daysLeft <= 3 ? "destructive" : "secondary"}>
                  {trialStatus.daysLeft} {trialStatus.daysLeft === 1 ? "day" : "days"} left
                </Badge>
              )}
              <Button onClick={handleCreateTeamClick} disabled={!canCreateTeam}>
                {!canCreateTeam && <Lock className="mr-2 h-4 w-4" />}
                <Plus className="mr-2 h-4 w-4" />
                Create Team
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Stats and Filter Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {filteredTeams.length} {filteredTeams.length === 1 ? "team" : "teams"}
                </span>
              </div>
              {isOrgMember && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{myTeamsCount} my teams</Badge>
                </div>
              )}
            </div>

            {/* Filter Button for OrgMember */}
            {isOrgMember && myTeamsCount > 0 && (
              <Button
                variant={showMyTeamsOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowMyTeamsOnly(!showMyTeamsOnly)}
              >
                <Filter className="mr-2 h-4 w-4" />
                {showMyTeamsOnly ? "Show All Teams" : "Show My Teams"}
              </Button>
            )}
          </div>

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

          {/* Empty state */}
          {!isLoading && !error && filteredTeams.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm
                  ? "No teams found"
                  : showMyTeamsOnly
                  ? "You're not in any teams yet"
                  : "No teams yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : showMyTeamsOnly
                  ? "Ask your organization admin to add you to a team"
                  : "Get started by creating your first team"}
              </p>
              {!showMyTeamsOnly && !searchTerm && canCreateTeam && (
                <Button onClick={handleCreateTeamClick}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Team
                </Button>
              )}
            </div>
          )}

          {/* Teams table */}
          {filteredTeams.length > 0 && (
            <>
              <DataTable columns={columns} data={filteredTeams} isLoading={isLoading} />

              {/* Pagination */}
              {!isLoading && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredTeams.length} of {meta.total} teams
                    {showMyTeamsOnly && " (filtered)"}
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
                    <span className="flex items-center px-3 text-sm">
                      Page {page} of {meta.totalPage}
                    </span>
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
            </>
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

      {/* Trial Expired Modal */}
      <TrialExpiredModal
        isOpen={trialExpiredModalOpen}
        onClose={() => setTrialExpiredModalOpen(false)}
        feature="create new teams"
      />
    </div>
  );
}
