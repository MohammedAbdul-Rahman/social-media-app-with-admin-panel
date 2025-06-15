import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import PostUpload from "./pages/PostUpload";
import AdminPanel from "./pages/AdminPanel";
import UserApprovalPanel from "./pages/UserApprovalPanel";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import { AuthContext } from "./context/AuthContext";

export default function MainRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Feed />
            </PrivateRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <PostUpload />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPanel />
            </PrivateRoute>
          }
        />
        <Route
          path="/user-approval"
          element={
            <PrivateRoute>
              <UserApprovalPanel />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}
