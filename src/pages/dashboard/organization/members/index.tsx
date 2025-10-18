import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetMyOrganizationStatsQuery,
  useGetOrganizationMembersQuery,
  useInviteMemberMutation,
  useRemoveMemberMutation,
  useUpdateMemberStatusMutation,
  type OrganizationMember,
} from "@/redux/features/organization/organizationApi";
import type { RootState } from "@/redux/store";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  UserCheck,
  UserCog,
  UserMinus,
  UserX,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function MembersPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] =
    useState<OrganizationMember | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");

  // Get current user's organization ID
  const user = useSelector((state: RootState) => state.auth.user);
  const organizationId = user?.organizationId;

  // Fetch data
  const { data: membersData, isLoading: isMembersLoading } =
    useGetOrganizationMembersQuery(
      {
        organizationId: organizationId || "",
        page,
        limit: 10,
        search: searchTerm,
      },
      {
        skip: !organizationId, // Skip query if no organization ID
      }
    );

  const { data: statsResponse, isLoading: isStatsLoading } =
    useGetMyOrganizationStatsQuery(undefined, {
      skip: !organizationId,
      refetchOnMountOrArgChange: true, // Force fresh data on mount
    });

  // Backend returns { success: true, data: {...} } format
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stats = (statsResponse as any)?.data || statsResponse;

  console.log("📊 Full Stats Response:", statsResponse);
  console.log("📊 Extracted Stats:", stats);
  console.log("📊 Has totalMembers?", "totalMembers" in (stats || {}));
  console.log(
    "📊 Has totalOrganizations?",
    "totalOrganizations" in (stats || {})
  );
  // Mutations
  const [inviteMember, { isLoading: isInviting }] = useInviteMemberMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateMemberStatusMutation();
  const [removeMember, { isLoading: isRemoving }] = useRemoveMemberMutation();

  const members = membersData?.data || [];
  const meta = membersData?.meta;

  // Handlers
  const handleInvite = async () => {
    if (!inviteEmail || !inviteName) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await inviteMember({
        email: inviteEmail,
        name: inviteName,
        role: inviteRole,
      }).unwrap();
      toast.success("Member invited successfully");
      setIsInviteDialogOpen(false);
      setInviteEmail("");
      setInviteName("");
      setInviteRole("Member");
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to invite member");
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedMember || !selectedMember.userId) {
      toast.error("Invalid member selected");
      return;
    }

    try {
      await updateStatus({
        userId: selectedMember.userId,
        isActive: !selectedMember.isActive,
      }).unwrap();
      toast.success(
        `Member ${
          selectedMember.isActive ? "deactivated" : "activated"
        } successfully`
      );
      setIsStatusDialogOpen(false);
      setSelectedMember(null);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update member status");
    }
  };

  const handleRemove = async () => {
    if (!selectedMember || !selectedMember.userId) {
      toast.error("Invalid member selected");
      return;
    }

    try {
      await removeMember(selectedMember.userId).unwrap();
      toast.success("Member removed successfully");
      setIsRemoveDialogOpen(false);
      setSelectedMember(null);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to remove member");
    }
  };

  const openStatusDialog = (member: OrganizationMember) => {
    setSelectedMember(member);
    setIsStatusDialogOpen(true);
  };

  const openRemoveDialog = (member: OrganizationMember) => {
    setSelectedMember(member);
    setIsRemoveDialogOpen(true);
  };

  // Show error if no organization
  if (!organizationId) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Organization Members
            </CardTitle>
            <CardDescription>
              Manage all members in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You are not assigned to any organization. Please contact your
                administrator.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (isMembersLoading || isStatsLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-full max-w-sm" />
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">
                Organization Members
              </CardTitle>
              <CardDescription>
                Manage all members in your organization
              </CardDescription>
            </div>
            <Button onClick={() => setIsInviteDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Trial Info Alert */}
          {!isStatsLoading &&
            stats?.daysLeftInTrial !== undefined &&
            stats.daysLeftInTrial > 0 && (
              <Alert className="mb-6 bg-blue-50 border-blue-200">
                <Clock className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Trial Period:</strong> You have{" "}
                  {stats.daysLeftInTrial} day
                  {stats.daysLeftInTrial !== 1 ? "s" : ""} remaining in your
                  trial period.
                  {stats.daysLeftInTrial <= 7 && (
                    <span className="ml-2 text-blue-600 font-semibold">
                      Upgrade now to continue using premium features!
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Members
                    </p>
                    <p className="text-2xl font-bold">
                      {stats?.totalMembers || 0}
                    </p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold">
                      {stats?.activeMembers || 0}
                    </p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">
                      {stats?.pendingMembers || 0}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Inactive</p>
                    <p className="text-2xl font-bold">
                      {stats?.inactiveMembers || 0}
                    </p>
                  </div>
                  <UserX className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Empty state */}
          {members.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {searchTerm
                  ? "No members found matching your search."
                  : "No members yet. Invite your first member to get started!"}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Members table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="font-semibold text-primary">
                                {member.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {member.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{member.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              member.status === "active"
                                ? "default"
                                : member.status === "pending"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {member.status || "active"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {member.joinedAt
                            ? new Date(member.joinedAt).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => openStatusDialog(member)}
                              >
                                {member.isActive ? (
                                  <>
                                    <UserMinus className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <UserCog className="mr-2 h-4 w-4" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => openRemoveDialog(member)}
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                Remove Member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(page - 1) * meta.limit + 1} to{" "}
                    {Math.min(page * meta.limit, meta.total)} of {meta.total}{" "}
                    members
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page === meta.totalPages}
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

      {/* Invite Member Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Member</DialogTitle>
            <DialogDescription>
              Send an invitation to a new member to join your organization.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                placeholder="Member"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsInviteDialogOpen(false)}
              disabled={isInviting}
            >
              Cancel
            </Button>
            <Button onClick={handleInvite} disabled={isInviting}>
              {isInviting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toggle Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedMember?.isActive ? "Deactivate" : "Activate"} Member
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to{" "}
              {selectedMember?.isActive ? "deactivate" : "activate"}{" "}
              <span className="font-semibold">{selectedMember?.name}</span>?
              {selectedMember?.isActive &&
                " They will lose access to the organization immediately."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusDialogOpen(false)}
              disabled={isUpdatingStatus}
            >
              Cancel
            </Button>
            <Button
              variant={selectedMember?.isActive ? "destructive" : "default"}
              onClick={handleToggleStatus}
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {selectedMember?.isActive ? "Deactivate" : "Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Dialog */}
      <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-semibold">{selectedMember?.name}</span> from
              the organization? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRemoveDialogOpen(false)}
              disabled={isRemoving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemove}
              disabled={isRemoving}
            >
              {isRemoving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Remove Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
