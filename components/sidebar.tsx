"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, PlusCircle, Clock, PiggyBank, Award, User } from "lucide-react"
import { useEffect, useState } from "react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

export default function Sidebar() {
  const pathname = usePathname()
  const [profileRefreshKey, setProfileRefreshKey] = useState(0)

  const isActive = (path: string) => {
    return pathname === path
  }

  function handleProfileSaved() {
    setProfileRefreshKey(k => k + 1)
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-primary">Pesa Mkononi</h1>
        <p className="text-xs text-gray-500">Built for Kenyan Students. 🇰🇪</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          href="/dashboard"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
            isActive("/dashboard") ? "sidebar-active" : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/expenses/new"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
            isActive("/expenses/new") ? "sidebar-active" : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add Expense</span>
        </Link>

        <Link
          href="/budget"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
            isActive("/budget") ? "sidebar-active" : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Clock className="w-5 h-5" />
          <span>AI Budget</span>
        </Link>

        <Link
          href="/goals"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
            isActive("/goals") ? "sidebar-active" : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <PiggyBank className="w-5 h-5" />
          <span>Savings Goals</span>
        </Link>

        <Link
          href="/rewards"
          className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
            isActive("/rewards") ? "sidebar-active" : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Award className="w-5 h-5" />
          <span>Rewards</span>
        </Link>
      </nav>

      <div className="p-4 border-t flex items-center space-x-3">
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 focus:outline-none">
              <User className="w-5 h-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <ProfileForm />
          </PopoverContent>
        </Popover>
        <SidebarProfile refreshKey={profileRefreshKey} />
      </div>
    </div>
  )
}

export function SidebarProfile({ refreshKey }: { refreshKey: number }) {
  const [profile, setProfile] = useState({ name: "", occupation: "" });

  useEffect(() => {
    fetch("/api/profile")
      .then(res => res.json())
      .then(data => setProfile(data));
  }, [refreshKey]);

  return (
    <div className="p-4">
      <div className="font-bold">{profile.name || "Your Name"}</div>
      <div className="text-sm text-gray-500">{profile.occupation || "Occupation"}</div>
    </div>
  );
}

function ProfileForm() {
  const [name, setName] = useState("");
  const [occupation, setOccupation] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then(res => res.json())
      .then(data => {
        setName(data.name || "");
        setOccupation(data.occupation || "");
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

  return (
    <div>
      <h2 className="font-bold mb-2">Edit Profile</h2>
      <input
        className="border p-2 w-full mb-2"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Your Name"
      />
      <input
        className="border p-2 w-full mb-2"
        value={occupation}
        onChange={e => setOccupation(e.target.value)}
        placeholder="Occupation"
      />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
}
