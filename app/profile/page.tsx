"use client";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch profile data from your API
    fetch("/api/profile")
      .then(res => res.json())
      .then(data => {
        setName(data.name || "");
        setOccupation(data.occupation || "");
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, occupation }),
    });
    alert("Profile updated!");
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <label className="block mb-2">Name:</label>
      <input
        className="border p-2 w-full mb-4"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <label className="block mb-2">Occupation:</label>
      <input
        className="border p-2 w-full mb-4"
        value={occupation}
        onChange={e => setOccupation(e.target.value)}
      />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
}
