import type { IMember } from '../types/index';

interface TeamMemberRowProps {
  member: IMember;
  index: number;
  errors: {
    name?: string;
    position?: string;
    email?: string;
  };
  onChange: (index: number, field: keyof IMember, value: string) => void;
  onDelete: (index: number) => void;
}

const TeamMemberRow = ({ member, index, errors, onChange, onDelete }: TeamMemberRowProps) => {
  return (
    <div className="member-row">
      <div className="member-row-number">{index + 1}</div>
      <div className="member-row-content">
        <div className="form-group" style={{ marginBottom: '12px' }}>
          <label className="form-label required">Name</label>
          <input
            type="text"
            className={`form-input ${errors.name ? 'error' : ''}`}
            value={member.name}
            onChange={e => onChange(index, 'name', e.target.value)}
            placeholder="Enter member name"
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        <div className="form-group" style={{ marginBottom: '12px' }}>
          <label className="form-label required">Position</label>
          <input
            type="text"
            className={`form-input ${errors.position ? 'error' : ''}`}
            value={member.position}
            onChange={e => onChange(index, 'position', e.target.value)}
            placeholder="Enter position"
          />
          {errors.position && <div className="error-message">{errors.position}</div>}
        </div>
        <div className="form-group" style={{ marginBottom: '0' }}>
          <label className="form-label required">Email</label>
          <input
            type="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            value={member.email}
            onChange={e => onChange(index, 'email', e.target.value)}
            placeholder="Enter email"
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
      </div>
      <button
        type="button"
        className="btn-icon"
        onClick={() => onDelete(index)}
        title="Remove member"
      >
        🗑️
      </button>
    </div>
  );
};

export default TeamMemberRow;
