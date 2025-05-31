"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

// This button logs the user out and redirects to the login page.
export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  // Handles the logout process
  const handleLogout = async () => {
    await supabase.auth.signOut(); // Log out the user
    router.replace("/login"); // Redirect to login page
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full bg-red-600 text-white p-2 rounded mt-4"
    >
      Logout
    </button>
  );
} 