import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User } from "@/redux/features/platform/platformApi";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
} from "@/redux/features/platform/platformApi";
import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "../organizations/DeleteConfirmDialog";
import { ChangeRoleDialog } from "./ChangeRoleDialog";
import { createColumns } from "./columns";
import { ViewUserDialog } from "./ViewUserDialog";

const UsersPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [updateRole, { isLoading: isUpdatingRole }] =
    useUpdateUserRoleMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateUserStatusMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const { data, isLoading } = useGetAllUsersQuery({
    page,
    limit: 10,
    search,
    role,
    status,
  });

  const users = data?.data || [];

  const handleClearFilters = () => {
    setSearch("");
    setRole("");
    setStatus("");
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const handleChangeRole = (user: User) => {
    setSelectedUser(user);
    setIsRoleDialogOpen(true);
  };

  const handleUpdateStatus = async (user: User) => {
    const newStatus = user.status === "active" ? "suspended" : "active";

    try {
      await updateStatus({
        id: user._id,
        status: newStatus,
      }).unwrap();

      toast.success(
        `User ${
          newStatus === "active" ? "activated" : "suspended"
        } successfully`
      );
    } catch {
      toast.error("Failed to update user status");
    }
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleRoleUpdate = async (newRole: string) => {
    if (!selectedUser) return;

    try {
      await updateRole({
        id: selectedUser._id,
        role: newRole,
      }).unwrap();

      toast.success("User role updated successfully");
      setIsRoleDialogOpen(false);
      setSelectedUser(null);
    } catch {
      toast.error("Failed to update user role");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser._id).unwrap();

      toast.success("User deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const columns = createColumns({
    onView: handleView,
    onChangeRole: handleChangeRole,
    onUpdateStatus: handleUpdateStatus,
    onDelete: handleDelete,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage all users on the platform
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="SuperAdmin">Super Admin</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Manager">Manager</SelectItem>
            <SelectItem value="Director">Director</SelectItem>
            <SelectItem value="Member">Member</SelectItem>
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {(search || role || status) && (
          <Button variant="outline" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={users}
        meta={data?.meta}
        onPageChange={setPage}
        isLoading={isLoading}
      />

      <ViewUserDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        user={selectedUser}
      />

      <ChangeRoleDialog
        open={isRoleDialogOpen}
        onOpenChange={setIsRoleDialogOpen}
        onConfirm={handleRoleUpdate}
        userName={selectedUser?.name || ""}
        currentRole={selectedUser?.role || ""}
        isLoading={isUpdatingRole}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        organizationName={selectedUser?.name || ""}
        isLoading={isDeleting || isUpdatingStatus}
      />
    </div>
  );
};

export default UsersPage;
