import debounce from "lodash.debounce";
import React, { useState } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { StatusCheckbox } from "../components/StatusCheckbox";
import {
  useBulkDeleteTeamsMutation,
  useDeleteTeamMutation,
  useGetAllTeamsQuery,
  useUpdateApprovalStatusMutation,
  useUpdateTeamOrderMutation,
} from "../redux/features/team/teamApi";
import type { ITeam } from "../types";
// import { ITeam } from "../types";

interface TeamListPageProps {
  onEditTeam: (id: string) => void;
  onCreateTeam: () => void;
}

export const TeamListPage: React.FC<TeamListPageProps> = ({
  onEditTeam,
  onCreateTeam,
}) => {
   const [search, setSearch] = useState("");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [updateApprovalStatus] = useUpdateApprovalStatusMutation();
  const [deleteTeam] = useDeleteTeamMutation();
  const [bulkDeleteTeams] = useBulkDeleteTeamsMutation();
  const [updateTeamOrder] = useUpdateTeamOrderMutation();

  // Build query params: only include search if not empty
  const queryParams: { search?: string } = {};
  if (search.trim() !== "") queryParams.search = search;

  // Fetch teams
  const { data: teams = [], isLoading, refetch } = useGetAllTeamsQuery(
    queryParams
  ) as { data: ITeam[]; isLoading: boolean; refetch: () => void };

  // Debounced search
  const handleSearch = debounce((value: string) => setSearch(value), 300);

  // Approval status handler
  const handleStatusChange = async (
    teamId: string,
    field: "managerApproved" | "directorApproved",
    value: 0 | 1 | 2
  ) => {
    try {
      await updateApprovalStatus({ teamId, field, value }).unwrap();
      alert("Team Status Saved");
      refetch();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  // Single & bulk delete handlers
  const handleDelete = async (teamId: string) => {
    if (!confirm("Are you sure to delete this team?")) return;
    try {
      await deleteTeam(teamId).unwrap();
      alert("Team deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete team");
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm("Are you sure to delete selected teams?")) return;
    try {
      await bulkDeleteTeams(selectedTeams).unwrap();
      setSelectedTeams([]);
      alert("Selected teams deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete selected teams");
    }
  };

  // Row selection
  const toggleSelectTeam = (id: string) => {
    setSelectedTeams((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Drag & Drop
  const handleDragEnd = async (
    event: React.DragEvent<HTMLTableRowElement>,
    draggedIndex: number
  ) => {
    const draggedTeam = teams[draggedIndex];
    if (!draggedTeam) return;

    const target = event.currentTarget.dataset.index;
    if (target === undefined) return;
    const targetIndex = Number(target);

    const updatedTeams = [...teams];
    updatedTeams.splice(draggedIndex, 1);
    updatedTeams.splice(targetIndex, 0, draggedTeam);

    try {
      await updateTeamOrder(
        updatedTeams.map((t, idx) => ({ id: t._id!, order: idx }))
      ).unwrap();
      refetch();
    } catch (err) {
      console.error(err);
      alert("Failed to update order");
    }
  };

  if (isLoading) return <LoadingSpinner show />;

  return (
    <div className="container-main">
      <div className="page-header">
        <h1>Teams</h1>
        <button className="btn btn-primary" onClick={onCreateTeam}>
          + New Team
        </button>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search Teams..."
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {selectedTeams.length > 0 && (
          <button className="btn btn-danger" onClick={handleBulkDelete}>
            Delete Selected
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    selectedTeams?.length === teams?.length && teams?.length > 0
                  }
                  onChange={(e) => {
                    if (e.target.checked)
                      setSelectedTeams(teams?.map((t) => t._id!));
                    else setSelectedTeams([]);
                  }}
                />
              </th>
              <th>Name</th>
              <th>Manager Approval</th>
              <th>Director Approval</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams?.map((team, index) => (
              <tr
                key={team._id}
                draggable
                data-index={index}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDragEnd(e, index)}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedTeams.includes(team._id!)}
                    onChange={() => toggleSelectTeam(team._id!)}
                  />
                </td>
                <td>{team.name}</td>
                <td>
                  <StatusCheckbox
                    status={
                      typeof team.managerApproved === "string"
                        ? team.managerApproved === "1"
                          ? 1
                          : team.managerApproved === "-1"
                          ? 2
                          : 0
                        : team.managerApproved ?? 0
                    }
                    onStatusChange={(val) =>
                      handleStatusChange(team._id!, "managerApproved", val)
                    }
                  />
                </td>
                <td>
                  <StatusCheckbox
                    status={
                      typeof team.directorApproved === "string"
                        ? team.directorApproved === "1"
                          ? 1
                          : team.directorApproved === "-1"
                          ? 2
                          : 0
                        : team.directorApproved ?? 0
                    }
                    onStatusChange={(val) =>
                      handleStatusChange(team._id!, "directorApproved", val)
                    }
                  />
                </td>
                <td className="action-buttons">
                  <button
                    className="btn btn-secondary"
                    onClick={() => onEditTeam(team._id!)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(team._id!)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
