import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from "next/headers";

// GET: List all challenges
export async function GET() {
  const supabase = createClient(cookies());
  const { data, error } = await supabase.from('challenges').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ challenges: data });
}

// POST: Add a new challenge
export async function POST(request: Request) {
  const supabase = createClient(cookies());
  const { title, description, reward } = await request.json();
  const { data, error } = await supabase.from('challenges').insert([{ title, description, reward }]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ challenge: data[0] });
}
