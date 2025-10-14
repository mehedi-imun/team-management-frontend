import { useState } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { TeamMemberRow } from "../components/TeamMemberRow";
import type { Team, TeamMember } from "../types";

import type { FormErrors } from "../types";

interface TeamFormPageProps {
  team: Team | null;
  onSave: (data: Team) => void;
  onExit: () => void;
}

export const TeamFormPage: React.FC<TeamFormPageProps> = ({
  team,
  onSave,
  onExit,
}) => {
  const [formData, setFormData] = useState<Team>(
    team || {
      _id: '',
      name: '',
      manager: '',
      director: '',
      description: '',
      status: 0,
      members: [{ id: '1', name: '', position: '', email: '' }],
    }
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    field: keyof Omit<Team, 'members'>,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: FormErrors) => {
        const newErrors: FormErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleMemberChange = (index: number, member: TeamMember) => {
    const newMembers = [...formData.members];
    newMembers[index] = member;
    setFormData((prev) => ({ ...prev, members: newMembers }));
  };

  const handleMemberDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      setFormData((prev) => ({
        ...prev,
        members: prev.members.filter((_, i) => i !== index),
      }));
    }
  };

  const handleAddMember = () => {
    setFormData((prev) => ({
      ...prev,
      members: [
        ...prev.members,
        {
          id: Date.now().toString(),
          name: '',
          position: '',
          email: '',
        },
      ],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Team name is required';
    }
    if (!formData.manager) {
      newErrors.manager = 'Manager is required';
    }
    if (!formData.director) {
      newErrors.director = 'Director is required';
    }
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    if (formData.members.length === 0) {
      newErrors.members = 'At least one team member is required';
    }

    formData.members.forEach((member, idx) => {
      if (!member.name?.trim()) {
        newErrors[`member_${idx}_name`] = 'Member name is required';
      }
      if (!member.position?.trim()) {
        newErrors[`member_${idx}_position`] = 'Position is required';
      }
      if (!member.email?.trim()) {
        newErrors[`member_${idx}_email`] = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(member.email)) {
        newErrors[`member_${idx}_email`] = 'Email is invalid';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // API call will be here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(
        team ? 'Team updated successfully!' : 'Team created successfully!'
      );
      onSave(formData);
    } catch (error) {
      alert(`Error saving team: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-main">
      <LoadingSpinner show={loading} />

      {/* Header */}
      <div className="page-header">
        <h1>{team ? 'Edit Team' : 'Create New Team'}</h1>
      </div>

      {/* Form Card */}
      <div className="card">
        <div className="card-header">Team Information</div>
        <div className="card-body">
          <form onSubmit={handleSave}>
            {/* Team Name */}
            <div className="form-group">
              <label className="form-label">
                Team Name <span className="required">*</span>
              </label>
              <input
                type="text"
                className={errors.name ? 'is-invalid' : ''}
                placeholder="Enter team name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            {/* Manager & Director */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Manager <span className="required">*</span>
                </label>
                <select
                  className={errors.manager ? 'is-invalid' : ''}
                  value={formData.manager}
                  onChange={(e) => handleInputChange('manager', e.target.value)}
                >
                  <option value="">Select Manager</option>
                  <option value="manager1">John Doe</option>
                  <option value="manager2">Jane Smith</option>
                </select>
                {errors.manager && (
                  <span className="form-error">{errors.manager}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">
                  Director <span className="required">*</span>
                </label>
                <select
                  className={errors.director ? 'is-invalid' : ''}
                  value={formData.director}
                  onChange={(e) =>
                    handleInputChange('director', e.target.value)
                  }
                >
                  <option value="">Select Director</option>
                  <option value="director1">Michael Johnson</option>
                  <option value="director2">Sarah Williams</option>
                </select>
                {errors.director && (
                  <span className="form-error">{errors.director}</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                Description <span className="required">*</span>
              </label>
              <textarea
                className={errors.description ? 'is-invalid' : ''}
                placeholder="Enter team description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
              />
              {errors.description && (
                <span className="form-error">{errors.description}</span>
              )}
            </div>

            {/* Team Members Section */}
            <div className="form-section">
              <div className="form-section-title">
                <span>
                  Team Members <span className="required">*</span>
                </span>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleAddMember}
                >
                  + Add Member
                </button>
              </div>

              {errors.members && (
                <div className="alert alert-error">{errors.members}</div>
              )}

              <div className="table-wrapper">
                <table className="members-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Position</th>
                      <th>Email</th>
                      <th style={{ width: '100px' }} className="text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.members.map((member, index) => (
                      <TeamMemberRow
                        key={member.id}
                        index={index}
                        member={member}
                        onMemberChange={handleMemberChange}
                        onMemberDelete={handleMemberDelete}
                        errors={errors}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onExit}
                disabled={loading}
              >
                Exit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};