"use client"

import { ArrowUpRight, ArrowDownRight, LightbulbIcon, Coffee, Bus, Gamepad2, BookOpen } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import type { User } from '@supabase/supabase-js'
import { useRouter } from "next/navigation"

// Sample data for the weekly expenses chart
const weeklyData = [
  { name: "Mon", amount: 300 },
  { name: "Tue", amount: 100 },
  { name: "Wed", amount: 550 },
  { name: "Thu", amount: 200 },
  { name: "Fri", amount: 750 },
  { name: "Sat", amount: 500 },
  { name: "Sun", amount: 300 },
]

// Sample data for recent transactions
const recentTransactions = [
  {
    category: "Food",
    description: "Lunch at campus",
    amount: -450,
    date: "Today",
    icon: Coffee,
  },
  {
    category: "Transport",
    description: "Bus fare",
    amount: -200,
    date: "Today",
    icon: Bus,
  },
  {
    category: "Entertainment",
    description: "Movie with friends",
    amount: -1200,
    date: "Yesterday",
    icon: Gamepad2,
  },
  {
    category: "Education",
    description: "Books purchase",
    amount: -3000,
    date: "2 days ago",
    icon: BookOpen,
  },
]

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      console.log("Dashboard user:", user);
      setUser(user);
      if (!user) {
        router.replace("/login");
      }
    })
  }, [router])

  if (!user) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Hello, {user ? user.user_metadata.full_name || user.email : "Loading..."} 👋</h1>
          <p className="text-gray-500">Here's your financial overview</p>
        </div>
        <Button variant="outline" className="mt-2 md:mt-0">
          My Profile
        </Button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="balance-card">
          <div className="space-y-2">
            <p className="text-primary-foreground/80">Current Balance</p>
            <h2 className="text-3xl font-bold">KSh 15,420</h2>
            <div className="flex items-center text-primary-foreground/90 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span>+3.2% from last month</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-gray-500">Total Income</p>
            <h2 className="text-3xl font-bold">KSh 25,000</h2>
            <div className="flex items-center text-primary text-sm">
              <span>Bursary received</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-gray-500">Total Expenses</p>
            <h2 className="text-3xl font-bold">KSh 9,580</h2>
            <div className="flex items-center text-red-500 text-sm">
              <ArrowDownRight className="w-4 h-4 mr-1" />
              <span>-12% from last month</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Expenses Chart */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Weekly Expenses</h3>
          <Button variant="outline" size="sm" className="text-xs">
            This Week
          </Button>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#A8D08D"
                strokeWidth={2}
                dot={{ r: 4, fill: "#A8D08D", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#A8D08D", strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* AI Tip and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 border-l-4 border-l-yellow-400 bg-yellow-50">
          <div className="flex items-start space-x-3">
            <div className="bg-yellow-100 p-2 rounded-full">
              <LightbulbIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">AI Tip of the Day</h3>
              <p className="text-gray-700 mt-1">
                You've been spending 30% more on food this month. Consider meal prepping to save up to KSh 2,000 weekly!
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Recent Transactions</h3>
            <Button variant="link" className="text-primary p-0">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: getCategoryColor(transaction.category) }}
                  >
                    <transaction.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{transaction.category}</p>
                    <p className="text-xs text-gray-500">{transaction.description}</p>
                    <p className="text-xs text-gray-400">{transaction.date}</p>
                  </div>
                </div>
                <span className="font-medium text-red-500">{formatCurrency(transaction.amount)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Welcome Message */}
      <Card className="p-4 bg-gray-50">
        <p className="text-center">
          <span className="font-medium">Welcome back, {user ? user.user_metadata.full_name || user.email : "Loading..."}!</span> You've saved KSh 1,200 this week. Great job!
        </p>
      </Card>
    </div>
  )
}

// Helper function to get category color
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Food: "#2196F3",
    Transport: "#A8D08D",
    Entertainment: "#FFEB3B",
    Education: "#FF5722",
    Rent: "#9C27B0",
    Shopping: "#E91E63",
    School: "#673AB7",
    Home: "#3F51B5",
    Cafe: "#FF9800",
  }

  return colors[category] || "#A8D08D"
}

// Helper function to format currency
function formatCurrency(amount: number): string {
  return `${amount < 0 ? "-" : ""}KSh ${Math.abs(amount).toLocaleString()}`
}
