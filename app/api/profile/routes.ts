import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = createClient({ cookies: () => req.cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const { data, error } = await supabase
    .from("profiles")
    .select("name, occupation")
    .eq("id", user.id)
    .single();

  if (error) return NextResponse.json({}, { status: 500 });
  return NextResponse.json(data || {});
}

export async function POST(req: NextRequest) {
  const supabase = createClient({ cookies: () => req.cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const { name, occupation } = await req.json();

  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, name, occupation });

  if (error) return NextResponse.json({}, { status: 500 });
  return NextResponse.json({ success: true });
}
