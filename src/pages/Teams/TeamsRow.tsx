import ThreeStateCheckbox from "../../components/ThreeStateCheckbox";
import type { ITeam } from "../../types";
import MembersList from "./MembersList";

interface Props {
  team: ITeam;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  onToggleExpand: () => void;
  onEditTeam: (team: ITeam) => void;
  onDeleteTeam: (teamId: string) => void;
  onStatusChange: (
    teamId: string,
    field: "managerApproved" | "directorApproved",
    value: string
  ) => void;
  editingMembers: Record<string, string>;
  onEditMember: (memberId: string, value: string) => void;
  onSaveMember: (teamId: string, memberId: string) => void;
  onDeleteMember: (teamId: string, memberId: string) => void;
  index: number;
  handleDragStart: (index: number) => void;
  handleDragEnter: (index: number) => void;
  handleDragEnd: () => void;
}

const TeamsRow = ({
  team,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpand,
  onEditTeam,
  onDeleteTeam,
  onStatusChange,
  editingMembers,
  onEditMember,
  onSaveMember,
  onDeleteMember,
  index,
  handleDragStart,
  handleDragEnter,
  handleDragEnd,
}: Props) => (
  <>
    <tr
      className={isSelected ? "selected" : ""}
      draggable
      onDragStart={() => handleDragStart(index)}
      onDragEnter={() => handleDragEnter(index)}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => e.preventDefault()}
    >
      <td>
        <input
          type="checkbox"
          className="checkbox"
          checked={isSelected}
          onChange={onSelect}
        />
      </td>
      <td>
        <span className="drag-handle">⋮⋮</span>
      </td>
      <td>{team.name}</td>
      <td>{team.description}</td>
      <td>
        <ThreeStateCheckbox
          status={team.managerApproved || "0"}
          onChange={(status) =>
            onStatusChange(team._id, "managerApproved", status)
          }
        />
      </td>
      <td>
        <ThreeStateCheckbox
          status={team.directorApproved || "0"}
          onChange={(status) =>
            onStatusChange(team._id, "directorApproved", status)
          }
        />
      </td>
      <td>
        <div className="action-buttons">
          <button className="icon-btn expand" onClick={onToggleExpand}>
            {isExpanded ? "▼" : "▶"}
          </button>
          <button className="icon-btn edit" onClick={() => onEditTeam(team)}>
            ✏️
          </button>
          <button
            className="icon-btn delete"
            onClick={() => onDeleteTeam(team._id)}
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
    {isExpanded && team.members.length > 0 && (
      <tr className="member-details">
        <td colSpan={9}>
          <MembersList
            teamId={team._id}
            members={team.members}
            editingMembers={editingMembers}
            onEditMember={onEditMember}
            onSaveMember={onSaveMember}
            onDeleteMember={onDeleteMember}
          />
        </td>
      </tr>
    )}
  </>
);

export default TeamsRow;
