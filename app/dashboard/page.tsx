"use client"

import { ArrowUpRight, ArrowDownRight, LightbulbIcon, Coffee, Bus, Gamepad2, BookOpen } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import type { User } from '@supabase/supabase-js'
import { useRouter } from "next/navigation"
import ProfileModal from "@/components/ProfileModal"

export const dynamic = "force-dynamic";

type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: string;
};

// Helper to get the start of the current week (Monday)
function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  return new Date(d.setDate(diff));
}

// Helper to get the start and end of a month
function getMonthRange(offset = 0) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);
  return { start, end };
}

// Helper to get start/end of last week
function getLastWeekRange() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 7 - (start.getDay() === 0 ? 6 : start.getDay() - 1));
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
}

// Prepare weekly data from transactions
function getWeeklyData(transactions: Transaction[]) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const startOfWeek = getStartOfWeek(today);

  // Initialize amounts for each day
  const data = days.map((name, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return { name, amount: 0, date: date.toDateString() };
  });

  transactions.forEach((t) => {
    if (t.type === "expense") {
      const tDate = new Date(t.date);
      // Only include transactions from this week
      if (tDate >= startOfWeek && tDate <= today) {
        const dayIndex = tDate.getDay() === 0 ? 6 : tDate.getDay() - 1; // Sunday is 6
        data[dayIndex].amount += t.amount;
      }
    }
  });

  return data;
}

// Get total for a given month and type (income or expense)
function getMonthTotals(transactions: Transaction[], type: string, date: Date) {
  const month = date.getMonth();
  const year = date.getFullYear();
  return transactions
    .filter(t => t.type === type && new Date(t.date).getMonth() === month && new Date(t.date).getFullYear() === year)
    .reduce((sum, t) => sum + t.amount, 0);
}

// Calculate percent change between two numbers
function getPercentChange(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return (((current - previous) / Math.abs(previous)) * 100).toFixed(1);
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ name: "", occupation: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [graphPeriod, setGraphPeriod] = useState('thisWeek');
  const [customRange, setCustomRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      console.log("Dashboard user:", user);
      setUser(user);
      if (!user) {
        router.replace("/login");
      }
    })
  }, [router])

  useEffect(() => {
    async function fetchTransactions() {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(data.transactions);
      setLoading(false);
    }
    fetchTransactions();
  }, []);

  useEffect(() => {
    fetch("/api/profile")
      .then(res => res.json())
      .then(data => setProfile(data));
  }, []);

  if (!user) return <div>Loading...</div>;

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpenses;

  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const thisMonthIncome = getMonthTotals(transactions, "income", now);
  const lastMonthIncome = getMonthTotals(transactions, "income", lastMonth);
  const incomeChange = getPercentChange(thisMonthIncome, lastMonthIncome);

  const thisMonthExpenses = getMonthTotals(transactions, "expense", now);
  const lastMonthExpenses = getMonthTotals(transactions, "expense", lastMonth);
  const expenseChange = getPercentChange(thisMonthExpenses, lastMonthExpenses);

  // Get data for selected period
  function getGraphData() {
    let start: Date, end: Date;
    if (graphPeriod === 'thisWeek') {
      start = getStartOfWeek(new Date());
      end = new Date();
    } else if (graphPeriod === 'lastWeek') {
      const range = getLastWeekRange();
      start = range.start;
      end = range.end;
    } else if (graphPeriod === 'thisMonth') {
      const range = getMonthRange(0);
      start = range.start;
      end = range.end;
    } else if (graphPeriod === 'lastMonth') {
      const range = getMonthRange(-1);
      start = range.start;
      end = range.end;
    } else if (graphPeriod === 'custom' && customRange.start && customRange.end) {
      start = customRange.start;
      end = customRange.end;
    } else {
      start = getStartOfWeek(new Date());
      end = new Date();
    }
    // Prepare data for the selected range
    const days: { name: string; expense: number; income: number; date: string }[] = [];
    let d = new Date(start);
    while (d <= end) {
      days.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        expense: 0,
        income: 0,
        date: d.toDateString(),
      });
      d = new Date(d);
      d.setDate(d.getDate() + 1);
    }
    transactions.forEach((t) => {
      const tDate = new Date(t.date);
      if (tDate >= start && tDate <= end) {
        const dayIndex = Math.floor((tDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        if (dayIndex >= 0 && dayIndex < days.length) {
          if (t.type === "expense") days[dayIndex].expense += t.amount;
          if (t.type === "income") days[dayIndex].income += t.amount;
        }
      }
    });
    return days;
  }

  function handleProfileSaved(newProfile: { name: string; occupation: string }) {
    setProfile(newProfile);
    // Optionally, reload data or refresh page
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Hello, {profile.name || "User"} 👋</h1>
          <p className="text-gray-500">Here's your financial overview</p>
        </div>
        <Button variant="outline" className="mt-2 md:mt-0" onClick={() => setModalOpen(true)}>
          My Profile
        </Button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="balance-card">
          <div className="space-y-2">
            <p className="text-primary-foreground/80">Current Balance</p>
            <h2 className="text-3xl font-bold">KSh {currentBalance.toLocaleString()}</h2>
            <div className="flex items-center text-primary-foreground/90 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span>
                {Number(incomeChange) > 0 ? "+" : ""}
                {incomeChange}% from last month
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-gray-500">Total Income</p>
            <h2 className="text-3xl font-bold">KSh {totalIncome.toLocaleString()}</h2>
            <div className="flex items-center text-primary text-sm">
              <span>Bursary received</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-gray-500">Total Expenses</p>
            <h2 className="text-3xl font-bold">KSh {totalExpenses.toLocaleString()}</h2>
            <div className="flex items-center text-red-500 text-sm">
              <ArrowDownRight className="w-4 h-4 mr-1" />
              <span>
                {Number(expenseChange) > 0 ? "+" : ""}
                {expenseChange}% from last month
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Expenses & Income Chart */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Expenses & Income Chart</h3>
          <div className="flex gap-2 items-center">
            <select
              value={graphPeriod}
              onChange={e => setGraphPeriod(e.target.value)}
              className="border rounded p-1 text-xs"
            >
              <option value="thisWeek">This Week</option>
              <option value="lastWeek">Last Week</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="custom">Custom Range</option>
            </select>
            {graphPeriod === 'custom' && (
              <>
                <input
                  type="date"
                  value={customRange.start ? customRange.start.toISOString().slice(0, 10) : ''}
                  onChange={e => setCustomRange(r => ({ ...r, start: e.target.value ? new Date(e.target.value) : null }))}
                  className="border rounded p-1 text-xs"
                />
                <span>-</span>
                <input
                  type="date"
                  value={customRange.end ? (customRange.end as Date).toISOString().slice(0, 10) : ''}
                  onChange={e => setCustomRange(r => ({ ...r, end: e.target.value ? new Date(e.target.value) : null }))}
                  className="border rounded p-1 text-xs"
                />
              </>
            )}
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={getGraphData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" name="Expenses" />
              <Line type="monotone" dataKey="income" stroke="#22c55e" name="Income" />
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
            {transactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: getCategoryColor(transaction.category) }}
                  >
                    {/* Optionally, map category to icon here */}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.category}</p>
                    <p className="text-xs text-gray-500">{transaction.description}</p>
                    <p className="text-xs text-gray-400">{new Date(transaction.date).toLocaleDateString()}</p>
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
          <span className="font-medium">Welcome back, {profile.name || "User"}!</span> You've saved KSh {Math.abs(Math.round(Math.max(0, currentBalance))).toLocaleString()} this week. Great job!
        </p>
      </Card>

      <ProfileModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleProfileSaved}
      />
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
