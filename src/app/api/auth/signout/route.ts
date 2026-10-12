import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const cookieStore = await cookies();

  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  } catch {
    // Ignore error if Supabase client is not connected
  }

  cookieStore.delete("flowpilot_demo_session");
  cookieStore.delete("sb-access-token");

  const url = new URL("/login", request.url);
  return NextResponse.redirect(url, { status: 303 });
}
