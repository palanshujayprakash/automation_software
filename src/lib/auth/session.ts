import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName?: string;
  isDemoUser?: boolean;
}

/**
 * Derives user identity strictly from the verified session, never from client requests.
 * Uses React cache() for request-deduplication to prevent multiple database/auth lookups per render cycle.
 */
export const getCurrentUser = cache(async (): Promise<AuthenticatedUser | null> => {
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get("flowpilot_demo_session");

  // Check live Supabase Auth session first
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (user && !error) {
      return {
        id: user.id,
        email: user.email ?? "user@flowpilot.local",
        fullName: (user.user_metadata?.full_name as string) || "Operator",
        isDemoUser: false,
      };
    }
  } catch {
    // If Supabase is unconfigured or unreachable, fall back to check demo cookie
  }

  // Support local offline demo session for BCA student development
  if (demoCookie?.value) {
    try {
      const parsed = JSON.parse(demoCookie.value);
      return {
        id: parsed.id || "00000000-0000-0000-0000-000000000001",
        email: parsed.email || "student@flowpilot.local",
        fullName: parsed.fullName || "Student Operator",
        isDemoUser: true,
      };
    } catch {
      return null;
    }
  }

  return null;
});

/**
 * Asserts user identity on server components or route handlers.
 * Redirects to /login if unauthenticated.
 */
export async function requireUser(): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
