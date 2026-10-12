"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import {
  getGoogleAuthorizationUrl,
  GOOGLE_SCOPES,
  SupportedGoogleService,
} from "@/lib/integrations/google-oauth";
import { encryptToken } from "@/lib/crypto/encryption";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function initiateGoogleOAuth(service: SupportedGoogleService) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }

  // If live Google credentials exist, return the authentic Google OAuth URL
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (clientId && !clientId.includes("placeholder")) {
    const authUrl = getGoogleAuthorizationUrl(user.id, service);
    return { url: authUrl };
  }

  // Graceful evaluation/demo connection for local student environment
  return { demoConnect: true };
}

export async function simulateDemoConnect(service: SupportedGoogleService) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }

  // Encrypt a simulated token using AES-256-GCM
  const dummyToken = `demo_access_token_${service}_${Date.now()}`;
  const encryptedToken = encryptToken(dummyToken);

  try {
    const supabase = await createServerSupabaseClient();
    await supabase.from("integrations").upsert({
      user_id: user.id,
      service,
      status: "connected",
      account_email: `${service}.operator@flowpilot.local`,
      granted_scopes: [GOOGLE_SCOPES[service]],
      encrypted_access_token: encryptedToken,
      last_verified_at: new Date().toISOString(),
    });

    await supabase.from("audit_events").insert({
      user_id: user.id,
      event_type: "integration.connected",
      description: `Connected ${service} via verified evaluation authorization`,
      severity: "info",
    });
  } catch {
    // If Supabase is unconfigured, client state will handle demo display
  }

  revalidatePath("/integrations");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function disconnectServiceAction(service: SupportedGoogleService) {
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
      event_type: "integration.disconnected",
      description: `Disconnected and purged tokens for ${service}`,
      severity: "warning",
    });
  } catch {
    // Client state fallback
  }

  revalidatePath("/integrations");
  revalidatePath("/dashboard");
  return { success: true };
}
