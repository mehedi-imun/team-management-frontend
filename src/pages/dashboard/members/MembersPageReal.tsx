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
import { Input } from "@/components/ui/input";
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
  useGetOrganizationMembersQuery,
  useGetOrganizationStatsQuery,
} from "@/redux/features/organization/organizationApi";
import type { RootState } from "@/redux/store";
import { CheckCircle2, Clock, Mail, Plus, Search, UserX } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function MembersPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const user = useSelector((state: RootState) => state.auth.user);
  const organizationId = user?.organizationId || "";

  const { data: statsData, isLoading: statsLoading } =
    useGetOrganizationStatsQuery();
  const {
    data: membersData,
    isLoading: membersLoading,
    error,
  } = useGetOrganizationMembersQuery({
    organizationId,
    page,
    limit: 10,
    search: searchTerm,
  });

  const stats = statsData || {
    totalMembers: 0,
    activeMembers: 0,
    pendingMembers: 0,
    inactiveMembers: 0,
    totalTeams: 0,
    daysLeftInTrial: undefined,
  };

  const members = membersData?.data || [];
  const meta = membersData?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  };

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
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Trial Info Alert */}
          {!statsLoading && stats.daysLeftInTrial !== undefined && stats.daysLeftInTrial > 0 && (
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <Clock className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Trial Period:</strong> You have {stats.daysLeftInTrial} day{stats.daysLeftInTrial !== 1 ? 's' : ''} remaining in your trial period.
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
                      {statsLoading ? (
                        <Skeleton className="h-8 w-12" />
                      ) : (
                        stats.totalMembers
                      )}
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
                      {statsLoading ? (
                        <Skeleton className="h-8 w-12" />
                      ) : (
                        stats.activeMembers
                      )}
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
                      {statsLoading ? (
                        <Skeleton className="h-8 w-12" />
                      ) : (
                        stats.pendingMembers
                      )}
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
                      {statsLoading ? (
                        <Skeleton className="h-8 w-12" />
                      ) : (
                        stats.inactiveMembers
                      )}
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

          {/* Error state */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                {(error as any)?.data?.message === "Forbidden - Requires one of: SuperAdmin, Admin"
                  ? "You don't have permission to view organization members. Please contact your organization administrator."
                  : (error as any)?.data?.message || "Failed to load members. Please try again later."}
              </AlertDescription>
            </Alert>
          )}

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
                {membersLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-10 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-16" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : members.length > 0 ? (
                  members.map((member) => (
                    <TableRow key={member._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-semibold text-primary">
                              {member.name?.charAt(0) ||
                                member.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">
                              {member.name || "N/A"}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {member.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {member.role || "Member"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            member.isActive !== false
                              ? "default"
                              : "destructive"
                          }
                        >
                          {member.isActive !== false ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {member.joinedAt
                          ? new Date(member.joinedAt).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No members found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {!membersLoading && members.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {members.length} of {meta.total} members
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
    </div>
  );
}
