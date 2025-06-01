"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Eye, EyeOff } from "lucide-react";

// This page lets the user set a new password after clicking the reset link in their email.
// After a successful reset, the user is redirected to the dashboard.

// Inner component with the actual reset logic
function ResetPasswordInner() {
  const [password, setPassword] = useState(""); // Stores the new password
  const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
  const [error, setError] = useState(""); // Stores any error messages
  const [success, setSuccess] = useState(false); // Tracks if reset was successful
  const [sessionReady, setSessionReady] = useState(false); // Tracks if session is set
  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();

  // On mount, exchange the access_token for a session if present
  useEffect(() => {
    const code = searchParams.get("code");
    const email = searchParams.get("email");
    if (code && email) {
      supabase.auth
        .verifyOtp({ type: "recovery", token: code, email })
        .then(({ error }) => {
          if (error) setError(error.message);
          setSessionReady(true);
        });
    } else {
      setError("Invalid or missing code/email.");
      setSessionReady(false);
    }
    // eslint-disable-next-line
  }, []);

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

  if (!sessionReady) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleReset} className="max-w-md mx-auto mt-10 p-8 bg-white rounded shadow relative">
      <h2 className="text-2xl font-bold mb-4">Set New Password</h2>
      <div className="relative mb-2">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="New Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 border rounded pr-10"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(v => !v)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">Password reset! Redirecting...</div>}
      <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
        Reset Password
      </button>
    </form>
  );
}

// Export the page wrapped in Suspense
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordInner />
    </Suspense>
  );
} 