/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import Loader from "../components/Loader";
import TeamMemberRow from "../components/TeamMemberRow";
import Toast from "../components/Toast";
import {
  useCreateTeamMutation,
  useUpdateTeamMutation,
} from "../redux/features/team/teamApi";
import type { FormErrors, IMember, ITeam } from "../types";

interface TeamFormProps {
  team: ITeam | null;
  onBack: () => void;
}

const TeamForm = ({ team, onBack }: TeamFormProps) => {
  const isEditMode = team !== null;

  const [formData, setFormData] = useState<Omit<ITeam, "_id">>({
    name: "",
    description: "",
    status: "0",
    managerApproved: "0",
    directorApproved: "0",
    members: [{ _id: null, name: "" }],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  // RTK Query
  const [createTeamApi] = useCreateTeamMutation();
  const [updateTeamApi] = useUpdateTeamMutation();

  useEffect(() => {
    if (isEditMode && team) {
      setFormData({
        name: team.name,
        description: team.description,
        status: team.status,
        managerApproved: team.managerApproved,
        directorApproved: team.directorApproved,
        members:
          team.members.length > 0 ? team.members : [{ _id: null, name: "" }],
      });
    }
  }, [isEditMode, team]);

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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Team name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    formData.members.forEach((member, index) => {
      if (!member.name.trim())
        newErrors[`member_${index}_name`] = "Member name is required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: isEditMode ? "Update Team" : "Create Team",
      message: `Are you sure you want to ${
        isEditMode ? "update" : "create"
      } this team?`,
      onConfirm: async () => {
        setLoading(true);
        try {
          // Filter out invalid _id for new members
          const cleanedData = {
            ...formData,
            members: formData.members.map((m) => {
              if (!m._id) {
                const { _id, ...rest } = m;
                return rest;
              }
              return m;
            }),
          };

          if (isEditMode && team?._id) {
            await updateTeamApi({
              teamId: team._id,
              data: cleanedData,
            }).unwrap();
            showToast("Team updated successfully", "success");
          } else {
            await createTeamApi(cleanedData).unwrap();
            showToast("Team created successfully", "success");
          }
          setTimeout(() => onBack(), 1000);
        } catch (err) {
          console.error(err);
          showToast("Failed to save team", "error");
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

  const handleAddMember = () => {
    const newMember: IMember = { _id: null, name: "" };
    setFormData((prev) => ({ ...prev, members: [...prev.members, newMember] }));
  };

  const handleMemberChange = (
    index: number,
    field: keyof IMember,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.map((m, i) =>
        i === index ? { ...m, [field]: value } : m
      ),
    }));
    const errorKey = `member_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleDeleteMember = (index: number) => {
    if (formData.members.length === 1) {
      showToast("At least one team member is required", "error");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">{isEditMode ? "Edit Team" : "New Team"}</h1>
      </div>

      <div className="form-container">
        {/* Team Name */}
        <div className="form-group">
          <label className="form-label required">Team Name</label>
          <input
            type="text"
            className={`form-input ${errors.name ? "error" : ""}`}
            value={formData.name}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, name: e.target.value }));
              if (errors.name)
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.name;
                  return newErrors;
                });
            }}
            placeholder="Enter team name"
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label required">Description</label>
          <textarea
            className={`form-textarea ${errors.description ? "error" : ""}`}
            value={formData.description}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, description: e.target.value }));
              if (errors.description)
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.description;
                  return newErrors;
                });
            }}
            placeholder="Enter team description"
          />
          {errors.description && (
            <div className="error-message">{errors.description}</div>
          )}
        </div>

        {/* Members */}
        <div className="team-members-section">
          <div className="section-header">
            <h3 className="section-title">Team Members</h3>
            <button className="btn btn-primary" onClick={handleAddMember}>
              + Add New Member
            </button>
          </div>

          {formData.members.map((member, index) => (
            <TeamMemberRow
              key={member._id || index} // fallback key for new members
              member={member}
              index={index}
              errors={{
                name: errors[`member_${index}_name`],
              }}
              onChange={handleMemberChange}
              onDelete={handleDeleteMember}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onBack}>
            Exit
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {isEditMode ? "Update Team" : "Save Team"}
          </button>
        </div>
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

      {loading && <Loader />}
      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default TeamForm;
