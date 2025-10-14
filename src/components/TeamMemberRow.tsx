import React from "react";
import { type FieldErrors, type Control, Controller } from "react-hook-form";
import type { TeamFormValues } from "../lib/teamSchema";

interface TeamMemberRowProps {
  index: number;
  control: Control<TeamFormValues>;
  onRemove: (index: number) => void;
  errors: FieldErrors<TeamFormValues>;
}

export const TeamMemberRow: React.FC<TeamMemberRowProps> = ({
  index,
  control,
  onRemove,
  errors,
}) => {
  return (
    <tr>
      <td>
        <Controller
          name={`members.${index}.name`}
          control={control}
          render={({ field }) => <input {...field} placeholder="Member Name" />}
        />
        {errors.members?.[index]?.name && (
          <span className="form-error">{errors.members[index]?.name?.message}</span>
        )}
      </td>
      <td>
        <Controller
          name={`members.${index}.position`}
          control={control}
          render={({ field }) => <input {...field} placeholder="Position" />}
        />
        {errors.members?.[index]?.position && (
          <span className="form-error">{errors.members[index]?.position?.message}</span>
        )}
      </td>
      <td>
        <Controller
          name={`members.${index}.email`}
          control={control}
          render={({ field }) => <input {...field} placeholder="Email" />}
        />
        {errors.members?.[index]?.email && (
          <span className="form-error">{errors.members[index]?.email?.message}</span>
        )}
      </td>
      <td className="text-center">
        <button type="button" className="btn btn-danger" onClick={() => onRemove(index)}>
          🗑️ Delete
        </button>
      </td>
    </tr>
  );
};
