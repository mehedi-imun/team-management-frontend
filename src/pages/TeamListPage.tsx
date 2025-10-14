import React, { useState } from "react";
import type { Team } from "../types";
import { StatusCheckbox } from "../components/StatusCheckbox";

interface TeamListPageProps {
  onEdit: (team: Team) => void;
  onAddNew: () => void;
}

export const TeamListPage: React.FC<TeamListPageProps> = ({
  onEdit,
  onAddNew,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);


  // Mock teams - replace with API call
  React.useEffect(() => {
    setTeams([
      {
        _id: "1",
        name: "Frontend Team",
        manager: "John Doe",
        director: "Michael Johnson",
        description: "UI/UX Development",
        status: 0,
        members: [
          {
            id: "u1",
            name: "Alice Johnson",
            position: "Lead Developer",
            email: "alice@example.com",
          },
        ],
      },
      {
        _id: "2",
        name: "Backend Team",
        manager: "Jane Smith",
        director: "Sarah Williams",
        description: "API Development",
        status: 1,
        members: [
          {
            id: "u2",
            name: "Charlie Brown",
            position: "Senior Developer",
            email: "charlie@example.com",
          },
        ],
      },
    ]);
  }, []);

  const handleSelectTeam = (teamId: string) => {
    const newSelected = new Set(selectedTeams);
    if (newSelected.has(teamId)) {
      newSelected.delete(teamId);
    } else {
      newSelected.add(teamId);
    }
    setSelectedTeams(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTeams.size === teams.length) {
      setSelectedTeams(new Set());
    } else {
      setSelectedTeams(new Set(teams.map((t) => t._id)));
    }
  };

  const handleToggleExpand = (teamId: string) => {
    const newExpanded = new Set(expandedTeams);
    if (newExpanded.has(teamId)) {
      newExpanded.delete(teamId);
    } else {
      newExpanded.add(teamId);
    }
    setExpandedTeams(newExpanded);
  };

  const handleDeleteTeam = (teamId: string) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      setTeams(teams.filter((t) => t._id !== teamId));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedTeams.size} teams?`)) {
      setTeams(teams.filter((t) => !selectedTeams.has(t._id)));
      setSelectedTeams(new Set());
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }
    const newTeams = [...teams];
    const dragged = newTeams[draggedIndex];
    newTeams.splice(draggedIndex, 1);
    newTeams.splice(dropIndex, 0, dragged);
    setTeams(newTeams);
    setDraggedIndex(null);
  };

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.members.some((m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="container-main">
      {/* Header */}
      <div className="page-header">
        <h1>Team Management</h1>
        <button className="btn btn-primary" onClick={onAddNew}>
          + New Team
        </button>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search teams, members, or managers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {selectedTeams.size > 0 && (
          <button className="btn btn-danger" onClick={handleBulkDelete}>
            🗑️ Delete ({selectedTeams.size})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th style={{ width: "50px" }}>
                  <input
                    type="checkbox"
                    checked={
                      selectedTeams.size === teams.length && teams.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th style={{ width: "50px" }}></th>
                <th>Team Name</th>
                <th>Manager</th>
                <th>Director</th>
                <th style={{ width: "120px" }} className="text-center">
                  Status
                </th>
                <th style={{ width: "180px" }} className="text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((team, index) => (
                <React.Fragment key={team._id}>
                  <tr
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(index)}
                    className={draggedIndex === index ? "dragging" : ""}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedTeams.has(team._id)}
                        onChange={() => handleSelectTeam(team._id)}
                      />
                    </td>
                    <td className="text-center">
                      <button
                        className={`expand-icon ${
                          expandedTeams.has(team._id) ? "expanded" : ""
                        }`}
                        onClick={() => handleToggleExpand(team._id)}
                      >
                        ▶
                      </button>
                    </td>
                    <td className="fw-600">{team.name}</td>
                    <td>{team.manager}</td>
                    <td>{team.director}</td>
                    <td className="text-center">
                      <StatusCheckbox
                        status={team.status}
                        onStatusChange={async () => {}}
                      />
                    </td>
                    <td className="text-center">
                      <div className="action-buttons">
                        <button
                          className="btn btn-primary"
                          onClick={() => onEdit(team)}
                        >
                          ✎ Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteTeam(team._id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedTeams.has(team._id) && (
                    <tr className="detail-row show">
                      <td colSpan={7}>
                        <div className="detail-content">
                          <h6>Team Members</h6>
                          <div className="table-wrapper">
                            <table className="detail-table">
                              <thead>
                                <tr>
                                  <th>Name</th>
                                  <th>Position</th>
                                  <th>Email</th>
                                  <th style={{ width: "100px" }}>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {team.members.map((member) => (
                                  <tr key={member.id}>
                                    <td>{member.name}</td>
                                    <td>{member.position}</td>
                                    <td>{member.email}</td>
                                    <td className="text-center">
                                      <button className="btn btn-danger">
                                        🗑️
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
