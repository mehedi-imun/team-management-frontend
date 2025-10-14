import { useState } from "react";
import { TeamFormPage } from "./pages/TeamFormPage";
import { TeamListPage } from "./pages/TeamListPage";
import type { ITeam } from "./types";

export const App: React.FC = () => {
  // null = show list, otherwise show form with team
  const [editingTeam, setEditingTeam] = useState<ITeam | null>(null);

  // Handler when user clicks "Create New Team"
  const handleCreateTeam = () => {
    setEditingTeam(null); // form will be in "create" mode
  };

  // Handler when user clicks "Edit Team"
  const handleEditTeam = (team: ITeam) => {
    setEditingTeam(team);
  };

  // Handler after save or exit
  const handleFormExit = () => {
    setEditingTeam(null); // back to list
  };

  return (
    <div>
      {editingTeam !== null || editingTeam === null ? (
        <TeamFormPage
          team={editingTeam}
          onSave={handleFormExit}
          onExit={handleFormExit}
        />
      ) : (
        <TeamListPage
          onEditTeam={(teamId) => handleEditTeam({ _id: teamId } as ITeam)}
          onCreateTeam={handleCreateTeam}
        />
      )}
    </div>
  );
};

export default App;
