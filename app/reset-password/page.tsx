"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

// This page lets the user set a new password after clicking the reset link in their email.
// After a successful reset, the user is redirected to the dashboard.

// Export the page wrapped in Suspense
export default function ResetPasswordPage() {
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code)
        .then(({ error }) => {
          if (error) {
            setError("Session missing or expired. Please log in again.");
          } else {
            // Redirect to dashboard after successful login
            router.replace("/dashboard");
          }
        });
    } else {
      setError("Invalid or missing code. Please request a new magic link.");
    }
  }, []);

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">
        {error}
        <br />
        <a href="/login" className="text-blue-600 underline">Go to Login</a>
      </div>
    );
  }

  return (
    <div className="text-center mt-10 text-lg">
      Logging you in...
    </div>
  );
} 