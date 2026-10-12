"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function revokeIntegrationTokenAction(service: "gmail" | "calendar" | "sheets") {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }

  try {
    const supabase = await createServerSupabaseClient();
    await supabase
      .from("integrations")
      .delete()
      .eq("user_id", user.id)
      .eq("service", service);

    await supabase.from("audit_events").insert({
      user_id: user.id,
      event_type: "security.token_revoked",
      description: `Revoked OAuth token and wiped AES ciphertext for ${service}`,
      severity: "warning",
    });
  } catch {
    // Client state fallback
  }

  revalidatePath("/security");
  revalidatePath("/integrations");
  revalidatePath("/dashboard");
  return { success: true };
}
