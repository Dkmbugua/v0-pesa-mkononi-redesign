"use client";
import { useState, useEffect } from "react";

type ProfileModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved?: (profile: { name: string; occupation: string }) => void;
};

export default function ProfileModal({ open, onClose, onSaved }: ProfileModalProps) {
  const [name, setName] = useState("");
  const [occupation, setOccupation] = useState("");

  useEffect(() => {
    if (open) {
      fetch("/api/profile")
        .then(res => res.json())
        .then(data => {
          setName(data.name || "");
          setOccupation(data.occupation || "");
        });
    }
  }, [open]);

  async function handleSave() {
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, occupation }),
    });
    onSaved && onSaved({ name, occupation });
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="font-bold mb-4">Edit Profile</h2>
        <label className="block mb-1">Name</label>
        <input
          className="border p-2 w-full mb-3"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your Name"
        />
        <label className="block mb-1">Occupation</label>
        <select
          className="border p-2 w-full mb-3"
          value={occupation}
          onChange={e => setOccupation(e.target.value)}
        >
          <option value="">Select Occupation</option>
          <option value="Student">Student</option>
          <option value="Lecturer">Lecturer</option>
          <option value="Entrepreneur">Entrepreneur</option>
          <option value="Other">Other</option>
        </select>
        <div className="flex justify-end gap-2">
          <button className="px-3 py-1" onClick={onClose}>Cancel</button>
          <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
