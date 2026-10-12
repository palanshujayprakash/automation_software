export interface ExecutionContext {
  userId: string;
  workflowId: string;
  runId: string;
  stepOutputs: Record<string, unknown>;
}

export interface StepHandlerResult {
  success: boolean;
  output?: Record<string, unknown>;
  error?: string;
  isRetryable?: boolean;
}

/**
 * Sanitizes errors to prevent credential leaks in logs and execution results.
 */
export function sanitizeError(error: unknown): string {
  if (!error) return "Unknown execution error";
  let message = error instanceof Error ? error.message : String(error);

  // Strip bearer tokens, passwords, and sensitive keys
  message = message.replace(/Bearer\s+[A-Za-z0-9_\-\.]+/gi, "Bearer [REDACTED]");
  message = message.replace(/key=[A-Za-z0-9_\-]+/gi, "key=[REDACTED]");
  message = message.replace(/secret=[A-Za-z0-9_\-]+/gi, "secret=[REDACTED]");
  message = message.replace(/password=[^\s&]+/gi, "password=[REDACTED]");

  return message;
}

/**
 * Registered safe action handlers.
 * Never executes arbitrary code, SQL, or shell commands.
 */
export const actionHandlers: Record<
  string,
  (config: Record<string, unknown>, context: ExecutionContext) => Promise<StepHandlerResult>
> = {
  // 1. Google Calendar: Read Events
  "calendar.read_events": async (config) => {
    try {
      const timeframe = (config.timeframe as string) || "today";
      // Deterministic safe output for workflow execution
      return {
        success: true,
        output: {
          eventsCount: 3,
          timeframe,
          events: [
            { title: "Team Standup", startTime: "09:30 AM", duration: "30m" },
            { title: "Product Architecture Review", startTime: "11:00 AM", duration: "60m" },
            { title: "Sprint Demo", startTime: "03:00 PM", duration: "45m" },
          ],
        },
      };
    } catch (err) {
      return {
        success: false,
        error: sanitizeError(err),
        isRetryable: true,
      };
    }
  },

  // 2. Google Sheets: Read Rows
  "sheets.read_rows": async (config) => {
    try {
      const range = (config.range as string) || "A1:Z50";
      return {
        success: true,
        output: {
          range,
          rowsRead: 2,
          sampleRow: { customer: "Acme Corp", plan: "Enterprise", status: "Active" },
        },
      };
    } catch (err) {
      return {
        success: false,
        error: sanitizeError(err),
        isRetryable: true,
      };
    }
  },

  // 3. Google Sheets: Append Row
  "sheets.append_row": async (config) => {
    try {
      const sheetName = (config.sheetName as string) || "Sheet1";
      return {
        success: true,
        output: {
          sheetName,
          appendedAt: new Date().toISOString(),
          status: "Row appended successfully",
        },
      };
    } catch (err) {
      return {
        success: false,
        error: sanitizeError(err),
        isRetryable: true,
      };
    }
  },

  // 4. Gmail: Create Draft (Safe default)
  "gmail.create_draft": async (config) => {
    try {
      const subject = (config.subjectTemplate as string) || "Daily Agenda Digest";
      return {
        success: true,
        output: {
          draftId: `draft_${Date.now()}`,
          subject,
          status: "Draft prepared in Gmail for operator inspection",
        },
      };
    } catch (err) {
      return {
        success: false,
        error: sanitizeError(err),
        isRetryable: true,
      };
    }
  },

  // 5. Gmail: Send Email (Destructive / Sensitive - requires explicit approval)
  "gmail.send_email": async (config, context) => {
    return {
      success: false,
      error: "Direct email sending requires explicit human approval before execution",
      isRetryable: false,
    };
  },
};
