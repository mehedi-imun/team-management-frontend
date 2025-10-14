/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Team } from "../types";
import { TeamMemberRow } from "../components/TeamMemberRow";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { teamSchema, type TeamFormValues } from "../lib/teamSchema";
import { useCreateTeamMutation, useUpdateTeamMutation } from "../redux/features/team/teamApi";

interface TeamFormPageProps {
  team: Team | null;
  onSave: (data: Team) => void;
  onExit: () => void;
}

export const TeamFormPage: React.FC<TeamFormPageProps> = ({ team, onSave, onExit }) => {
  const [loading, setLoading] = useState(false);
  const [createTeam] = useCreateTeamMutation();
  const [updateTeam] = useUpdateTeamMutation();

  // Initialize form with react-hook-form + zod validation
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: team
      ? { ...team, status: team.status ?? "0" }
      : {
          _id: "",
          name: "",
          manager: "",
          director: "",
          description: "",
          status: "0",
          members: [{ id: Date.now().toString(), name: "", position: "", email: "" }],
        },
  });

  // Handle dynamic team members
  const { fields: members, append, remove } = useFieldArray<TeamFormValues, "members">({
    control,
    name: "members",
  });

  // Submit form handler
  const onSubmit = async (data: TeamFormValues) => {
    setLoading(true);
    try {
      if (team?._id) {
        // Update existing team
        await updateTeam({ _id: team._id, ...data }).unwrap();
      } else {
        // Create new team
        await createTeam(data).unwrap();
      }
      alert("Team saved successfully!");
      onSave({ ...data, _id: team?._id ?? "" });
      reset(data); // reset form with saved data
    } catch (err) {
      console.error(err);
      alert("Error saving team!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-main">
      {/* Loading spinner */}
      <LoadingSpinner show={loading} />

      {/* Page Header */}
      <div className="page-header">
        <h1>{team ? "Edit Team" : "Create New Team"}</h1>
      </div>

      {/* Form Card */}
      <div className="card">
        <div className="card-header">Team Information</div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Team Name */}
            <div className="form-group">
              <label className="form-label">
                Team Name <span className="required">*</span>
              </label>
              <input type="text" {...register("name")} />
              {errors.name && <span className="form-error">{errors.name.message}</span>}
            </div>

            {/* Manager & Director */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Manager <span className="required">*</span>
                </label>
                <select {...register("manager")}>
                  <option value="">Select Manager</option>
                  <option value="manager1">John Doe</option>
                  <option value="manager2">Jane Smith</option>
                </select>
                {errors.manager && <span className="form-error">{errors.manager.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Director <span className="required">*</span>
                </label>
                <select {...register("director")}>
                  <option value="">Select Director</option>
                  <option value="director1">Michael Johnson</option>
                  <option value="director2">Sarah Williams</option>
                </select>
                {errors.director && <span className="form-error">{errors.director.message}</span>}
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                Description <span className="required">*</span>
              </label>
              <textarea {...register("description")} />
              {errors.description && <span className="form-error">{errors.description.message}</span>}
            </div>

            {/* Team Members Section */}
            <div className="form-section">
              <div className="form-section-title">
                <span>Team Members</span>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => append({ id: Date.now().toString(), name: "", position: "", email: "" })}
                >
                  + Add Member
                </button>
              </div>

              {/* Members Table */}
              <div className="table-wrapper">
                <table className="members-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Position</th>
                      <th>Email</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member, index) => (
                      <TeamMemberRow
                        key={member.id}
                        index={index}
                        control={control}
                        onRemove={remove}
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
                {loading ? "Saving..." : "Save"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={onExit} disabled={loading}>
                Exit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
