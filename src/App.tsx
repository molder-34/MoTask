import React, { useEffect } from "react";
import { useAuthStore } from "./stores/authStore";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
}

export default App;
