import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Workflow, ExecutionRun, Integration, DashboardMetrics } from "@/types";

export interface DashboardData {
  metrics: DashboardMetrics;
  recentWorkflows: Workflow[];
  recentRuns: ExecutionRun[];
  integrations: {
    service: "gmail" | "calendar" | "sheets";
    name: string;
    status: "connected" | "disconnected" | "error";
  }[];
  isDemoMode: boolean;
}

/**
 * Fetches real authenticated dashboard metrics from Supabase.
 * Enforces ownership by filtering all queries with userId derived from the verified session.
 */
export async function getDashboardData(
  userId: string,
  isDemoUser: boolean = false
): Promise<DashboardData> {
  // If in demo user mode and database is not provisioned, return clear demo state
  if (isDemoUser) {
    return {
      metrics: {
        totalWorkflows: 3,
        activeWorkflows: 2,
        successfulRuns: 14,
        failedRuns: 1,
        pendingApprovals: 1,
        connectedIntegrationsCount: 2,
      },
      recentWorkflows: [
        {
          id: "demo-wf-1",
          userId,
          name: "Daily Calendar Summary to Sheets",
          description: "Extracts morning schedule and appends meeting agenda to spreadsheets.",
          status: "active",
          steps: [],
          isApproved: true,
          requiresApprovalForRuns: true,
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          updatedAt: new Date(Date.now() - 3600000).toISOString(),
          lastRunAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          nextScheduledRunAt: new Date(Date.now() + 3600000 * 12).toISOString(),
        },
        {
          id: "demo-wf-2",
          userId,
          name: "Email Draft on Spreadsheet Update",
          description: "Prepares a review email draft in Gmail when client rows change.",
          status: "active",
          steps: [],
          isApproved: true,
          requiresApprovalForRuns: true,
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          lastRunAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "demo-wf-3",
          userId,
          name: "Weekly Schedule Audit",
          description: "Runs on Fridays to log all calendar commitments.",
          status: "draft",
          steps: [],
          isApproved: false,
          requiresApprovalForRuns: true,
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
      ],
      recentRuns: [
        {
          id: "run-001",
          workflowId: "demo-wf-1",
          workflowName: "Daily Calendar Summary to Sheets",
          userId,
          status: "succeeded",
          startedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          completedAt: new Date(Date.now() - 3600000 * 4 + 1820).toISOString(),
          durationMs: 1820,
          triggerSource: "scheduled",
          stepResults: [],
          retryCount: 0,
        },
        {
          id: "run-002",
          workflowId: "demo-wf-2",
          workflowName: "Email Draft on Spreadsheet Update",
          userId,
          status: "awaiting_approval",
          startedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          triggerSource: "manual",
          stepResults: [],
          retryCount: 0,
        },
        {
          id: "run-003",
          workflowId: "demo-wf-1",
          workflowName: "Daily Calendar Summary to Sheets",
          userId,
          status: "failed",
          startedAt: new Date(Date.now() - 86400000).toISOString(),
          completedAt: new Date(Date.now() - 86400000 + 450).toISOString(),
          durationMs: 450,
          triggerSource: "scheduled",
          sanitizedError: "Google Sheets quota temporary limit reached. Retried 2 times.",
          stepResults: [],
          retryCount: 2,
        },
      ],
      integrations: [
        { service: "calendar", name: "Google Calendar", status: "connected" },
        { service: "sheets", name: "Google Sheets", status: "connected" },
        { service: "gmail", name: "Gmail", status: "disconnected" },
      ],
      isDemoMode: true,
    };
  }

  // Live Supabase Database Query
  try {
    const supabase = await createServerSupabaseClient();

    // Parallelized Database Queries with Promise.all() to minimize response time
    const [workflowsRes, runsRes, integrationsRes] = await Promise.all([
      supabase
        .from("workflows")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("execution_runs")
        .select("*")
        .eq("user_id", userId)
        .order("started_at", { ascending: false })
        .limit(10),
      supabase
        .from("integrations")
        .select("service, status")
        .eq("user_id", userId),
    ]);

    const workflowsData = workflowsRes.data;
    const runsData = runsRes.data;
    const integrationsData = integrationsRes.data;

    const workflows: Workflow[] = (workflowsData || []).map((w) => ({
      id: w.id,
      userId: w.user_id,
      name: w.name,
      description: w.description,
      status: w.status,
      promptProposal: w.prompt_proposal,
      steps: w.steps || [],
      isApproved: w.is_approved,
      requiresApprovalForRuns: w.requires_approval_for_runs,
      createdAt: w.created_at,
      updatedAt: w.updated_at,
      lastRunAt: w.last_run_at,
      nextScheduledRunAt: w.next_scheduled_run_at,
    }));

    const runs: ExecutionRun[] = (runsData || []).map((r) => ({
      id: r.id,
      workflowId: r.workflow_id,
      workflowName: r.workflow_name || "Workflow",
      userId: r.user_id,
      status: r.status,
      startedAt: r.started_at,
      completedAt: r.completed_at,
      durationMs: r.duration_ms,
      triggerSource: r.trigger_source,
      stepResults: r.step_results || [],
      sanitizedError: r.sanitized_error,
      retryCount: r.retry_count || 0,
    }));

    const connectedMap = new Map<string, "connected" | "disconnected" | "error">();
    (integrationsData || []).forEach((item) => {
      connectedMap.set(item.service, item.status as "connected" | "disconnected" | "error");
    });

    const standardServices: Array<{ service: "gmail" | "calendar" | "sheets"; name: string }> = [
      { service: "calendar", name: "Google Calendar" },
      { service: "sheets", name: "Google Sheets" },
      { service: "gmail", name: "Gmail" },
    ];

    const integrations = standardServices.map((s) => ({
      service: s.service,
      name: s.name,
      status: connectedMap.get(s.service) || ("disconnected" as const),
    }));

    const successfulRuns = runs.filter((r) => r.status === "succeeded").length;
    const failedRuns = runs.filter((r) => r.status === "failed").length;
    const pendingApprovals = runs.filter((r) => r.status === "awaiting_approval").length;
    const connectedCount = integrations.filter((i) => i.status === "connected").length;

    return {
      metrics: {
        totalWorkflows: workflows.length,
        activeWorkflows: workflows.filter((w) => w.status === "active").length,
        successfulRuns,
        failedRuns,
        pendingApprovals,
        connectedIntegrationsCount: connectedCount,
      },
      recentWorkflows: workflows.slice(0, 5),
      recentRuns: runs,
      integrations,
      isDemoMode: false,
    };
  } catch {
    // If Supabase is unreachable, return empty real state
    return {
      metrics: {
        totalWorkflows: 0,
        activeWorkflows: 0,
        successfulRuns: 0,
        failedRuns: 0,
        pendingApprovals: 0,
        connectedIntegrationsCount: 0,
      },
      recentWorkflows: [],
      recentRuns: [],
      integrations: [
        { service: "calendar", name: "Google Calendar", status: "disconnected" },
        { service: "sheets", name: "Google Sheets", status: "disconnected" },
        { service: "gmail", name: "Gmail", status: "disconnected" },
      ],
      isDemoMode: false,
    };
  }
}
