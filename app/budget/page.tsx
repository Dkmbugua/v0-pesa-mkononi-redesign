"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Coffee, Bus, Gamepad2, BookOpen, ShoppingBag, Building2, Star, LightbulbIcon } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useState, useEffect } from "react"

type BudgetResult = {
  category: string;
  percent: number;
  amount: number;
};

type Transaction = {
  type: string;
  amount: number;
  date: string;
  // add other fields if needed
};

const categories = [
  { name: "Food", icon: Coffee, color: "#2196F3" },
  { name: "Transport", icon: Bus, color: "#A8D08D" },
  { name: "Entertainment", icon: Gamepad2, color: "#FFEB3B" },
  { name: "Education", icon: BookOpen, color: "#FF5722" },
  { name: "Shopping", icon: ShoppingBag, color: "#E91E63" },
  { name: "Rent", icon: Building2, color: "#9C27B0" },
  { name: "Other", icon: Star, color: "#9E9E9E" }
];

export default function BudgetPage() {
  const [budget, setBudget] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [priorities, setPriorities] = useState<{ [key: string]: string }>({});
  const [percentages, setPercentages] = useState<{ [key: string]: string }>({});
  const [results, setResults] = useState<BudgetResult[]>([]);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    async function fetchTransactions() {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data.transactions || []);
      // Calculate balance
      const income = data.transactions
        .filter((t: Transaction) => t.type === "income")
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
      const expenses = data.transactions
        .filter((t: Transaction) => t.type === "expense")
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
      setCurrentBalance(income - expenses);
      setBudget(income - expenses); // Default budget to current balance
    }
    fetchTransactions();
  }, []);

  useEffect(() => {
    async function fetchSavedBudget() {
      const res = await fetch("/api/budget");
      const data = await res.json();
      if (data.budgets && data.budgets.length > 0) {
        // Group by category: keep the latest or sum the amounts
        const unique: { [key: string]: any } = {};
        data.budgets.forEach((b: any) => {
          // If you want to sum amounts for duplicates, use this:
          if (unique[b.category]) {
            unique[b.category].amount += b.amount;
          } else {
            unique[b.category] = { ...b };
          }
        });
        setResults(Object.values(unique));
      }
    }
    fetchSavedBudget();
  }, [budget]);

  // Handle priority change
  function handlePriorityChange(category: string, value: string) {
    setPriorities(prev => ({ ...prev, [category]: value }));
  }

  // Handle percentage change
  function handlePercentageChange(category: string, value: string) {
    setPercentages(prev => ({ ...prev, [category]: value }));
  }

  async function handleGenerateBudget() {
    const res = await fetch("/api/budget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        budget,
        priorities,
        percentages,
        // Optionally, month: "2024-05-01"
      }),
    });
    const data = await res.json();
    setResults(data.results);
    setInsights(data.insights);
  }

  const spentSoFar = transactions
    .filter((t: Transaction) => t.type === "expense" && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

  async function handleSaveBudget() {
    await fetch("/api/budget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        budget,
        allocations: results, // Save the current allocation
      }),
    });
    alert("Budget allocation saved!");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">AI Budget</h1>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-gray-500">Total Budget</p>
            <h2 className="text-2xl font-bold">KSh {budget.toLocaleString()}</h2>
            <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Monthly</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-gray-500">Spent So Far</p>
            <h2 className="text-2xl font-bold">KSh {spentSoFar.toLocaleString()}</h2>
            <Progress value={(spentSoFar / budget) * 100} className="h-2 mt-2" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-gray-500">Remaining</p>
            <h2 className="text-2xl font-bold">KSh {(budget - spentSoFar).toLocaleString()}</h2>
            <p className="text-primary text-sm flex items-center">
              <span className="inline-flex items-center">
                Under budget <span className="ml-1">✓</span>
              </span>
            </p>
          </div>
        </Card>
      </div>

      {/* Budget Allocation and Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-4">Budget Allocation</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={results.map((r) => ({
                    name: r.category,
                    value: r.amount,
                    color:
                      r.category === "Food"
                        ? "#2196F3"
                        : r.category === "Transport"
                        ? "#A8D08D"
                        : r.category === "Entertainment"
                        ? "#FFEB3B"
                        : r.category === "Education"
                        ? "#FF5722"
                        : r.category === "Shopping"
                        ? "#E91E63"
                        : r.category === "Rent"
                        ? "#9C27B0"
                        : "#9E9E9E",
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {results.map((r, index) => (
                    <Cell
                      key={`${r.category}-${index}`}
                      fill={
                        r.category === "Food"
                          ? "#2196F3"
                          : r.category === "Transport"
                          ? "#A8D08D"
                          : r.category === "Entertainment"
                          ? "#FFEB3B"
                          : r.category === "Education"
                          ? "#FF5722"
                          : r.category === "Shopping"
                          ? "#E91E63"
                          : r.category === "Rent"
                          ? "#9C27B0"
                          : "#9E9E9E"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `KSh ${Number(value).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-4">Category Breakdown</h3>
          <div className="space-y-4">
            {results.map((r, idx) => (
              <div key={`${r.category}-${idx}`} className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor:
                        r.category === "Food"
                          ? "#2196F3"
                          : r.category === "Transport"
                          ? "#A8D08D"
                          : r.category === "Entertainment"
                          ? "#FFEB3B"
                          : r.category === "Education"
                          ? "#FF5722"
                          : r.category === "Shopping"
                          ? "#E91E63"
                          : r.category === "Rent"
                          ? "#9C27B0"
                          : "#9E9E9E",
                    }}
                  >
                    {r.category === "Food" && <Coffee className="w-4 h-4 text-white" />}
                    {r.category === "Transport" && <Bus className="w-4 h-4 text-white" />}
                    {r.category === "Entertainment" && <Gamepad2 className="w-4 h-4 text-white" />}
                    {r.category === "Education" && <BookOpen className="w-4 h-4 text-white" />}
                    {r.category === "Shopping" && <ShoppingBag className="w-4 h-4 text-white" />}
                    {r.category === "Rent" && <Building2 className="w-4 h-4 text-white" />}
                    {r.category === "Other" && <Star className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{r.category}</span>
                      <span className="font-bold">KSh {r.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Allocated: {r.percent}%</span>
                      <span>KSh {r.amount.toLocaleString()} allocated</span>
                    </div>
                  </div>
                </div>
                <Progress value={(r.amount / budget) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* AI Budget Insights */}
      <Card className="p-4">
        <h3 className="font-semibold text-lg mb-4">AI Budget Insights</h3>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-700 flex items-center">
              <LightbulbIcon className="w-5 h-5 mr-2" />
              Spending Analysis
            </h4>
            <p className="mt-2 text-gray-700">
              Based on your spending patterns, you could reduce your food expenses by 15% by cooking more meals at home.
              Consider allocating more funds to your education category for upcoming semester expenses.
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <h4 className="font-medium text-green-700 flex items-center">
              <LightbulbIcon className="w-5 h-5 mr-2" />
              Savings Opportunity
            </h4>
            <p className="mt-2 text-gray-700">
              Setting aside KSh 500 more per month for entertainment would bring your budget in line with typical
              student spending. Your transport spending is well-optimized, keeping you under budget consistently.
            </p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <h4 className="font-medium text-yellow-700 flex items-center">
              <LightbulbIcon className="w-5 h-5 mr-2" />
              Budget Health
            </h4>
            <p className="mt-2 text-gray-700">
              Your current budget utilization is at {((spentSoFar / budget) * 100).toFixed(0)}%. This is within the healthy range of 80-90% for a student
              budget. Continue tracking expenses closely to maintain this healthy balance.
            </p>
          </div>
        </div>
      </Card>

      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-10">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-700">AI Budgeter</h1>
        <div className="mb-6 flex items-center gap-2">
          <label className="block font-semibold text-gray-700">Your Budget (KSh):</label>
          <input
            type="number"
            value={budget}
            onChange={e => setBudget(Number(e.target.value))}
            className="border-2 border-green-300 p-3 rounded-lg w-full text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder={`Current balance: KSh ${currentBalance}`}
          />
          <button
            className="px-3 py-2 bg-blue-500 text-white rounded"
            onClick={() => setBudget(currentBalance)}
            type="button"
          >
            Use Current Balance
          </button>
        </div>
        <div className="mb-6">
          <h2 className="font-semibold mb-4 text-gray-700 text-lg">Set Category Priorities or Percentages</h2>
          <div className="space-y-3">
            {categories.map(({ name, icon: Icon, color }) => (
              <div key={name} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 shadow-sm">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: color }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="w-28 font-medium text-gray-800">{name}</span>
                <select
                  value={priorities[name] || ""}
                  onChange={e => handlePriorityChange(name, e.target.value)}
                  className={`border p-2 rounded-lg focus:outline-none ${
                    priorities[name] === "high"
                      ? "bg-green-100 border-green-400"
                      : priorities[name] === "medium"
                      ? "bg-yellow-100 border-yellow-400"
                      : priorities[name] === "low"
                      ? "bg-red-100 border-red-400"
                      : ""
                  }`}
                >
                  <option value="">Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <input
                  type="number"
                  placeholder="%"
                  value={percentages[name] || ""}
                  onChange={e => handlePercentageChange(name, e.target.value)}
                  className="border p-2 rounded-lg w-20 ml-2 focus:outline-none"
                  min={0}
                  max={100}
                />
                <span className="text-gray-500">%</span>
              </div>
            ))}
          </div>
        </div>
        <button
          className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white font-bold py-3 rounded-lg text-lg shadow-md hover:from-green-600 hover:to-green-800 transition"
          onClick={handleGenerateBudget}
          type="button"
        >
          Generate AI Budget
        </button>
        <button
          className="w-full bg-green-600 text-white font-bold py-3 rounded-lg text-lg shadow-md mt-4"
          onClick={handleGenerateBudget}
          type="button"
        >
          Refresh AI Budget
        </button>
        <button
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg text-lg shadow-md mt-2"
          onClick={handleSaveBudget}
          type="button"
        >
          Save My Allocation
        </button>
        {results.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">AI Budget Allocation</h2>
            <ul>
              {results.map(r => (
                <li key={`${r.category}-${results.indexOf(r)}`} className="mb-2">
                  <span className="font-semibold">{r.category}:</span> KSh {r.amount} ({r.percent}%)
                </li>
              ))}
            </ul>
          </div>
        )}
        {results.length === 0 && (
          <div className="text-gray-500 text-center my-8">
            No budget allocation yet. Set your budget and click "Generate AI Budget"!
          </div>
        )}
        {insights.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-2">AI Insights</h2>
            <ul>
              {insights.map((insight, i) => (
                <li key={i} className="mb-1 text-blue-700">{insight}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
