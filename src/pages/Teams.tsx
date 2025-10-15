import React, { useEffect, useRef, useState } from "react";
import ThreeStateCheckbox from "../components/ThreeStateCheckbox";
import type { ITeam } from "../types/index";

import debounce from "lodash.debounce";
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
import "../styles/teams.css";

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

  const { data: teamsData, isLoading: loadingTeams } = useGetAllTeamsQuery({
    searchTerm: debouncedSearch,
    sort: "order",
  });

  const [deleteTeamApi] = useDeleteTeamMutation();
  const [bulkDeleteTeamsApi] = useBulkDeleteTeamsMutation();
  const [updateApprovalStatusApi] = useUpdateApprovalStatusMutation();
  const [updateMemberApi] = useUpdateMemberMutation();
  const [deleteMemberApi] = useDeleteMemberMutation();
  const [updateTeamOrderApi] = useUpdateTeamOrderMutation();

  const teams = teamsData || [];
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [expandedTeams, setExpandedTeams] = useState<string[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

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

  const handleStatusChange = async (
    teamId: string,
    field: "managerApproved" | "directorApproved",
    nextValue: string
  ) => {
    setLoading(true);
    try {
      await updateApprovalStatusApi({
        teamId,
        field,
        value: nextValue as "0" | "1" | "-1",
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

  const handleDelete = (teamId: string) => {
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
    const handler = debounce((query: string) => {
      setDebouncedSearch(query);
    }, 500);

    handler(searchQuery);

    return () => {
      handler.cancel();
    };
  }, [searchQuery]);

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Team Management</h1>
        <button className="btn btn-primary" onClick={onNewTeam}>
          + New Team
        </button>
      </div>

      <div className="actions-bar">
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="Search teams or members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        {selectedTeams.length > 0 && (
          <button className="btn btn-danger" onClick={handleBulkDelete}>
            Delete Selected ({selectedTeams.length})
          </button>
        )}
      </div>

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
                <React.Fragment key={team._id}>
                  <tr
                    className={
                      selectedTeams.includes(team._id) ? "selected" : ""
                    }
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectedTeams.includes(team._id)}
                        onChange={() => handleSelectTeam(team._id)}
                      />
                    </td>
                    <td>
                      <span className="drag-handle">⋮⋮</span>
                    </td>
                    <td>{team.name}</td>
                    <td>{team.description}</td>
                    <td>
                      <ThreeStateCheckbox
                        status={team.managerApproved || "0"}
                        onChange={(status) =>
                          handleStatusChange(
                            team._id,
                            "managerApproved",
                            status
                          )
                        }
                      />
                    </td>
                    <td>
                      <ThreeStateCheckbox
                        status={team.directorApproved || "0"}
                        onChange={(status) =>
                          handleStatusChange(
                            team._id,
                            "directorApproved",
                            status
                          )
                        }
                      />
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="icon-btn expand"
                          onClick={() => toggleExpand(team._id)}
                        >
                          {expandedTeams.includes(team._id) ? "▼" : "▶"}
                        </button>
                        <button
                          className="icon-btn edit"
                          onClick={() => onEditTeam(team)}
                        >
                          ✏️
                        </button>
                        <button
                          className="icon-btn delete"
                          onClick={() => handleDelete(team._id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Expanded Members */}
                  {expandedTeams.includes(team._id) &&
                    team.members.length > 0 && (
                      <tr className="member-details">
                        <td colSpan={9}>
                          <div className="members-list">
                            {team.members.map((member) => {
                              const isEditing =
                                editingMembers[member._id!] !== undefined;
                              const memberName = isEditing
                                ? editingMembers[member._id!]
                                : member.name;
                              return (
                                <div key={member._id} className="member-item">
                                  <input
                                    className={`form-input`}
                                    type="text"
                                    value={memberName}
                                    readOnly={!isEditing}
                                    onChange={(e) =>
                                      handleEditMember(
                                        member._id!,
                                        e.target.value
                                      )
                                    }
                                    placeholder="Name"
                                  />
                                  {isEditing ? (
                                    <button
                                      className="icon-btn save"
                                      onClick={() =>
                                        handleSaveMember(team._id, member._id!)
                                      }
                                    >
                                      💾
                                    </button>
                                  ) : (
                                    <button
                                      className="icon-btn edit"
                                      onClick={() =>
                                        handleEditMember(
                                          member._id!,
                                          member.name
                                        )
                                      }
                                    >
                                      ✏️
                                    </button>
                                  )}
                                  <button
                                    className="icon-btn delete"
                                    onClick={() =>
                                      handleDeleteMember(team._id, member._id!)
                                    }
                                  >
                                    🗑️
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    )}
                </React.Fragment>
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
