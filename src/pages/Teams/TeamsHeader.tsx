interface Props {
  onNewTeam: () => void;
}

const TeamsHeader = ({ onNewTeam }: Props) => (
  <div className="page-header">
    <h1 className="page-title">Team Management</h1>
    <button className="btn btn-primary" onClick={onNewTeam}>
      + New Team
    </button>
  </div>
);

export default TeamsHeader;
