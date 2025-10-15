import { useState, useRef } from 'react';
import type { ITeam } from '../types/index';
import ThreeStateCheckbox from '../components/ThreeStateCheckbox';

import '../styles/teams.css';
import ConfirmDialog from '../components/ConfirmDialog';
import Loader from '../components/Loader';
import Toast from '../components/Toast';

interface TeamsProps {
  onNewTeam: () => void;
  onEditTeam: (team: ITeam) => void;
}

const Teams = ({ onNewTeam, onEditTeam }: TeamsProps) => {
  const [teams, setTeams] = useState<ITeam[]>([
    {
      _id: '1',
      name: 'Development Team',
      manager: 'John Manager',
      director: 'Jane Director',
      description: 'Core development team',
      status: '1',
      managerApproved: '1',
      directorApproved: '0',
      members: [
        { _id: '1-1', name: 'John Doe', position: 'Developer', email: 'john@example.com' },
        { _id: '1-2', name: 'Jane Smith', position: 'Senior Developer', email: 'jane@example.com' },
      ],
    },
    {
      _id: '2',
      name: 'Marketing Team',
      manager: 'Bob Manager',
      director: 'Alice Director',
      description: 'Digital marketing and campaigns',
      status: '0',
      managerApproved: '0',
      directorApproved: '0',
      members: [
        { _id: '2-1', name: 'Alice Johnson', position: 'Marketing Lead', email: 'alice@example.com' },
        { _id: '2-2', name: 'Bob Wilson', position: 'Content Creator', email: 'bob@example.com' },
        { _id: '2-3', name: 'Carol Brown', position: 'Social Media Manager', email: 'carol@example.com' },
      ],
    },
    {
      _id: '3',
      name: 'Design Team',
      manager: 'Eve Manager',
      director: 'Frank Director',
      description: 'UI/UX design team',
      status: '-1',
      managerApproved: '-1',
      directorApproved: '1',
      members: [
        { _id: '3-1', name: 'David Lee', position: 'UI Designer', email: 'david@example.com' },
      ],
    },
  ]);

  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTeams, setExpandedTeams] = useState<string[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = async () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const newTeams = [...teams];
      const draggedItem = newTeams[dragItem.current];
      newTeams.splice(dragItem.current, 1);
      newTeams.splice(dragOverItem.current, 0, draggedItem);

      setTeams(newTeams);
      
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false);
      showToast('Team order saved successfully');
    }
    
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleSelectTeam = (teamId: string) => {
    setSelectedTeams(prev =>
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedTeams(checked ? filteredTeams.map(t => t._id) : []);
  };

  const handleStatusChange = async (teamId: string, type: 'manager' | 'director', status: "0" | "1" | "-1") => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setTeams(prevTeams =>
      prevTeams.map(team =>
        team._id === teamId
          ? {
              ...team,
              ...(type === 'manager'
                ? { managerApproved: status }
                : { directorApproved: status }),
            }
          : team
      )
    );
    
    setLoading(false);
    showToast('Team status saved successfully');
  };

  const handleDelete = (teamId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Team',
      message: 'Are you sure you want to delete this team? This action cannot be undone.',
      onConfirm: async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setTeams(prevTeams => prevTeams.filter(t => t._id !== teamId));
        setLoading(false);
        showToast('Team deleted successfully');
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: () => {} });
      },
    });
  };

  const handleBulkDelete = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Teams',
      message: `Are you sure you want to delete ${selectedTeams.length} team(s)? This action cannot be undone.`,
      onConfirm: async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setTeams(prevTeams => prevTeams.filter(t => !selectedTeams.includes(t._id)));
        setSelectedTeams([]);
        setLoading(false);
        showToast('Teams deleted successfully');
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: () => {} });
      },
    });
  };

  const toggleExpand = (teamId: string) => {
    setExpandedTeams(prev =>
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleMemberNameChange = async (teamId: string, memberId: string, field: 'name' | 'position' | 'email', value: string) => {
    setTeams(prevTeams =>
      prevTeams.map(team =>
        team._id === teamId
          ? {
              ...team,
              members: team.members.map(member =>
                member._id === memberId ? { ...member, [field]: value } : member
              ),
            }
          : team
      )
    );
  };

  const handleDeleteMember = (teamId: string, memberId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Member',
      message: 'Are you sure you want to delete this member?',
      onConfirm: async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        setTeams(prevTeams =>
          prevTeams.map(team =>
            team._id === teamId
              ? {
                  ...team,
                  members: team.members.filter(m => m._id !== memberId),
                }
              : team
          )
        );
        setLoading(false);
        showToast('Member deleted successfully');
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: () => {} });
      },
    });
  };

  const filteredTeams = teams.filter(team => {
    const query = searchQuery.toLowerCase();
    const teamMatch = team.name.toLowerCase().includes(query) ||
      team.description.toLowerCase().includes(query) ||
      team.manager.toLowerCase().includes(query) ||
      team.director.toLowerCase().includes(query);
    const memberMatch = team.members.some(member =>
      member.name.toLowerCase().includes(query) ||
      member.position.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query)
    );
    return teamMatch || memberMatch;
  });

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
            onChange={e => setSearchQuery(e.target.value)}
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
              <th style={{ width: '40px' }}>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={selectedTeams.length === filteredTeams.length && filteredTeams.length > 0}
                  onChange={e => handleSelectAll(e.target.checked)}
                />
              </th>
              <th style={{ width: '40px' }}></th>
              <th>Team Name</th>
              <th>Description</th>
              <th>Manager</th>
              <th>Director</th>
              <th>Manager Approval</th>
              <th>Director Approval</th>
              <th style={{ width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeams.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="no-data">
                    <div className="no-data-icon">📋</div>
                    <div className="no-data-text">No teams found</div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTeams.map((team, index) => (
                <>
                  <tr
                    key={team._id}
                    className={selectedTeams.includes(team._id) ? 'selected' : ''}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={e => e.preventDefault()}
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
                    <td>{team.manager}</td>
                    <td>{team.director}</td>
                    <td>
                      <ThreeStateCheckbox
                        status={team.managerApproved || '0'}
                        onChange={status => handleStatusChange(team._id, 'manager', status)}
                      />
                    </td>
                    <td>
                      <ThreeStateCheckbox
                        status={team.directorApproved || '0'}
                        onChange={status => handleStatusChange(team._id, 'director', status)}
                      />
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="icon-btn expand"
                          onClick={() => toggleExpand(team._id)}
                          title="Show/Hide Members"
                        >
                          {expandedTeams.includes(team._id) ? '▼' : '▶'}
                        </button>
                        <button
                          className="icon-btn edit"
                          onClick={() => onEditTeam(team)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="icon-btn delete"
                          onClick={() => handleDelete(team._id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedTeams.includes(team._id) && (
                    <tr className="member-details">
                      <td colSpan={9}>
                        <div className="members-list">
                          <div className="members-title">Team Members ({team.members.length})</div>
                          {team.members.map(member => (
                            <div key={member._id} className="member-item">
                              <input
                                type="text"
                                className="member-name"
                                value={member.name}
                                onChange={e =>
                                  handleMemberNameChange(team._id, member._id!, 'name', e.target.value)
                                }
                                placeholder="Name"
                              />
                              <input
                                type="text"
                                className="member-name"
                                value={member.position}
                                onChange={e =>
                                  handleMemberNameChange(team._id, member._id!, 'position', e.target.value)
                                }
                                placeholder="Position"
                              />
                              <input
                                type="text"
                                className="member-name"
                                value={member.email}
                                onChange={e =>
                                  handleMemberNameChange(team._id, member._id!, 'email', e.target.value)
                                }
                                placeholder="Email"
                              />
                              <button
                                className="icon-btn delete"
                                onClick={() => handleDeleteMember(team._id, member._id!)}
                                title="Delete Member"
                              >
                                🗑️
                              </button>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
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
            setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: () => {} })
          }
        />
      )}

      {loading && <Loader />}
      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default Teams;
