import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

const DEFAULT_PERCENTAGES = {
  Food: 30,
  Transport: 20,
  Entertainment: 10,
  Education: 10,
  Shopping: 10,
  Rent: 15,
  Other: 5,
};

export async function POST(request: Request) {
  try {
    const supabase = createClient(cookies());
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { budget, priorities, percentages } = await request.json();

    let totalPercent = 0;
    const allocation: { [key: string]: number } = {};

    for (const category of Object.keys(DEFAULT_PERCENTAGES) as (keyof typeof DEFAULT_PERCENTAGES)[]) {
      const percent = percentages?.[category];
      if (percent) {
        allocation[category] = Number(percent);
        totalPercent += Number(percent);
      } else {
        allocation[category] = DEFAULT_PERCENTAGES[category];
        totalPercent += DEFAULT_PERCENTAGES[category];
      }
    }

    // Adjust if totalPercent != 100
    if (totalPercent !== 100 && totalPercent > 0) {
      for (const category in allocation) {
        allocation[category] = (allocation[category] / totalPercent) * 100;
      }
    }

    // Calculate amounts
    const results = Object.entries(allocation).map(([category, percent]) => ({
      category,
      percent: Number(percent.toFixed(1)),
      amount: Math.round((percent / 100) * budget),
    }));

    // Save to budgets table
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

    // Simple insights/warnings
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

    return NextResponse.json({ results, insights });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
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
