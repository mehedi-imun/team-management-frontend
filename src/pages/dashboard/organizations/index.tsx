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
import {
  useDeleteOrganizationMutation,
  useGetAllOrganizationsQuery,
  useUpdateOrganizationStatusMutation,
  type Organization,
} from "@/redux/features/platform/platformApi";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createColumns } from "./columns";
import { CreateOrganizationDialog } from "./CreateOrganizationDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { UpdateStatusDialog } from "./UpdateStatusDialog";
import { ViewOrganizationDialog } from "./ViewOrganizationDialog";

const OrganizationsPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [plan, setPlan] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateOrganizationStatusMutation();
  const [deleteOrg, { isLoading: isDeleting }] =
    useDeleteOrganizationMutation();

  const { data, isLoading } = useGetAllOrganizationsQuery({
    page,
    limit: 10,
    search,
    status,
    plan,
  });

  const organizations = data?.data || [];

  const handleClearFilters = () => {
    setSearch("");
    setStatus("");
    setPlan("");
  };

  const handleView = (org: Organization) => {
    setSelectedOrg(org);
    setIsViewDialogOpen(true);
  };

  const handleUpdateStatus = (org: Organization) => {
    setSelectedOrg(org);
    setIsStatusDialogOpen(true);
  };

  const handleDelete = (org: Organization) => {
    setSelectedOrg(org);
    setIsDeleteDialogOpen(true);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedOrg) return;

    try {
      await updateStatus({
        id: selectedOrg._id,
        status: newStatus,
      }).unwrap();

      toast.success("Organization status updated successfully");
      setIsStatusDialogOpen(false);
      setSelectedOrg(null);
    } catch {
      toast.error("Failed to update organization status");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOrg) return;

    try {
      await deleteOrg(selectedOrg._id).unwrap();

      toast.success("Organization deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedOrg(null);
    } catch {
      toast.error("Failed to delete organization");
    }
  };

  const columns = createColumns({
    onView: handleView,
    onUpdateStatus: handleUpdateStatus,
    onDelete: handleDelete,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">
            Manage all organizations on the platform
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Organization
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search organizations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={plan} onValueChange={setPlan}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Plans" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>

        {(search || status || plan) && (
          <Button variant="outline" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={organizations}
        meta={data?.meta}
        onPageChange={setPage}
        isLoading={isLoading}
      />

      <CreateOrganizationDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      <ViewOrganizationDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        organization={selectedOrg}
      />

      <UpdateStatusDialog
        open={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        onConfirm={handleStatusUpdate}
        organizationName={selectedOrg?.name || ""}
        currentStatus={selectedOrg?.status || ""}
        isLoading={isUpdatingStatus}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        organizationName={selectedOrg?.name || ""}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default OrganizationsPage;
