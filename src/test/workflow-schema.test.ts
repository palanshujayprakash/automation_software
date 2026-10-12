import { describe, it, expect } from "vitest";
import { WorkflowDefinitionSchema } from "@/lib/validations/workflow";

describe("WorkflowDefinitionSchema", () => {
  it("successfully validates a valid calendar-to-sheets workflow", () => {
    const validWorkflow = {
      name: "Daily Calendar Summary",
      description: "Read calendar events and append summary to Google Sheets",
      version: "1.0.0",
      requiresApprovalForRuns: true,
      steps: [
        {
          id: "step-1",
          name: "Morning Schedule Trigger",
          type: "trigger",
          triggerType: "schedule",
          config: { cron: "0 8 * * *" },
          order: 0,
        },
        {
          id: "step-2",
          name: "Read Today's Events",
          type: "action",
          service: "calendar",
          actionType: "calendar.read_events",
          config: { timeframe: "today" },
          order: 1,
        },
        {
          id: "step-3",
          name: "Append to Spreadsheet",
          type: "action",
          service: "sheets",
          actionType: "sheets.append_row",
          config: { spreadsheetId: "sheet-123" },
          order: 2,
        },
      ],
    };

    const parsed = WorkflowDefinitionSchema.safeParse(validWorkflow);
    expect(parsed.success).toBe(true);
  });

  it("rejects untrusted or unregistered action types", () => {
    const maliciousWorkflow = {
      name: "Arbitrary Code Execution Attempt",
      description: "Should be rejected by validator",
      version: "1.0.0",
      requiresApprovalForRuns: true,
      steps: [
        {
          id: "step-1",
          name: "Malicious Shell Step",
          type: "action",
          service: "system",
          actionType: "system.execute_bash_command",
          config: { command: "rm -rf /" },
          order: 0,
        },
      ],
    };

    const parsed = WorkflowDefinitionSchema.safeParse(maliciousWorkflow);
    expect(parsed.success).toBe(false);
  });
});
