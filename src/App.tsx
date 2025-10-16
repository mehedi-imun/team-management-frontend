import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import TeamForm from "./pages/TeamForm";
import Teams from "./pages/Teams";
import type { RootState } from "./redux/store";
import "./styles/teams.css";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <Teams onNewTeam={() => {}} onEditTeam={() => {}} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams/new"
          element={
            <ProtectedRoute>
              <TeamForm team={null} onBack={() => {}} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams/:id/edit"
          element={
            <ProtectedRoute>
              <TeamForm team={null} onBack={() => {}} />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/teams" replace />} />
        <Route path="*" element={<Navigate to="/teams" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
