import { useState, useEffect } from 'react';

import '../styles/teams.css';
import type { FormErrors, IMember, ITeam } from '../types';
import TeamMemberRow from '../components/TeamMemberRow';
import ConfirmDialog from '../components/ConfirmDialog';
import Loader from '../components/Loader';
import Toast from '../components/Toast';

interface TeamFormProps {
  team: ITeam | null;
  onBack: () => void;
}

const TeamForm = ({ team, onBack }: TeamFormProps) => {
  const isEditMode = team !== null;

  const [formData, setFormData] = useState<Omit<ITeam, '_id'>>({
    name: '',
    manager: '',
    director: '',
    description: '',
    status: '0',
    managerApproved: '0',
    directorApproved: '0',
    members: [{ _id: Date.now().toString(), name: '', position: '', email: '' }],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (isEditMode && team) {
      setFormData({
        name: team.name,
        manager: team.manager,
        director: team.director,
        description: team.description,
        status: team.status,
        managerApproved: team.managerApproved || '0',
        directorApproved: team.directorApproved || '0',
        members: team.members.length > 0 ? team.members : [{ _id: Date.now().toString(), name: '', position: '', email: '' }],
      });
    }
  }, [isEditMode, team]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required';
    }

    if (!formData.manager.trim()) {
      newErrors.manager = 'Manager name is required';
    }

    if (!formData.director.trim()) {
      newErrors.director = 'Director name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    formData.members.forEach((member, index) => {
      if (!member.name.trim()) {
        newErrors[`member_${index}_name`] = 'Member name is required';
      }
      if (!member.position.trim()) {
        newErrors[`member_${index}_position`] = 'Position is required';
      }
      if (!member.email.trim()) {
        newErrors[`member_${index}_email`] = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
        newErrors[`member_${index}_email`] = 'Invalid email format';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: isEditMode ? 'Update Team' : 'Create Team',
      message: `Are you sure you want to ${isEditMode ? 'update' : 'create'} this team?`,
      onConfirm: async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
        showToast(`Team ${isEditMode ? 'updated' : 'created'} successfully`);
        setTimeout(() => onBack(), 1000);
        setConfirmDialog({ isOpen: false, title: '', message: '', onConfirm: () => {} });
      },
    });
  };

  const handleAddMember = () => {
    const newMember: IMember = {
      _id: Date.now().toString(),
      name: '',
      position: '',
      email: '',
    };
    setFormData(prev => ({
      ...prev,
      members: [...prev.members, newMember],
    }));
  };

  const handleMemberChange = (index: number, field: keyof IMember, value: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      ),
    }));

    const errorKey = `member_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleDeleteMember = (index: number) => {
    if (formData.members.length === 1) {
      showToast('At least one team member is required', 'error');
      return;
    }

    setFormData(prev => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">{isEditMode ? 'Edit Team' : 'New Team'}</h1>
      </div>

      <div className="form-container">
        <div className="form-group">
          <label className="form-label required">Team Name</label>
          <input
            type="text"
            className={`form-input ${errors.name ? 'error' : ''}`}
            value={formData.name}
            onChange={e => {
              setFormData(prev => ({ ...prev, name: e.target.value }));
              if (errors.name) setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.name;
                return newErrors;
              });
            }}
            placeholder="Enter team name"
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label className="form-label required">Manager</label>
          <input
            type="text"
            className={`form-input ${errors.manager ? 'error' : ''}`}
            value={formData.manager}
            onChange={e => {
              setFormData(prev => ({ ...prev, manager: e.target.value }));
              if (errors.manager) setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.manager;
                return newErrors;
              });
            }}
            placeholder="Enter manager name"
          />
          {errors.manager && <div className="error-message">{errors.manager}</div>}
        </div>

        <div className="form-group">
          <label className="form-label required">Director</label>
          <input
            type="text"
            className={`form-input ${errors.director ? 'error' : ''}`}
            value={formData.director}
            onChange={e => {
              setFormData(prev => ({ ...prev, director: e.target.value }));
              if (errors.director) setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.director;
                return newErrors;
              });
            }}
            placeholder="Enter director name"
          />
          {errors.director && <div className="error-message">{errors.director}</div>}
        </div>

        <div className="form-group">
          <label className="form-label required">Description</label>
          <textarea
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            value={formData.description}
            onChange={e => {
              setFormData(prev => ({ ...prev, description: e.target.value }));
              if (errors.description) setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.description;
                return newErrors;
              });
            }}
            placeholder="Enter team description"
          />
          {errors.description && <div className="error-message">{errors.description}</div>}
        </div>

        <div className="team-members-section">
          <div className="section-header">
            <h3 className="section-title">Team Members</h3>
            <button className="btn btn-primary" onClick={handleAddMember}>
              + Add New Member
            </button>
          </div>

          {formData.members.map((member, index) => (
            <TeamMemberRow
              key={member._id}
              member={member}
              index={index}
              errors={{
                name: errors[`member_${index}_name`],
                position: errors[`member_${index}_position`],
                email: errors[`member_${index}_email`],
              }}
              onChange={handleMemberChange}
              onDelete={handleDeleteMember}
            />
          ))}
        </div>

        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onBack}>
            Exit
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {isEditMode ? 'Update Team' : 'Save Team'}
          </button>
        </div>
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

export default TeamForm;
