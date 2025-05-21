import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

const PRIORITY_PERCENTAGES = { high: 30, medium: 20, low: 10 };

export async function POST(request: Request) {
  const supabase = createClient(cookies());
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { budget, priorities, percentages } = await request.json();

  // 1. Build the allocation
  let totalPercent = 0;
  const allocation: { [key: string]: number } = {};

  // Use user-set percentages
  for (const [category, percent] of Object.entries(percentages)) {
    if (percent) {
      allocation[category] = Number(percent);
      totalPercent += Number(percent);
    }
  }

  // Fill in the rest using priorities
  for (const [category, priority] of Object.entries(priorities)) {
    if (!allocation[category] && priority) {
      allocation[category] = PRIORITY_PERCENTAGES[priority as keyof typeof PRIORITY_PERCENTAGES];
      totalPercent += allocation[category];
    }
  }

  // Adjust if totalPercent != 100
  if (totalPercent !== 100 && totalPercent > 0) {
    for (const category in allocation) {
      allocation[category] = (allocation[category] / totalPercent) * 100;
    }
  }

  // 2. Calculate amounts
  const results = Object.entries(allocation).map(([category, percent]) => ({
    category,
    percent: Number(percent.toFixed(1)),
    amount: Math.round((percent / 100) * budget),
  }));

  // 3. Save to budgets table
  for (const { category, amount } of results) {
    await supabase.from("budgets").upsert([
      {
        user_id: session.user.id,
        category,
        amount,
        month: new Date().toISOString().slice(0, 7) + "-01", // YYYY-MM-01
      },
    ]);
  }

  // 4. Generate real AI insights based on allocation and actual balance
  const insights = [];
  if ((allocation["Food"] || 0) > 30) {
    insights.push("Your food budget is higher than average. Consider meal prepping to save money.");
  }
  if ((allocation["Entertainment"] || 0) > 20) {
    insights.push("Entertainment is a big part of your budget. Make sure it's not affecting essentials.");
  }
  if (budget > 0 && results.length > 0) {
    const totalAllocated = results.reduce((sum, r) => sum + r.amount, 0);
    if (totalAllocated > budget) {
      insights.push("Your allocations exceed your budget. Consider lowering some categories.");
    } else if (totalAllocated < budget) {
      insights.push("You have unallocated funds. Consider saving or investing the remainder.");
    }
  }

  // Example: Analyze actual spending and allocation
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", session.user.id);

  const safeTransactions = transactions || [];
  const foodSpent = safeTransactions
    .filter(t => t.category === "Food" && t.type === "expense" && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);

  if (foodSpent > (allocation["Food"] || 0) * budget / 100) {
    insights.push("You are overspending on Food compared to your budget. Consider adjusting your allocation or spending habits.");
  }

  return NextResponse.json({ results, insights });
}

export async function GET() {
  const supabase = createClient(cookies());
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("user_id", session.user.id)
    .order("month", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ budgets: data });
}
