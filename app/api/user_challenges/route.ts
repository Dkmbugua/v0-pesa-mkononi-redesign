import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from "next/headers";

// GET: List all challenges joined by the current user
export async function GET(request: Request) {
  const supabase = createClient(cookies());
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('user_challenges')
    .select('*, challenges(*)')
    .eq('user_id', session.user.id)
    .order('started_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ user_challenges: data });
}

// POST: Join a new challenge
export async function POST(request: Request) {
  const supabase = createClient(cookies());
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { challenge_id } = await request.json();
  const { data, error } = await supabase.from('user_challenges').insert([
    { user_id: session.user.id, challenge_id }
  ]).select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ user_challenge: data[0] });
}

// PATCH: Update progress or mark as completed
export async function PATCH(request: Request) {
  const supabase = createClient(cookies());
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, progress, completed_at } = await request.json();
  const { data, error } = await supabase
    .from('user_challenges')
    .update({ progress, completed_at })
    .eq('id', id)
    .eq('user_id', session.user.id)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ user_challenge: data[0] });
}
