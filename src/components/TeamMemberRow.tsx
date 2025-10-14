import type { FormErrors, TeamMember } from "../types";

interface TeamMemberRowProps {
  index: number;
  member: TeamMember;
  onMemberChange: (index: number, member: TeamMember) => void;
  onMemberDelete: (index: number) => void;
  errors: FormErrors;
}

export const TeamMemberRow: React.FC<TeamMemberRowProps> = ({
  index,
  member,
  onMemberChange,
  onMemberDelete,
  errors,
}) => {
  const handleChange = (field: keyof TeamMember, value: string) => {
    onMemberChange(index, { ...member, [field]: value });
  };

  const getErrorClass = (field: string) => {
    return errors[`member_${index}_${field}`] ? 'is-invalid' : '';
  };

  return (
    <tr>
      <td>
        <input
          type="text"
          className={getErrorClass('name')}
          placeholder="Member Name"
          value={member.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
        {errors[`member_${index}_name`] && (
          <span className="form-error">{errors[`member_${index}_name`]}</span>
        )}
      </td>
      <td>
        <input
          type="text"
          className={getErrorClass('position')}
          placeholder="Position"
          value={member.position}
          onChange={(e) => handleChange('position', e.target.value)}
        />
        {errors[`member_${index}_position`] && (
          <span className="form-error">{errors[`member_${index}_position`]}</span>
        )}
      </td>
      <td>
        <input
          type="email"
          className={getErrorClass('email')}
          placeholder="Email"
          value={member.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
        {errors[`member_${index}_email`] && (
          <span className="form-error">{errors[`member_${index}_email`]}</span>
        )}
      </td>
      <td className="text-center">
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => onMemberDelete(index)}
        >
          🗑️ Delete
        </button>
      </td>
    </tr>
  );
};
