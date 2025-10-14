import { useState } from "react";
import { TeamFormPage } from "./pages/TeamFormPage";
import { TeamListPage } from "./pages/TeamListPage";
import type { ITeam } from "./types";

export const App: React.FC = () => {
  // null = show form in create mode, undefined = show list
  const [editingTeam, setEditingTeam] = useState<ITeam | null | undefined>(undefined);

  // Handler when user clicks "Create New Team"
  const handleCreateTeam = () => {
    setEditingTeam(null); // show form in "create" mode
  };

  // Handler when user clicks "Edit Team"
  const handleEditTeam = (team: ITeam) => {
    setEditingTeam(team); // show form in "edit" mode
  };

  // Handler after save or exit
  const handleFormExit = () => {
    setEditingTeam(undefined); // back to list
  };

  return (
    <div>
      {editingTeam === undefined ? (
        // Show team list
        <TeamListPage
          onEditTeam={(teamId) => handleEditTeam({ _id: teamId } as ITeam)}
          onCreateTeam={handleCreateTeam}
        />
      ) : (
        // Show form (create or edit)
        <TeamFormPage
          team={editingTeam}
          onSave={handleFormExit}
          onExit={handleFormExit}
        />
      )}
    </div>
  );
};

export default App;
