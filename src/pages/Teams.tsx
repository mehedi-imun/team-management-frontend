import debounce from "lodash.debounce";
import { useEffect, useRef, useState } from "react";
import type { ITeam } from "../types/index";

import ConfirmDialog from "../components/ConfirmDialog";
import Loader from "../components/Loader";
import Toast from "../components/Toast";

import {
  useBulkDeleteTeamsMutation,
  useDeleteMemberMutation,
  useDeleteTeamMutation,
  useGetAllTeamsQuery,
  useUpdateApprovalStatusMutation,
  useUpdateMemberMutation,
  useUpdateTeamOrderMutation,
} from "../redux/features/team/teamApi";

import TeamsHeader from "./Teams/TeamsHeader";
import TeamsRow from "./Teams/TeamsRow";
import TeamsSearchBar from "./Teams/TeamsSearchBar";

interface TeamsProps {
  onNewTeam: () => void;
  onEditTeam: (team: ITeam) => void;
}

const Teams = ({ onNewTeam, onEditTeam }: TeamsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editingMembers, setEditingMembers] = useState<Record<string, string>>(
    {}
  );
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [expandedTeams, setExpandedTeams] = useState<string[]>([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const { data: teamsData, isLoading: loadingTeams } = useGetAllTeamsQuery({
    searchTerm: debouncedSearch,
    sort: "order",
  });

  const teams = teamsData || [];

  // Mutations
  const [deleteTeamApi] = useDeleteTeamMutation();
  const [bulkDeleteTeamsApi] = useBulkDeleteTeamsMutation();
  const [updateApprovalStatusApi] = useUpdateApprovalStatusMutation();
  const [updateMemberApi] = useUpdateMemberMutation();
  const [deleteMemberApi] = useDeleteMemberMutation();
  const [updateTeamOrderApi] = useUpdateTeamOrderMutation();

  // Toast helper
  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000
    );
  };

  // Drag & drop handlers
  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };
  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };
  const handleDragEnd = async () => {
    if (dragItem.current === null || dragOverItem.current === null) return;

    const newTeams = [...teams];
    const draggedTeam = newTeams[dragItem.current];
    newTeams.splice(dragItem.current, 1);
    newTeams.splice(dragOverItem.current, 0, draggedTeam);

    const orderList = newTeams.map((team, index) => ({
      id: team._id,
      order: index + 1,
    }));

    try {
      setLoading(true);
      await updateTeamOrderApi(orderList).unwrap();
      showToast("Team order updated successfully");
    } catch (err) {
      console.error(err);
      showToast("Failed to update team order", "error");
    } finally {
      setLoading(false);
    }

    dragItem.current = null;
    dragOverItem.current = null;
  };

  // Team selection
  const handleSelectTeam = (teamId: string) => {
    setSelectedTeams((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };
  const handleSelectAll = (checked: boolean) => {
    setSelectedTeams(checked ? teams.map((t) => t._id) : []);
  };

  // Approval status
  const handleStatusChange = async (
    teamId: string,
    field: "managerApproved" | "directorApproved",
    value: string
  ) => {
    setLoading(true);
    try {
      await updateApprovalStatusApi({
        teamId,
        field,
        value: value as "0" | "1" | "-1",
      }).unwrap();
      showToast(
        `${
          field === "managerApproved" ? "Manager" : "Director"
        } approval updated`
      );
    } catch {
      showToast("Failed to update status", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete handlers
  const handleDeleteTeam = (teamId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Team",
      message:
        "Are you sure you want to delete this team? This action cannot be undone.",
      onConfirm: async () => {
        setLoading(true);
        try {
          await deleteTeamApi(teamId).unwrap();
          showToast("Team deleted successfully");
        } catch {
          showToast("Failed to delete team", "error");
        }
        setLoading(false);
        setConfirmDialog({
          isOpen: false,
          title: "",
          message: "",
          onConfirm: () => {},
        });
      },
    });
  };
  const handleBulkDelete = () => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Teams",
      message: `Are you sure you want to delete ${selectedTeams.length} team(s)? This action cannot be undone.`,
      onConfirm: async () => {
        setLoading(true);
        try {
          await bulkDeleteTeamsApi(selectedTeams).unwrap();
          setSelectedTeams([]);
          showToast("Teams deleted successfully");
        } catch {
          showToast("Failed to delete teams", "error");
        }
        setLoading(false);
        setConfirmDialog({
          isOpen: false,
          title: "",
          message: "",
          onConfirm: () => {},
        });
      },
    });
  };

  // Member edit/delete
  const toggleExpand = (teamId: string) => {
    setExpandedTeams((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };
  const handleEditMember = (memberId: string, value: string) => {
    setEditingMembers((prev) => ({ ...prev, [memberId]: value }));
  };
  const handleSaveMember = async (teamId: string, memberId: string) => {
    const newName = editingMembers[memberId];
    if (!newName) return;
    setLoading(true);
    try {
      await updateMemberApi({ teamId, memberId, name: newName }).unwrap();
      showToast("Member updated successfully");
      setEditingMembers((prev) => {
        const copy = { ...prev };
        delete copy[memberId];
        return copy;
      });
    } catch {
      showToast("Failed to update member", "error");
    }
    setLoading(false);
  };
  const handleDeleteMember = (teamId: string, memberId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Member",
      message: "Are you sure you want to delete this member?",
      onConfirm: async () => {
        setLoading(true);
        try {
          await deleteMemberApi({ teamId, memberId }).unwrap();
          showToast("Member deleted successfully");
        } catch {
          showToast("Failed to delete member", "error");
        }
        setLoading(false);
        setConfirmDialog({
          isOpen: false,
          title: "",
          message: "",
          onConfirm: () => {},
        });
      },
    });
  };

  // Debounced search
  useEffect(() => {
    const handler = debounce((query: string) => setDebouncedSearch(query), 500);
    handler(searchQuery);
    return () => {
      handler.cancel();
    };
  }, [searchQuery]);

  return (
    <div className="container">
      <TeamsHeader onNewTeam={onNewTeam} />
      <TeamsSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCount={selectedTeams.length}
        onBulkDelete={handleBulkDelete}
      />
      <div className="table-container">
        <table className="teams-table">
          <thead>
            <tr>
              <th style={{ width: "40px" }}>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={
                    selectedTeams.length === teams.length && teams.length > 0
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th style={{ width: "40px" }}></th>
              <th>Team Name</th>
              <th>Description</th>
              <th>Approved by Manager</th>
              <th>Approved by Director</th>
              <th style={{ width: "120px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="no-data">
                    <div className="no-data-icon">📋</div>
                    <div className="no-data-text">No teams found</div>
                  </div>
                </td>
              </tr>
            ) : (
              teams.map((team, index) => (
                <TeamsRow
                  key={team._id}
                  team={team}
                  index={index}
                  isSelected={selectedTeams.includes(team._id)}
                  isExpanded={expandedTeams.includes(team._id)}
                  onSelect={() => handleSelectTeam(team._id)}
                  onToggleExpand={() => toggleExpand(team._id)}
                  onEditTeam={onEditTeam}
                  onDeleteTeam={handleDeleteTeam}
                  onStatusChange={handleStatusChange}
                  editingMembers={editingMembers}
                  onEditMember={handleEditMember}
                  onSaveMember={handleSaveMember}
                  onDeleteMember={handleDeleteMember}
                  handleDragStart={handleDragStart}
                  handleDragEnter={handleDragEnter}
                  handleDragEnd={handleDragEnd}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {confirmDialog.isOpen && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() =>
            setConfirmDialog({
              isOpen: false,
              title: "",
              message: "",
              onConfirm: () => {},
            })
          }
        />
      )}

      {(loading || loadingTeams) && <Loader />}
      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default Teams;
