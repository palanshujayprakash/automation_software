import { describe, it, expect } from "vitest";
import { generateWorkflowFromPrompt } from "@/lib/ai/workflow-generator";
import { WorkflowDefinitionSchema } from "@/lib/validations/workflow";
import { executeWorkflow } from "@/lib/execution/engine";
import { encryptToken, decryptToken } from "@/lib/crypto/encryption";
import { getSecurityCenterData } from "@/lib/security/checks";
import { Workflow } from "@/types";

describe("Module 8: Complete End-to-End SaaS Lifecycle Integration", () => {
  const testUserId = "bca-student-user-001";

  it("completes full Flow 1: Natural Language -> AI Proposal -> Zod Validation -> Required Scopes", async () => {
    // 1. User enters natural language request
    const userPrompt =
      "Every morning, read my calendar events and append a summary into Google Sheets.";

    // 2. Server generates structured proposal
    const result = await generateWorkflowFromPrompt(userPrompt);
    expect(result.workflow).toBeDefined();

    // 3. Schema validator asserts proposal safety
    const validation = WorkflowDefinitionSchema.safeParse(result.workflow);
    expect(validation.success).toBe(true);

    // 4. Scopes detector maps minimal permissions
    expect(result.requiredScopes.length).toBe(2);
    expect(result.requiredScopes.some((s) => s.service === "calendar")).toBe(true);
    expect(result.requiredScopes.some((s) => s.service === "sheets")).toBe(true);
  });

  it("completes full Flow 2: Human Review & Approval -> Safe Execution Engine -> Sanitized Telemetry", async () => {
    // 1. Create workflow with explicit human approval
    const approvedWorkflow: Workflow = {
      id: "wf-e2e-001",
      userId: testUserId,
      name: "Calendar to Sheets Automated Digest",
      description: "End-to-end verified workflow",
      status: "active",
      isApproved: true,
      requiresApprovalForRuns: false,
      steps: [
        {
          id: "step-1",
          name: "Schedule Trigger",
          type: "trigger",
          actionType: "schedule",
          config: { cron: "0 8 * * *" },
          order: 0,
        },
        {
          id: "step-2",
          name: "Fetch Calendar Events",
          type: "action",
          service: "calendar",
          actionType: "calendar.read_events",
          config: { timeframe: "today" },
          order: 1,
        },
        {
          id: "step-3",
          name: "Write Summary Row",
          type: "action",
          service: "sheets",
          actionType: "sheets.append_row",
          config: { sheetName: "Digest" },
          order: 2,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 2. Execute workflow
    const run = await executeWorkflow(approvedWorkflow);

    // 3. Verify execution results & telemetry
    expect(run.status).toBe("succeeded");
    expect(run.stepResults.length).toBe(3);
    expect(run.stepResults[1]?.output?.eventsCount).toBe(3);
    expect(run.stepResults[2]?.output?.status).toBe("Row appended successfully");
    expect(run.durationMs).toBeGreaterThanOrEqual(0);
    expect(run.retryCount).toBe(0);
  });

  it("completes full Flow 3: OAuth Token Lifecycle -> AES-256-GCM Authenticated Encryption -> Tamper Protection", () => {
    const rawRefreshToken = "1//google_oauth_refresh_token_very_secret_xyz_987";

    // 1. Encrypt token prior to storage
    const encrypted = encryptToken(rawRefreshToken);
    expect(encrypted).not.toContain(rawRefreshToken);

    // 2. Decrypt token upon worker execution
    const decrypted = decryptToken(encrypted);
    expect(decrypted).toBe(rawRefreshToken);

    // 3. Verify tamper protection: corrupting ciphertext causes decryption failure
    const parsed = JSON.parse(encrypted);
    parsed.ciphertext = "1234" + parsed.ciphertext.slice(4);
    expect(() => decryptToken(JSON.stringify(parsed))).toThrow(/Failed to decrypt/);
  });

  it("completes full Flow 4: Security Center Checks -> Evidence-Based Audit without Fabricated Scores", async () => {
    const securityData = await getSecurityCenterData(testUserId, true);

    // Verify evidence-based integrity
    expect((securityData as unknown as Record<string, unknown>).score).toBeUndefined();
    expect(securityData.checks.find((c) => c.id === "check-rls")?.status).toBe("verified");
    expect(securityData.checks.find((c) => c.id === "check-aes")?.status).toBe("verified");
    expect(securityData.checks.find((c) => c.id === "check-mfa")?.status).toBe("unverified");

    // Verify audit trail integrity
    expect(securityData.auditEvents.length).toBeGreaterThan(0);
    expect(securityData.connectedIntegrations.length).toBe(3);
  });
});
