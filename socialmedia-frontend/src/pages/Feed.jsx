import React, { useEffect, useState } from "react";
import axios from "axios";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get("https://social-media-app-with-admin-panel.onrender.com/api/posts");
        setPosts(data);
      } catch (err) {
        setMsg("❌ Failed to fetch posts");
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Feed</h1>
      

      {msg && <p className="text-red-500 text-sm mb-4">{msg}</p>}

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {posts.length === 0 ? (
          <p className="text-gray-600">No approved posts yet.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white p-4 rounded shadow-md flex flex-col"
            >
              <img
                src={`https://social-media-app-with-admin-panel.onrender.com/uploads/${post.image}`}
                alt={post.caption}
                className="rounded w-full h-64 object-cover mb-4"
              />
              <h3 className="font-semibold text-lg">{post.caption}</h3>
              <p className="text-sm text-gray-600 mt-2">
                Posted by: {post.owner?.username || "Unknown"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
