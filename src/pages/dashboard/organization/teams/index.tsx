import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useGetTeamsQuery } from "@/redux/features/team/teamApi";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { CreateTeamDialog } from "./CreateTeamDialog";

export default function TeamsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch teams with pagination and search
  const {
    data: teamsData,
    isLoading,
    error,
  } = useGetTeamsQuery({
    page,
    limit: 10,
    searchTerm: search,
  });

  const teams = teamsData?.data || [];
  const totalPages = teamsData?.meta?.totalPage || 1;

  // Show trial expiry warning on mount
  useEffect(() => {
    // This will be populated from organization data
    const daysLeft = 5; // Example: Get from org context
    if (daysLeft <= 7 && daysLeft > 0) {
      toast({
        title: "⏰ Trial Ending Soon",
        description: `Your free trial expires in ${daysLeft} days. Upgrade to continue using all features.`,
        variant: "default",
        duration: 10000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Error loading teams. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Teams</h1>
        <p className="text-gray-600">
          Manage your organization's teams and members
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search teams..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset to first page on search
            }}
          />
        </div>

        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </div>

      {/* Teams Table */}
      <div className="bg-white rounded-lg border">
        <DataTable columns={columns} data={teams} isLoading={isLoading} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </div>
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
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create Team Dialog */}
      <CreateTeamDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
    </div>
  );
}
