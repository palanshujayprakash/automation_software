import {
  WorkflowDefinitionSchema,
  WorkflowDefinition,
} from "@/lib/validations/workflow";

export interface RequiredScopeInfo {
  service: "gmail" | "calendar" | "sheets";
  scope: string;
  description: string;
}

/**
 * Maps registered action types to least-privilege OAuth scopes
 */
export function getRequiredScopesForSteps(
  steps: WorkflowDefinition["steps"]
): RequiredScopeInfo[] {
  const scopes: RequiredScopeInfo[] = [];
  const seen = new Set<string>();

  for (const step of steps) {
    if (step.type === "action") {
      if (step.service === "calendar") {
        const scope = "https://www.googleapis.com/auth/calendar.readonly";
        if (!seen.has(scope)) {
          seen.add(scope);
          scopes.push({
            service: "calendar",
            scope,
            description: "Read calendar events for scheduled digest generation",
          });
        }
      } else if (step.service === "sheets") {
        const scope = "https://www.googleapis.com/auth/spreadsheets";
        if (!seen.has(scope)) {
          seen.add(scope);
          scopes.push({
            service: "sheets",
            scope,
            description: "Append approved rows to Google Sheets",
          });
        }
      } else if (step.service === "gmail") {
        const scope = "https://www.googleapis.com/auth/gmail.compose";
        if (!seen.has(scope)) {
          seen.add(scope);
          scopes.push({
            service: "gmail",
            scope,
            description: "Draft emails for operator review (no direct send without approval)",
          });
        }
      }
    }
  }

  return scopes;
}

/**
 * Server-side AI Workflow Generator.
 * Parses user natural language request into a strictly validated Zod Workflow definition.
 * Never generates arbitrary code, SQL, or shell commands.
 */
export async function generateWorkflowFromPrompt(
  prompt: string
): Promise<{ workflow: WorkflowDefinition; requiredScopes: RequiredScopeInfo[] }> {
  const sanitizedPrompt = prompt.trim();
  if (sanitizedPrompt.length < 5) {
    throw new Error("Prompt must be at least 5 characters long");
  }

  const lower = sanitizedPrompt.toLowerCase();

  // Pattern A: Calendar -> Sheets summary
  if (
    (lower.includes("calendar") || lower.includes("meeting") || lower.includes("schedule")) &&
    (lower.includes("sheet") || lower.includes("spreadsheet"))
  ) {
    const rawProposal = {
      name: "Calendar Schedule to Google Sheets",
      description: `Automated summary generated from prompt: "${sanitizedPrompt}"`,
      version: "1.0.0" as const,
      requiresApprovalForRuns: true,
      steps: [
        {
          id: `step-${Date.now()}-1`,
          name: "Daily Morning Trigger",
          type: "trigger" as const,
          triggerType: "schedule" as const,
          config: { cron: "0 8 * * *", label: "Every morning at 08:00 AM UTC" },
          order: 0,
        },
        {
          id: `step-${Date.now()}-2`,
          name: "Read Today's Calendar Events",
          type: "action" as const,
          service: "calendar" as const,
          actionType: "calendar.read_events" as const,
          config: { timeframe: "today", maxResults: 20 },
          order: 1,
        },
        {
          id: `step-${Date.now()}-3`,
          name: "Append Event Digest to Google Sheet",
          type: "action" as const,
          service: "sheets" as const,
          actionType: "sheets.append_row" as const,
          config: {
            sheetName: "Daily Agenda",
            columns: ["Event Title", "Start Time", "Duration", "Attendees"],
          },
          order: 2,
        },
      ],
    };

    const validated = WorkflowDefinitionSchema.parse(rawProposal);
    return {
      workflow: validated,
      requiredScopes: getRequiredScopesForSteps(validated.steps),
    };
  }

  // Pattern B: Sheets update -> Gmail draft
  if (
    (lower.includes("sheet") || lower.includes("spreadsheet") || lower.includes("row")) &&
    (lower.includes("email") || lower.includes("gmail") || lower.includes("draft"))
  ) {
    const rawProposal = {
      name: "Spreadsheet Row to Gmail Draft",
      description: `Automated draft generated from prompt: "${sanitizedPrompt}"`,
      version: "1.0.0" as const,
      requiresApprovalForRuns: true,
      steps: [
        {
          id: `step-${Date.now()}-1`,
          name: "Spreadsheet Row Change Webhook",
          type: "trigger" as const,
          triggerType: "webhook" as const,
          config: { event: "row.added_or_updated" },
          order: 0,
        },
        {
          id: `step-${Date.now()}-2`,
          name: "Read Modified Row Content",
          type: "action" as const,
          service: "sheets" as const,
          actionType: "sheets.read_rows" as const,
          config: { range: "A2:Z" },
          order: 1,
        },
        {
          id: `step-${Date.now()}-3`,
          name: "Prepare Gmail Confirmation Draft",
          type: "action" as const,
          service: "gmail" as const,
          actionType: "gmail.create_draft" as const,
          config: {
            subjectTemplate: "Confirmation for {{row.title}}",
            requiresHumanApproval: true,
          },
          order: 2,
        },
      ],
    };

    const validated = WorkflowDefinitionSchema.parse(rawProposal);
    return {
      workflow: validated,
      requiredScopes: getRequiredScopesForSteps(validated.steps),
    };
  }

  // Pattern C: Default safe calendar summary
  const rawProposal = {
    name: "Automated Daily Summary",
    description: `AI proposal from prompt: "${sanitizedPrompt}"`,
    version: "1.0.0" as const,
    requiresApprovalForRuns: true,
    steps: [
      {
        id: `step-${Date.now()}-1`,
        name: "Morning Schedule Trigger",
        type: "trigger" as const,
        triggerType: "schedule" as const,
        config: { cron: "0 9 * * 1-5", label: "Weekdays at 09:00 AM" },
        order: 0,
      },
      {
        id: `step-${Date.now()}-2`,
        name: "Read Upcoming Calendar Events",
        type: "action" as const,
        service: "calendar" as const,
        actionType: "calendar.read_events" as const,
        config: { timeframe: "next_24_hours" },
        order: 1,
      },
      {
        id: `step-${Date.now()}-3`,
        name: "Create Gmail Daily Digest Draft",
        type: "action" as const,
        service: "gmail" as const,
        actionType: "gmail.create_draft" as const,
        config: {
          subjectTemplate: "Your Agenda for Today",
          includeCalendarSummary: true,
        },
        order: 2,
      },
    ],
  };

  const validated = WorkflowDefinitionSchema.parse(rawProposal);
  return {
    workflow: validated,
    requiredScopes: getRequiredScopesForSteps(validated.steps),
  };
}
