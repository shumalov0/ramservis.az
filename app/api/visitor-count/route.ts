import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("visitor_settings")
      .select("base_count, is_active")
      .single();

    if (error) throw error;

    return NextResponse.json({
      count: data?.base_count || null,
      active: data?.is_active || false,
    });
  } catch (error) {
    console.error("Supabase GET error:", error);
    return NextResponse.json({
      count: null,
      active: false,
    });
  }
}

export async function POST(request: Request) {
  try {
    const { count } = await request.json();

    const { error } = await supabase.from("visitor_settings").upsert({
      id: 1,
      base_count: count,
      is_active: true,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update" },
      { status: 500 }
    );
  }
}
