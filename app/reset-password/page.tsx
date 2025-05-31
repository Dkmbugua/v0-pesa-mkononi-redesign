"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

// This page lets the user set a new password after clicking the reset link in their email.
// After a successful reset, the user is redirected to the dashboard.
export default function ResetPasswordPage() {
  const [password, setPassword] = useState(""); // Stores the new password
  const [error, setError] = useState(""); // Stores any error messages
  const [success, setSuccess] = useState(false); // Tracks if reset was successful
  const router = useRouter();
  const supabase = createClient();

  // Handles the password reset form submission
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page reload
    setError(""); // Clear previous errors
    // Try to update the user's password using Supabase
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message); // Show error if any
    } else {
      setSuccess(true); // Mark as successful
      // Redirect to dashboard after a short delay
      setTimeout(() => router.replace("/dashboard"), 1500);
    }
  };

  return (
    <form onSubmit={handleReset} className="max-w-md mx-auto mt-10 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Set New Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">Password reset! Redirecting...</div>}
      <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
        Reset Password
      </button>
    </form>
  );
} 