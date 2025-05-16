"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Coffee, Bus, Gamepad2, BookOpen, Building, ShoppingBag, LightbulbIcon } from "lucide-react"

// Sample data for budget allocation
const budgetData = [
  { name: "Food", value: 5000, spent: 4500, color: "#2196F3", icon: Coffee },
  { name: "Transport", value: 2500, spent: 2000, color: "#A8D08D", icon: Bus },
  { name: "Entertainment", value: 2000, spent: 1500, color: "#FFEB3B", icon: Gamepad2 },
  { name: "Education", value: 3500, spent: 3000, color: "#FF5722", icon: BookOpen },
  { name: "Shopping", value: 1200, spent: 1000, color: "#E91E63", icon: ShoppingBag },
  { name: "Rent", value: 8000, spent: 8000, color: "#9C27B0", icon: Building },
]

// Calculate totals
const totalBudget = budgetData.reduce((sum, item) => sum + item.value, 0)
const totalSpent = budgetData.reduce((sum, item) => sum + item.spent, 0)
const remaining = totalBudget - totalSpent

// Prepare data for pie chart
const pieData = budgetData.map((item) => ({
  name: item.name,
  value: item.value,
  color: item.color,
}))

export default function BudgetPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">AI Budget</h1>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-gray-500">Total Budget</p>
            <h2 className="text-2xl font-bold">KSh {totalBudget.toLocaleString()}</h2>
            <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Monthly</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-gray-500">Spent So Far</p>
            <h2 className="text-2xl font-bold">KSh {totalSpent.toLocaleString()}</h2>
            <Progress value={(totalSpent / totalBudget) * 100} className="h-2 mt-2" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-gray-500">Remaining</p>
            <h2 className="text-2xl font-bold">KSh {remaining.toLocaleString()}</h2>
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
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `KSh ${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-4">Category Breakdown</h3>
          <div className="space-y-4">
            {budgetData.map((category, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: category.color }}
                  >
                    <category.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{category.name}</span>
                      <span className="font-bold">KSh {category.value.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Spent: KSh {category.spent.toLocaleString()}</span>
                      <span>KSh {(category.value - category.spent).toLocaleString()} remaining</span>
                    </div>
                  </div>
                </div>
                <Progress value={(category.spent / category.value) * 100} className="h-2" />
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
              Your current budget utilization is at 88%. This is within the healthy range of 80-90% for a student
              budget. Continue tracking expenses closely to maintain this healthy balance.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
