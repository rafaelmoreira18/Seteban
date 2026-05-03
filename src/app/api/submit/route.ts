import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const data = await request.json();

  const { error } = await supabaseAdmin.from("form_responses").insert(data);

  if (error) {
    console.error("[seteban-forms] supabase error:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
