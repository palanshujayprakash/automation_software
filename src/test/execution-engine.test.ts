import { describe, it, expect } from "vitest";
import { executeWorkflow } from "@/lib/execution/engine";
import { sanitizeError } from "@/lib/execution/handlers";
import { Workflow } from "@/types";

describe("Module 6: Workflow Execution Engine & Safety Telemetry", () => {
  describe("Error Sanitization Guard", () => {
    it("redacts bearer tokens, secret keys, and passwords from error messages", () => {
      const sensitiveError = new Error(
        "Failed request with Bearer ya29.a0AfH6SMB_secretToken and key=AIzaSySecretKey and password=SuperSecretPassword123"
      );
      const sanitized = sanitizeError(sensitiveError);

      expect(sanitized).not.toContain("ya29.a0AfH6SMB_secretToken");
      expect(sanitized).not.toContain("AIzaSySecretKey");
      expect(sanitized).not.toContain("SuperSecretPassword123");
      expect(sanitized).toContain("Bearer [REDACTED]");
      expect(sanitized).toContain("key=[REDACTED]");
      expect(sanitized).toContain("password=[REDACTED]");
    });
  });

  describe("Workflow Engine Safety & Execution", () => {
    it("successfully executes an approved calendar-to-sheets workflow", async () => {
      const approvedWorkflow: Workflow = {
        id: "wf-approved-01",
        userId: "user-123",
        name: "Morning Digest to Sheets",
        description: "Read calendar and append row",
        status: "active",
        isApproved: true,
        requiresApprovalForRuns: true,
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
            name: "Read Calendar Events",
            type: "action",
            service: "calendar",
            actionType: "calendar.read_events",
            config: { timeframe: "today" },
            order: 1,
          },
          {
            id: "step-3",
            name: "Append Row to Spreadsheet",
            type: "action",
            service: "sheets",
            actionType: "sheets.append_row",
            config: { sheetName: "Agenda" },
            order: 2,
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const run = await executeWorkflow(approvedWorkflow);
      expect(run.status).toBe("succeeded");
      expect(run.stepResults.length).toBe(3);
      expect(run.durationMs).toBeGreaterThanOrEqual(0);
      expect(run.retryCount).toBe(0);
      expect(run.stepResults.every((s) => s.status === "succeeded")).toBe(true);
    });

    it("halts and transitions to awaiting_approval when workflow is unapproved", async () => {
      const unapprovedWorkflow: Workflow = {
        id: "wf-unapproved-01",
        userId: "user-123",
        name: "Unapproved Automation",
        description: "Awaiting human review",
        status: "draft",
        isApproved: false, // NOT approved
        requiresApprovalForRuns: true,
        steps: [
          {
            id: "step-1",
            name: "Calendar Step",
            type: "action",
            service: "calendar",
            actionType: "calendar.read_events",
            config: {},
            order: 0,
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const run = await executeWorkflow(unapprovedWorkflow);
      expect(run.status).toBe("awaiting_approval");
      expect(run.sanitizedError).toContain("requires explicit human approval");
    });

    it("prevents arbitrary or unregistered action types from executing", async () => {
      const maliciousWorkflow: Workflow = {
        id: "wf-malicious-01",
        userId: "user-123",
        name: "Injected Bash Step Attempt",
        description: "Should fail safely",
        status: "active",
        isApproved: true,
        requiresApprovalForRuns: false,
        steps: [
          {
            id: "step-1",
            name: "Execute Arbitrary Shell",
            type: "action",
            actionType: "system.bash_exec",
            config: { command: "rm -rf /" },
            order: 0,
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const run = await executeWorkflow(maliciousWorkflow);
      expect(run.status).toBe("failed");
      expect(run.sanitizedError).toContain("Unregistered action handler");
    });

    it("protects destructive gmail sending with approval barrier", async () => {
      const sendEmailWorkflow: Workflow = {
        id: "wf-send-email",
        userId: "user-123",
        name: "Automated Send Email",
        description: "Direct send attempt",
        status: "active",
        isApproved: true,
        requiresApprovalForRuns: false,
        steps: [
          {
            id: "step-1",
            name: "Send Direct Email",
            type: "action",
            service: "gmail",
            actionType: "gmail.send_email",
            config: { to: "external@example.com" },
            order: 0,
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const run = await executeWorkflow(sendEmailWorkflow);
      expect(run.status).toBe("awaiting_approval");
      expect(run.sanitizedError).toContain("Direct email sending requires explicit human approval");
    });
  });
});
