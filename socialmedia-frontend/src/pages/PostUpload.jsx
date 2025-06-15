import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PostUpload() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!image) {
      setMsg("❌ Please select an image.");
    console.log("uploading image");
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", image);

    try {
      const {data} = await axios.post("http://localhost:5000/api/posts/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMsg(data.message || "✅ Post created!");
      setCaption("");
      setImage(null);
      navigate("/"); 
    } catch (error) {
      const status = error.response?.status;
      console.log("upload failed, " , error);
      if (status === 403) setMsg("❌ You are not approved to post.");
      else if (status === 400) setMsg("❌ Image is required.");
      else setMsg("❌ Something went wrong. Try again.");
    }
  }; 
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Upload Post</h2>

        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Caption"
          className="w-full border px-4 py-2 mb-4 rounded"
          required
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">Select Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Post
        </button>

        {msg && <p className="mt-4 text-center text-sm text-red-500">{msg}</p>}
      </form>
    </div>
  );
}
