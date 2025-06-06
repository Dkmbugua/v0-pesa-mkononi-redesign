"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Eye, EyeOff } from "lucide-react";

// This is the Login page. It collects email and password from the user.
// Later, you can connect this to Firebase for real authentication.

// Inner component with the actual login logic
function LoginPageInner() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const searchParams = useSearchParams();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    // Define an async function inside useEffect
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) router.replace("/dashboard");
    };
    checkUser(); // Call the async function
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
    // Use the default Supabase password reset flow
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `https://v0-pesa-mkononi-redesign-wdx4.vercel.app/login`,
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
      <div className="relative mb-2">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
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

// Export the page wrapped in Suspense to fix useSearchParams error
export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageInner />
    </Suspense>
  );
} 