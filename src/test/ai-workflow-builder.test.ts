import { describe, it, expect } from "vitest";
import {
  generateWorkflowFromPrompt,
  getRequiredScopesForSteps,
} from "@/lib/ai/workflow-generator";
import { WorkflowDefinitionSchema } from "@/lib/validations/workflow";

describe("Module 4: AI Workflow Builder Engine", () => {
  describe("generateWorkflowFromPrompt", () => {
    it("generates a valid calendar-to-sheets workflow from natural language", async () => {
      const result = await generateWorkflowFromPrompt(
        "Read my calendar events for today and save a summary in Google Sheets."
      );

      expect(result.workflow).toBeDefined();
      expect(result.workflow.name).toBe("Calendar Schedule to Google Sheets");
      expect(result.workflow.steps.length).toBe(3);

      // Verify all steps pass Zod schema
      const parsed = WorkflowDefinitionSchema.safeParse(result.workflow);
      expect(parsed.success).toBe(true);

      // Verify required scopes
      expect(result.requiredScopes.some((s) => s.service === "calendar")).toBe(true);
      expect(result.requiredScopes.some((s) => s.service === "sheets")).toBe(true);
    });

    it("generates a sheets-to-gmail-draft workflow from spreadsheet update prompt", async () => {
      const result = await generateWorkflowFromPrompt(
        "When a new spreadsheet row is added, draft a confirmation email in Gmail."
      );

      expect(result.workflow).toBeDefined();
      expect(result.workflow.name).toBe("Spreadsheet Row to Gmail Draft");
      expect(result.workflow.steps.some((s) => s.type === "action" && s.service === "gmail")).toBe(true);

      const parsed = WorkflowDefinitionSchema.safeParse(result.workflow);
      expect(parsed.success).toBe(true);

      expect(result.requiredScopes.some((s) => s.service === "gmail")).toBe(true);
    });

    it("throws an error when prompt is too short", async () => {
      await expect(generateWorkflowFromPrompt("hi")).rejects.toThrow(
        "Prompt must be at least 5 characters long"
      );
    });
  });

  describe("Scope Boundary Detection", () => {
    it("deduplicates required scopes across multiple action steps", () => {
      const sampleSteps = [
        {
          id: "1",
          name: "Read Morning Events",
          type: "action" as const,
          service: "calendar" as const,
          actionType: "calendar.read_events" as const,
          config: {},
          order: 0,
        },
        {
          id: "2",
          name: "Read Afternoon Events",
          type: "action" as const,
          service: "calendar" as const,
          actionType: "calendar.read_events" as const,
          config: {},
          order: 1,
        },
      ];

      const scopes = getRequiredScopesForSteps(sampleSteps);
      expect(scopes.length).toBe(1);
      expect(scopes[0]?.service).toBe("calendar");
    });
  });
});
