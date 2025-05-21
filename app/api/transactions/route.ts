import { cookies } from "next/headers";
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient(cookies());
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', session.user.id)
    .order('date', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ transactions });
}

export async function POST(request: Request) {
  const supabase = createClient(cookies());
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { amount, category, description, type, date } = body;

  const { error } = await supabase.from("transactions").insert([
    {
      user_id: session.user.id,
      amount,
      category,
      description,
      type,
      date: date || new Date().toISOString(),
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}