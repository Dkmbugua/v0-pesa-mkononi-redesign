"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Car, GraduationCap, Building, Plane, Plus, Target } from "lucide-react"

export default function SavingsGoalsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Savings Goals</h1>

      {/* Completed Goals */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Completed Goals</h2>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Phone Repair</h3>
                <Progress value={100} className="h-2 mt-2" />
                <div className="flex justify-between mt-1 text-sm text-gray-500">
                  <span>KSh 5,000</span>
                  <span>KSh 5,000</span>
                </div>
                <p className="text-right text-xs text-primary mt-1">100%</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Goal Ideas */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Goal Ideas</h2>
        <Card className="p-6">
          <h3 className="font-medium mb-6">Quick Start with Templates</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mb-2">
                <Car className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm font-medium">Car Down Payment</span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-2">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm font-medium">Graduation Trip</span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mb-2">
                <Building className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm font-medium">Apartment Deposit</span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center mb-2">
                <Plane className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm font-medium">Holiday</span>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button className="bg-primary text-white">
              <Plus className="w-5 h-5 mr-2" />
              Create Custom Goal
            </Button>
          </div>
        </Card>
      </div>

      {/* Current Goals */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Current Goals</h2>
        <Card className="p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-medium">Emergency Fund</h3>
                </div>
                <div className="text-right">
                  <p className="font-medium">15,000 / 25,000 KSh</p>
                </div>
              </div>
              <Progress value={60} className="h-2" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Car className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium">Laptop</h3>
                </div>
                <div className="text-right">
                  <p className="font-medium">35,000 / 75,000 KSh</p>
                </div>
              </div>
              <Progress value={47} className="h-2" />
            </div>

            <div className="flex justify-center mt-4">
              <Button variant="outline" className="text-primary border-primary/30">
                <Plus className="w-4 h-4 mr-2" />
                Create New Goal
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
