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
      .select("fake_count, use_real")
      .single();

    if (error) throw error;

    // Məlumatı qaytarırıq (əvvəl null qaytarırdı!)
    return NextResponse.json({
      fake_count: data?.fake_count || null,
      use_real: data?.use_real || false,
    });
  } catch (error) {
    console.error("Supabase GET error:", error);
    return NextResponse.json({
      fake_count: null,
      use_real: false,
    });
  }
}

export async function POST(request: Request) {
  try {
    const { fake_count } = await request.json();

    const { error } = await supabase.from("visitor_settings").upsert({
      id: 1,
      fake_count,
      use_real: true,
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
