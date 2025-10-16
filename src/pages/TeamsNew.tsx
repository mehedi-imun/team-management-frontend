import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  Download,
  ChevronDown,
  ChevronRight,
  Users,
  CheckCircle2,
  XCircle,
  Circle
} from "lucide-react";
import { toast } from "sonner";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Redux hooks
import {
  useGetAllTeamsQuery,
  useDeleteTeamMutation,
  useBulkDeleteTeamsMutation,
  useUpdateApprovalStatusMutation,
} from "../redux/features/team/teamApi";
import type { ITeam } from "../types/index";
import type { RootState } from "../redux/store";

const TeamsNew = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  
  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [expandedTeams, setExpandedTeams] = useState<string[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    teamId?: string;
    teamName?: string;
  }>({ isOpen: false });

  // API hooks
  const { data: teamsData, isLoading } = useGetAllTeamsQuery({
    searchTerm: searchQuery,
    sort: "order",
  });
  const [deleteTeam, { isLoading: isDeleting }] = useDeleteTeamMutation();
  const [bulkDeleteTeams, { isLoading: isBulkDeleting }] = useBulkDeleteTeamsMutation();
  const [updateApprovalStatus] = useUpdateApprovalStatusMutation();

  const teams = teamsData || [];
  const filteredTeams = teams.filter((team: ITeam) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers
  const handleSelectTeam = (teamId: string) => {
    setSelectedTeams(prev =>
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTeams.length === filteredTeams.length) {
      setSelectedTeams([]);
    } else {
      setSelectedTeams(filteredTeams.map((t: ITeam) => t._id));
    }
  };

  const toggleExpand = (teamId: string) => {
    setExpandedTeams(prev =>
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      await deleteTeam(teamId).unwrap();
      toast.success("Team deleted successfully");
      setDeleteDialog({ isOpen: false });
    } catch {
      toast.error("Failed to delete team");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await bulkDeleteTeams(selectedTeams).unwrap();
      toast.success(`${selectedTeams.length} team(s) deleted successfully`);
      setSelectedTeams([]);
      setDeleteDialog({ isOpen: false });
    } catch {
      toast.error("Failed to delete teams");
    }
  };

  const handleApprovalToggle = async (
    teamId: string,
    field: "managerApproved" | "directorApproved",
    currentValue: string
  ) => {
    const nextValue = currentValue === "0" ? "1" : currentValue === "1" ? "-1" : "0";
    
    try {
      await updateApprovalStatus({
        teamId,
        field,
        value: nextValue as "0" | "1" | "-1",
      }).unwrap();
      
      const fieldLabel = field === "managerApproved" ? "Manager" : "Director";
      const statusLabel = nextValue === "1" ? "approved" : nextValue === "-1" ? "rejected" : "pending";
      toast.success(`${fieldLabel} status updated to ${statusLabel}`);
    } catch {
      toast.error("Failed to update approval status");
    }
  };

  const getApprovalIcon = (value: string) => {
    switch (value) {
      case "1":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "-1":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (managerApproved: string, directorApproved: string) => {
    if (managerApproved === "1" && directorApproved === "1") {
      return <Badge className="bg-green-600">Fully Approved</Badge>;
    }
    if (managerApproved === "-1" || directorApproved === "-1") {
      return <Badge variant="destructive">Rejected</Badge>;
    }
    return <Badge variant="secondary">Pending Approval</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      Admin: "bg-purple-600",
      Manager: "bg-blue-600",
      Director: "bg-indigo-600",
      Developer: "bg-green-600",
      Designer: "bg-pink-600",
      QA: "bg-orange-600",
    };
    return <Badge className={colors[role] || "bg-gray-600"}>{role}</Badge>;
  };

  // Permission checks
  const canEdit = user?.role === "Admin" || user?.role === "Manager";
  const canDelete = user?.role === "Admin";
  const canApprove = user?.role === "Manager" || user?.role === "Director";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">
            Manage your teams, members, and approval workflow
          </p>
        </div>
        
        <div className="flex gap-2">
          {canEdit && (
            <Button onClick={() => navigate("/teams/new")}>
              <Plus className="mr-2 h-4 w-4" />
              New Team
            </Button>
          )}
          {selectedTeams.length > 0 && canDelete && (
            <Button
              variant="destructive"
              onClick={() => setDeleteDialog({ isOpen: true })}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({selectedTeams.length})
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teams.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {teams.filter((t: ITeam) => t.managerApproved === "1" && t.directorApproved === "1").length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {teams.filter((t: ITeam) => t.managerApproved === "0" || t.directorApproved === "0").length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {teams.reduce((sum: number, t: ITeam) => sum + (t.members?.length || 0), 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Loading teams...</p>
              </div>
            </div>
          ) : filteredTeams.length === 0 ? (
            <Alert>
              <AlertDescription>
                {searchQuery ? "No teams found matching your search." : "No teams yet. Create your first team to get started!"}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedTeams.length === filteredTeams.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Director</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                
                <TableBody>
                  {filteredTeams.map((team: ITeam) => (
                    <>
                      <TableRow key={team._id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedTeams.includes(team._id)}
                            onCheckedChange={() => handleSelectTeam(team._id)}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpand(team._id)}
                          >
                            {expandedTeams.includes(team._id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        
                        <TableCell className="font-medium">{team.name}</TableCell>
                        
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              canApprove &&
                              handleApprovalToggle(team._id, "managerApproved", team.managerApproved)
                            }
                            disabled={!canApprove}
                          >
                            {getApprovalIcon(team.managerApproved)}
                          </Button>
                        </TableCell>
                        
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              canApprove &&
                              handleApprovalToggle(team._id, "directorApproved", team.directorApproved)
                            }
                            disabled={!canApprove}
                          >
                            {getApprovalIcon(team.directorApproved)}
                          </Button>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{team.members?.length || 0}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {getStatusBadge(team.managerApproved, team.directorApproved)}
                        </TableCell>
                        
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                ⋮
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {canEdit && (
                                <DropdownMenuItem onClick={() => navigate(`/teams/${team._id}`)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                              )}
                              {canDelete && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() =>
                                      setDeleteDialog({
                                        isOpen: true,
                                        teamId: team._id,
                                        teamName: team.name,
                                      })
                                    }
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      
                      {/* Expanded Members Row */}
                      {expandedTeams.includes(team._id) && team.members && team.members.length > 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="bg-muted/50">
                            <div className="py-4 px-6">
                              <h4 className="font-semibold mb-3">Team Members</h4>
                              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                                {team.members.map((member, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between rounded-lg border bg-card p-3"
                                  >
                                    <div>
                                      <p className="font-medium">{member.name}</p>
                                      {member.email && (
                                        <p className="text-sm text-muted-foreground">{member.email}</p>
                                      )}
                                    </div>
                                    {getRoleBadge(member.role)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.isOpen} onOpenChange={(open) => setDeleteDialog({ isOpen: open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {deleteDialog.teamId ? "Delete Team" : "Delete Teams"}
            </DialogTitle>
            <DialogDescription>
              {deleteDialog.teamId
                ? `Are you sure you want to delete "${deleteDialog.teamName}"? This action cannot be undone.`
                : `Are you sure you want to delete ${selectedTeams.length} team(s)? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ isOpen: false })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting || isBulkDeleting}
              onClick={() =>
                deleteDialog.teamId
                  ? handleDeleteTeam(deleteDialog.teamId)
                  : handleBulkDelete()
              }
            >
              {(isDeleting || isBulkDeleting) ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamsNew;
