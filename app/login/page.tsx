"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

// This is the Login page. It collects email and password from the user.
// Later, you can connect this to Firebase for real authentication.
export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/dashboard");
    });
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (isSignUp) {
      // Sign Up
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        alert("Check your email for a confirmation link!");
      }
    } else {
      // Sign In
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.replace("/dashboard");
      }
    }
  };

  async function handleForgotPassword() {
    if (!email) {
      alert("Please enter your email above first.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://your-app-url.com/reset-password", // Change to your reset page
    });
    if (error) {
      alert("Error sending reset email: " + error.message);
    } else {
      alert("Password reset email sent! Check your inbox.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{isSignUp ? "Sign Up" : "Sign In"}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
        {isSignUp ? "Sign Up" : "Sign In"}
      </button>
      <div className="mt-4 text-center">
        {isSignUp ? (
          <span>
            Already have an account?{" "}
            <button type="button" className="text-blue-600 underline" onClick={() => setIsSignUp(false)}>
              Sign In
            </button>
          </span>
        ) : (
          <span>
            Don't have an account?{" "}
            <button type="button" className="text-blue-600 underline" onClick={() => setIsSignUp(true)}>
              Sign Up
            </button>
          </span>
        )}
      </div>
      <button type="button" onClick={handleForgotPassword} className="text-blue-500 text-sm">
        Forgot Password?
      </button>
    </form>
  );
} 