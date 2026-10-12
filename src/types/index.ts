export type WorkflowStatus = "draft" | "active" | "paused" | "error";

export type StepType = "trigger" | "condition" | "action";

export interface WorkflowStep {
  id: string;
  name: string;
  type: StepType;
  service?: "gmail" | "calendar" | "sheets" | "system";
  actionType: string;
  config: Record<string, unknown>;
  order: number;
}

export interface Workflow {
  id: string;
  userId: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  promptProposal?: string;
  steps: WorkflowStep[];
  isApproved: boolean;
  requiresApprovalForRuns: boolean;
  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;
  nextScheduledRunAt?: string;
}

export type RunStatus =
  | "succeeded"
  | "failed"
  | "running"
  | "queued"
  | "awaiting_approval"
  | "cancelled";

export interface StepExecutionResult {
  stepId: string;
  stepName: string;
  status: "succeeded" | "failed" | "skipped";
  startedAt: string;
  completedAt: string;
  output?: Record<string, unknown>;
  sanitizedError?: string;
}

export interface ExecutionRun {
  id: string;
  workflowId: string;
  workflowName: string;
  userId: string;
  status: RunStatus;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  triggerSource: "manual" | "scheduled" | "webhook" | "ai_test";
  stepResults: StepExecutionResult[];
  sanitizedError?: string;
  retryCount: number;
}

export type IntegrationService = "gmail" | "calendar" | "sheets";
export type IntegrationStatus = "connected" | "disconnected" | "error";

export interface Integration {
  id: string;
  userId: string;
  service: IntegrationService;
  status: IntegrationStatus;
  accountEmail?: string;
  grantedScopes: string[];
  connectedAt?: string;
  lastVerifiedAt?: string;
  errorMessage?: string;
}

export interface AuditEvent {
  id: string;
  userId: string;
  eventType:
    | "auth.login"
    | "auth.logout"
    | "integration.connected"
    | "integration.disconnected"
    | "workflow.created"
    | "workflow.approved"
    | "workflow.executed"
    | "security.token_revoked";
  description: string;
  severity: "info" | "warning" | "critical";
  ipAddress?: string;
  timestamp: string;
}

export interface SecurityCheck {
  id: string;
  title: string;
  category: "authentication" | "integrations" | "rls" | "encryption";
  status: "verified" | "warning" | "unverified";
  description: string;
  remediation?: string;
}

export interface DashboardMetrics {
  totalWorkflows: number;
  activeWorkflows: number;
  successfulRuns: number;
  failedRuns: number;
  pendingApprovals: number;
  connectedIntegrationsCount: number;
}
