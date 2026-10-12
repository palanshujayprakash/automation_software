import { describe, it, expect } from "vitest";
import { getSecurityCenterData } from "@/lib/security/checks";

describe("Module 7: Security Center & Governance", () => {
  it("evaluates real configuration checks without fabricating scores", async () => {
    const data = await getSecurityCenterData("test-user-id", true);

    // Rule: Never invent a security score
    expect((data as unknown as Record<string, unknown>).score).toBeUndefined();
    expect((data as unknown as Record<string, unknown>).percentage).toBeUndefined();

    // Verify presence of required genuine checks
    const rlsCheck = data.checks.find((c) => c.id === "check-rls");
    expect(rlsCheck).toBeDefined();
    expect(rlsCheck?.status).toBe("verified");

    const aesCheck = data.checks.find((c) => c.id === "check-aes");
    expect(aesCheck).toBeDefined();
    expect(aesCheck?.status).toBe("verified");

    // MFA must be labeled unverified without live cloud config
    const mfaCheck = data.checks.find((c) => c.id === "check-mfa");
    expect(mfaCheck).toBeDefined();
    expect(mfaCheck?.status).toBe("unverified");
    expect(mfaCheck?.remediation).toBeDefined();
  });

  it("lists connected integrations with least-privilege scopes and encryption status", async () => {
    const data = await getSecurityCenterData("test-user-id", true);

    expect(data.connectedIntegrations.length).toBeGreaterThanOrEqual(2);
    const calendar = data.connectedIntegrations.find((i) => i.service === "calendar");
    expect(calendar?.scope).toContain("calendar.readonly");
    expect(calendar?.encrypted).toBe(true);
  });

  it("provides immutable security audit events and approval records", async () => {
    const data = await getSecurityCenterData("test-user-id", true);

    expect(data.auditEvents.length).toBeGreaterThan(0);
    expect(data.auditEvents.every((e) => e.eventType && e.timestamp)).toBe(true);

    expect(data.approvalsHistory.length).toBeGreaterThan(0);
    expect(data.approvalsHistory.every((a) => a.workflowName && a.approver)).toBe(true);
  });
});
