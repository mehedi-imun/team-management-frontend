interface Props {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCount: number;
  onBulkDelete: () => void;
}

const TeamsSearchBar = ({
  searchQuery,
  onSearchChange,
  selectedCount,
  onBulkDelete,
}: Props) => (
  <div className="actions-bar">
    <div className="search-box">
      <input
        type="text"
        className="search-input"
        placeholder="Search teams or members..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <span className="search-icon">🔍</span>
    </div>
    {selectedCount > 0 && (
      <button className="btn btn-danger" onClick={onBulkDelete}>
        Delete Selected ({selectedCount})
      </button>
    )}
  </div>
);

export default TeamsSearchBar;
