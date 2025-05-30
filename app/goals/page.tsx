"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Car, GraduationCap, Building, Plane, Plus, Target } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

type Goal = {
  id: number;
  name: string;
  target_amount: number;
  saved_amount: number;
  deadline: string;
  description?: string;
  status?: string;
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [form, setForm] = useState({ name: "", target_amount: "", deadline: "", description: "" });

  useEffect(() => {
    fetchGoals();
  }, []);

  async function fetchGoals() {
    const res = await fetch("/api/goals");
    const data = await res.json();
    setGoals(data.goals || []);
  }

  async function handleAddGoal(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", target_amount: "", deadline: "", description: "" });
    fetchGoals();
  }

  async function handleDeleteGoal(id: number) {
    await fetch("/api/goals", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchGoals();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Savings Goals</h1>

      {/* Add Goal Form */}
      <Card className="p-4 mb-4">
        <form onSubmit={handleAddGoal} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Goal Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
            className="border rounded p-2"
          />
          <input
            type="number"
            placeholder="Target Amount"
            value={form.target_amount}
            onChange={e => setForm(f => ({ ...f, target_amount: e.target.value }))}
            required
            className="border rounded p-2"
          />
          <input
            type="date"
            placeholder="Deadline"
            value={form.deadline}
            onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
            className="border rounded p-2"
          />
          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="border rounded p-2"
          />
          <Button type="submit">Add Goal</Button>
        </form>
      </Card>

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map(goal => (
          <Card key={goal.id} className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{goal.name}</h3>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteGoal(goal.id)}>
                Delete
              </Button>
            </div>
            <p className="text-sm text-gray-500 mb-2">{goal.description}</p>
            <p className="text-xs text-gray-400 mb-2">Deadline: {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : "No deadline"}</p>
            <Progress value={goal.saved_amount && goal.target_amount ? (goal.saved_amount / goal.target_amount) * 100 : 0} className="h-2 mb-1" />
            <div className="text-xs text-gray-600">
              Saved: KSh {goal.saved_amount || 0} / KSh {goal.target_amount}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
