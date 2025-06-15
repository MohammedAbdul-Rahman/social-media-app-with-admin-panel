import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUser = user || storedUser;

  if (!currentUser || ["/login", "/register"].includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 shadow flex justify-between items-center">
      <Link to="/" className="text-lg font-semibold">
        Social Media App
      </Link>
      <div className="flex items-center space-x-4">
        <Link
          to="/upload"
          className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-200"
        >
          Upload Post
        </Link>

        {currentUser.role === "admin" && (
          <>
            <Link
              to="/admin"
              className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-200"
            >
              Admin Panel
            </Link>
            <Link
              to="/user-approval"
              className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-200"
            >
              User Approval
            </Link>
          </>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
