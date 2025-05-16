"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, PlusCircle, Clock, PiggyBank, Award, User } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
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
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
          <User className="w-5 h-5" />
        </div>
        <div>
          <p className="font-medium">Kimani Wanjiku</p>
          <p className="text-xs text-gray-500">Student</p>
        </div>
      </div>
    </div>
  )
}
