import type { IMember } from "../../types";

interface Props {
  teamId: string;
  members: IMember[];
  editingMembers: Record<string, string>;
  onEditMember: (memberId: string, value: string) => void;
  onSaveMember: (teamId: string, memberId: string) => void;
  onDeleteMember: (teamId: string, memberId: string) => void;
}

const MembersList = ({
  teamId,
  members,
  editingMembers,
  onEditMember,
  onSaveMember,
  onDeleteMember,
}: Props) => (
  <div className="members-list">
    {members.map((member) => {
      const isEditing = editingMembers[member._id!] !== undefined;
      const memberName = isEditing ? editingMembers[member._id!] : member.name;
      return (
        <div key={member._id} className="member-item">
          <input
            className="form-input"
            type="text"
            value={memberName}
            readOnly={!isEditing}
            onChange={(e) => onEditMember(member._id!, e.target.value)}
            placeholder="Name"
          />
          {isEditing ? (
            <button
              className="icon-btn save"
              onClick={() => onSaveMember(teamId, member._id!)}
            >
              💾
            </button>
          ) : (
            <button
              className="icon-btn edit"
              onClick={() => onEditMember(member._id!, member.name)}
            >
              ✏️
            </button>
          )}
          <button
            className="icon-btn delete"
            onClick={() => onDeleteMember(teamId, member._id!)}
          >
            🗑️
          </button>
        </div>
      );
    })}
  </div>
);

export default MembersList;
