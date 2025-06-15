import React, { useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import AuthProvider, { AuthContext } from "./context/AuthContext";
import MainRoutes from "./MainRoutes";

function AppContent() {
  const { loading } = useContext(AuthContext);
  if (loading) return <div className="p-10 text-center">Loading...</div>;
  return <MainRoutes />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
