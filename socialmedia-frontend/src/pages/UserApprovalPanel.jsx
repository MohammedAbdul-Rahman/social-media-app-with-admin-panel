import React, { useEffect, useState } from "react";
import axios from "axios";

const UserApprovalPanel = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUnapprovedUsers = async () => {
      try {
        const authHeader = {
          Authorization: `Bearer ${token}`,
        };

        console.log("📡 Sending request with headers:", authHeader);

        const { data } = await axios.get(
          "https://social-media-app-with-admin-panel.onrender.com/api/users/unapproved",
          {
            headers: authHeader,
          }
        );

        console.log("✅ Response from server:", data);

        if (!data.users || !Array.isArray(data.users)) {
          console.warn("⚠️ Unexpected response structure");
          setError("Access denied. Admins only.");
          return;
        }

        setUsers(data.users);
      } catch (err) {
        console.error("❌ Error fetching users:", err.response?.data || err.message);
        setError("Access denied or something went wrong.");
      }
    };

    fetchUnapprovedUsers();
  }, [token]);

  const approveUser = async (userId) => {
    try {
      const authHeader = {
        Authorization: `Bearer ${token}`,
      };

      await axios.put(
        `https://social-media-app-with-admin-panel.onrender.com/api/users/approve/${userId}`,
        {},
        {
          headers: authHeader,
        }
      );

      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("❌ Error approving user:", err.response?.data || err.message);
      alert("Failed to approve user");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Pending User Approvals</h2>

      {users.length === 0 ? (
        <p className="text-gray-600">No users pending approval.</p>
      ) : (
        <ul className="space-y-4">
          {users.map((user) => (
            <li
              key={user._id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-medium text-gray-800">{user.username}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={() => approveUser(user._id)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserApprovalPanel;
