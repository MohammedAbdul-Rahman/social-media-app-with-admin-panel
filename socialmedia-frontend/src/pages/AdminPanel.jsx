import React, { useEffect, useState } from "react";
import axios from "axios";
import authHeader from "../services/authHeader";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return nav("/login");

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role !== "admin") {
        alert("Access denied: Admins only");
        return nav("/");
      }
    } catch (err) {
      console.error("❌ Invalid token:", err);
      nav("/login");
    }
  }, [nav]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://social-media-app-with-admin-panel.onrender.com/api/posts/unapproved",
        {
          headers: authHeader(),
        }
      );
      setPosts(res.data);
    } catch (err) {
      console.error("❌ Fetch error:", err.message);
      setError("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(
        `https://social-media-app-with-admin-panel.onrender.com/api/posts/approve/${id}`,
        {},
        { headers: authHeader() }
      );
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Approval failed");
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Panel: Pending Posts</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {posts.length === 0 && !loading ? (
        <p>No pending posts to review.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div key={post._id} className="border rounded shadow p-4">
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="w-full h-48 object-cover rounded mb-2"
              />
              <p className="font-semibold">{post.caption}</p>
              <p className="text-sm text-gray-500">
                By: {post.owner?.username || "Unknown"}
              </p>
              <button
                onClick={() => handleApprove(post._id)}
                className="mt-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
