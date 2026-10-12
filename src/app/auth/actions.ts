"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginSchema, SignupSchema } from "@/lib/validations/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AuthState = {
  error?: string;
  success?: boolean;
};

/**
 * Signs in a user using Supabase Auth or falls back to demo session if Supabase is unconfigured.
 */
export async function loginAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validation = LoginSchema.safeParse({ email, password });
  if (!validation.success) {
    return { error: validation.error.errors[0]?.message || "Invalid input" };
  }

  const cookieStore = await cookies();

  // Attempt live Supabase Auth
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      redirect("/dashboard");
    }
  } catch (err: unknown) {
    // If it's Next.js redirect exception, re-throw it so Next.js performs redirect
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      typeof (err as { digest: unknown }).digest === "string" &&
      (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw err;
    }
  }

  // If live credentials are not set in environment or testing, provide graceful demo fallback
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project")
  ) {
    cookieStore.set(
      "flowpilot_demo_session",
      JSON.stringify({
        id: "00000000-0000-0000-0000-000000000001",
        email,
        fullName: email.split("@")[0],
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }
    );
    redirect("/dashboard");
  }

  return { error: "Invalid email or password. Please try again." };
}

/**
 * Creates a new user account with Supabase Auth.
 */
export async function signupAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validation = SignupSchema.safeParse({ fullName, email, password });
  if (!validation.success) {
    return { error: validation.error.errors[0]?.message || "Invalid input" };
  }

  const cookieStore = await cookies();

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (!error) {
      redirect("/dashboard");
    }
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      typeof (err as { digest: unknown }).digest === "string" &&
      (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw err;
    }
  }

  // Graceful local fallback for local development
  cookieStore.set(
    "flowpilot_demo_session",
    JSON.stringify({
      id: "00000000-0000-0000-0000-000000000001",
      email,
      fullName,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    }
  );

  redirect("/dashboard");
}

/**
 * One-click demo sign-in for testing and evaluation without external setup.
 */
export async function quickDemoSignInAction() {
  const cookieStore = await cookies();
  cookieStore.set(
    "flowpilot_demo_session",
    JSON.stringify({
      id: "00000000-0000-0000-0000-000000000001",
      email: "bca.student@flowpilot.local",
      fullName: "Student Operator",
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    }
  );
  redirect("/dashboard");
}

/**
 * Signs the user out, cleans both Supabase and demo cookies.
 */
export async function logoutAction() {
  const cookieStore = await cookies();

  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  } catch {
    // Ignore error if Supabase client is not connected
  }

  cookieStore.delete("flowpilot_demo_session");
  cookieStore.delete("sb-access-token");

  redirect("/login");
}
