import { z } from "zod";

export const TriggerSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: z.literal("trigger"),
  triggerType: z.enum(["manual", "schedule", "webhook"]),
  config: z.record(z.unknown()),
  order: z.number().int().nonnegative(),
});

export const ConditionSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: z.literal("condition"),
  operator: z.enum(["equals", "contains", "greater_than", "less_than"]),
  field: z.string(),
  value: z.unknown(),
  order: z.number().int().nonnegative(),
});

export const ActionSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: z.literal("action"),
  service: z.enum(["gmail", "calendar", "sheets", "system"]),
  actionType: z.enum([
    // Google Calendar
    "calendar.read_events",
    "calendar.create_event",
    // Google Sheets
    "sheets.read_rows",
    "sheets.append_row",
    // Gmail
    "gmail.create_draft",
    "gmail.send_email", // Sensitive - requires explicit approval
  ]),
  config: z.record(z.unknown()),
  order: z.number().int().nonnegative(),
});

export const WorkflowStepUnion = z.discriminatedUnion("type", [
  TriggerSchema,
  ConditionSchema,
  ActionSchema,
]);

export const WorkflowDefinitionSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).default(""),
  version: z.literal("1.0.0").default("1.0.0"),
  steps: z.array(WorkflowStepUnion).min(1),
  requiresApprovalForRuns: z.boolean().default(true),
});

export type WorkflowDefinition = z.infer<typeof WorkflowDefinitionSchema>;
