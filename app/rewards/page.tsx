"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award, Star, Trophy, TrendingUp, Brain, Medal } from "lucide-react"

export default function RewardsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Rewards</h1>

      {/* Badges Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Badge 1 */}
          <Card className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 rounded-full bg-yellow-200 flex items-center justify-center">
                <Award className="w-8 h-8 text-yellow-800" />
              </div>
            </div>
            <h3 className="font-medium">Budget Master</h3>
            <p className="text-xs text-gray-500 mt-1">Stayed within budget for 3 consecutive months</p>
          </Card>

          {/* Badge 2 */}
          <Card className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 rounded-full bg-yellow-200 flex items-center justify-center">
                <Star className="w-8 h-8 text-yellow-800" />
              </div>
            </div>
            <h3 className="font-medium">Saving Star</h3>
            <p className="text-xs text-gray-500 mt-1">Saved KSh 10,000 in a single month</p>
          </Card>

          {/* Badge 3 */}
          <Card className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 rounded-full bg-yellow-200 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-yellow-800" />
              </div>
            </div>
            <h3 className="font-medium">Goal Achiever</h3>
            <p className="text-xs text-gray-500 mt-1">Completed your first savings goal</p>
          </Card>

          {/* Badge 4 */}
          <Card className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 rounded-full bg-yellow-200 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-yellow-800" />
              </div>
            </div>
            <h3 className="font-medium">Expense Tracker</h3>
            <p className="text-xs text-gray-500 mt-1">Logged 50 expenses</p>
          </Card>

          {/* Badge 5 - Locked */}
          <Card className="p-4 text-center bg-gray-100">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                <Brain className="w-8 h-8 text-gray-500" />
              </div>
            </div>
            <h3 className="font-medium text-gray-700">Financial</h3>
            <div className="mt-1 bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full inline-block">Locked</div>
            <p className="text-xs text-gray-500 mt-1">Complete 10 financial knowledge quizzes</p>
          </Card>

          {/* Badge 6 - Locked */}
          <Card className="p-4 text-center bg-gray-100">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                <Medal className="w-8 h-8 text-gray-500" />
              </div>
            </div>
            <h3 className="font-medium text-gray-700">Super Saver</h3>
            <div className="mt-1 bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full inline-block">Locked</div>
            <p className="text-xs text-gray-500 mt-1">Save consistently for 6 months</p>
          </Card>
        </div>
      </div>

      {/* Active Challenges */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Active Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Challenge 1 */}
          <Card className="p-4">
            <div className="flex justify-between mb-2">
              <h3 className="font-medium">No-Spend Weekend</h3>
              <span className="text-blue-500 text-sm">500 points</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Don't spend on entertainment this weekend</p>
            <Progress value={0} className="h-2 mb-1" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0% Complete</span>
              <span>0 / 1</span>
            </div>
          </Card>

          {/* Challenge 2 */}
          <Card className="p-4">
            <div className="flex justify-between mb-2">
              <h3 className="font-medium">Save KSh 1,000 this week</h3>
              <span className="text-blue-500 text-sm">700 points</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Put away KSh 1,000 into your savings</p>
            <Progress value={60} className="h-2 mb-1" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>60% Complete</span>
              <span>600 / 1000</span>
            </div>
          </Card>

          {/* Challenge 3 */}
          <Card className="p-4">
            <div className="flex justify-between mb-2">
              <h3 className="font-medium">Track all expenses for 7 days</h3>
              <span className="text-blue-500 text-sm">300 points</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Log every expense for a full week</p>
            <Progress value={71} className="h-2 mb-1" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>71% Complete</span>
              <span>5 / 7</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Completed Challenges */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Completed Challenges</h2>
        <Card className="divide-y">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-medium">Cook at home for a week</h3>
                <p className="text-xs text-gray-500">No eating out for 7 days</p>
              </div>
            </div>
            <span className="text-primary font-medium">+500 points</span>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-medium">Create a savings goal</h3>
                <p className="text-xs text-gray-500">Set up a new savings target</p>
              </div>
            </div>
            <span className="text-primary font-medium">+200 points</span>
          </div>
        </Card>
      </div>
    </div>
  )
}
