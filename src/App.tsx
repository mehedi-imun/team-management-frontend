import { useState } from "react";
import TeamForm from "./pages/TeamForm";
import Teams from "./pages/Teams";

import "./styles/teams.css";
import type { ITeam } from "./types";

function App() {
  const [currentView, setCurrentView] = useState<"list" | "form">("list");
  const [editingTeam, setEditingTeam] = useState<ITeam | null>(null);

  const handleNewTeam = () => {
    setEditingTeam(null);
    setCurrentView("form");
  };

  const handleEditTeam = (team: ITeam) => {
    setEditingTeam(team);
    setCurrentView("form");
  };

  const handleBackToList = () => {
    setEditingTeam(null);
    setCurrentView("list");
  };

  return (
    <>
      {currentView === "list" ? (
        <Teams onNewTeam={handleNewTeam} onEditTeam={handleEditTeam} />
      ) : (
        <TeamForm team={editingTeam} onBack={handleBackToList} />
      )}
    </>
  );
}

export default App;
