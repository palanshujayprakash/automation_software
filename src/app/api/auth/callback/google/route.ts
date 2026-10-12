import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { validateOAuthState, GOOGLE_SCOPES } from "@/lib/integrations/google-oauth";
import { encryptToken } from "@/lib/crypto/encryption";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/integrations?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/integrations?error=missing_oauth_parameters", request.url)
    );
  }

  // Validate CSRF state signature
  const stateValidation = validateOAuthState(state, user.id);
  if (!stateValidation.isValid || !stateValidation.service) {
    return NextResponse.redirect(
      new URL("/integrations?error=invalid_csrf_state", request.url)
    );
  }

  const service = stateValidation.service;

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/callback/google";

    // If live credentials are provided, exchange code with Google OAuth endpoint
    if (clientId && clientSecret && !clientId.includes("placeholder")) {
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok) {
        throw new Error(tokenData.error_description || "Token exchange failed");
      }

      const encryptedAccessToken = encryptToken(tokenData.access_token);
      const encryptedRefreshToken = tokenData.refresh_token
        ? encryptToken(tokenData.refresh_token)
        : null;

      // Upsert into Supabase integrations
      const supabase = await createServerSupabaseClient();
      await supabase.from("integrations").upsert({
        user_id: user.id,
        service,
        status: "connected",
        granted_scopes: [GOOGLE_SCOPES[service]],
        encrypted_access_token: encryptedAccessToken,
        encrypted_refresh_token: encryptedRefreshToken,
        last_verified_at: new Date().toISOString(),
      });

      await supabase.from("audit_events").insert({
        user_id: user.id,
        event_type: "integration.connected",
        description: `Connected ${service} via verified Google OAuth 2.0 flow`,
        severity: "info",
      });
    }

    return NextResponse.redirect(
      new URL(`/integrations?connected=${service}`, request.url)
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "OAuth connection failed";
    return NextResponse.redirect(
      new URL(`/integrations?error=${encodeURIComponent(message)}`, request.url)
    );
  }
}
