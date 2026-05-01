import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  // TODO: persist to Supabase or another store
  console.log("[seteban-forms] submission:", JSON.stringify(data, null, 2));
  return NextResponse.json({ ok: true });
}
