import { useState } from "react";
import type { Team } from "./types";
import { TeamListPage } from "./pages/TeamListPage";
import { TeamFormPage } from "./pages/TeamFormPage";

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'list' | 'form'>('list');
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setCurrentPage('form');
  };

  const handleAddNew = () => {
    setEditingTeam(null);
    setCurrentPage('form');
  };

  const handleSaveTeam = () => {
    setCurrentPage('list');
    setEditingTeam(null);
  };

  const handleExitForm = () => {
    setCurrentPage('list');
    setEditingTeam(null);
  };

  return (
    <>
     
      {currentPage === 'list' ? (
        <TeamListPage onEdit={handleEditTeam} onAddNew={handleAddNew} />
      ) : (
        <TeamFormPage
          team={editingTeam}
          onSave={handleSaveTeam}
          onExit={handleExitForm}
        />
      )}
    </>
  );
};

export default App;