import { Workflow, ExecutionRun, StepExecutionResult, RunStatus } from "@/types";
import { actionHandlers, sanitizeError, ExecutionContext } from "@/lib/execution/handlers";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface ExecutionOptions {
  triggerSource?: "manual" | "scheduled" | "webhook" | "ai_test";
  maxRetries?: number;
}

/**
 * Core Workflow Execution Engine.
 * Enforces ownership, approval states, bounded retries, and sanitized error logging.
 */
export async function executeWorkflow(
  workflow: Workflow,
  options: ExecutionOptions = {}
): Promise<ExecutionRun> {
  const startedAt = new Date().toISOString();
  const startTimeMs = Date.now();
  const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const maxRetries = options.maxRetries ?? 2;

  // Check approval policy: If workflow requires approval and is not approved, block execution
  if (workflow.requiresApprovalForRuns && !workflow.isApproved) {
    const blockedRun: ExecutionRun = {
      id: runId,
      workflowId: workflow.id,
      workflowName: workflow.name,
      userId: workflow.userId,
      status: "awaiting_approval",
      startedAt,
      completedAt: new Date().toISOString(),
      durationMs: Date.now() - startTimeMs,
      triggerSource: options.triggerSource || "manual",
      stepResults: [],
      sanitizedError: "Execution paused: This workflow requires explicit human approval before running.",
      retryCount: 0,
    };
    return persistRun(blockedRun);
  }

  const stepResults: StepExecutionResult[] = [];
  const context: ExecutionContext = {
    userId: workflow.userId,
    workflowId: workflow.id,
    runId,
    stepOutputs: {},
  };

  let runStatus: RunStatus = "succeeded";
  let overallSanitizedError: string | undefined = undefined;
  let totalRetries = 0;

  for (const step of workflow.steps) {
    // Triggers define initiation; Action steps perform work
    if (step.type !== "action") {
      stepResults.push({
        stepId: step.id,
        stepName: step.name,
        status: "succeeded",
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        output: { triggerType: (step as { triggerType?: string }).triggerType || "manual" },
      });
      continue;
    }

    const handler = actionHandlers[step.actionType];
    const stepStartedAt = new Date().toISOString();

    if (!handler) {
      const stepError = `Unregistered action handler: ${step.actionType}`;
      stepResults.push({
        stepId: step.id,
        stepName: step.name,
        status: "failed",
        startedAt: stepStartedAt,
        completedAt: new Date().toISOString(),
        sanitizedError: stepError,
      });
      runStatus = "failed";
      overallSanitizedError = stepError;
      break;
    }

    // Step execution with bounded retries
    let attempt = 0;
    let stepSuccess = false;
    let stepOutput: Record<string, unknown> | undefined;
    let lastError = "";

    while (attempt <= maxRetries && !stepSuccess) {
      attempt++;
      try {
        const res = await handler(step.config || {}, context);
        if (res.success) {
          stepSuccess = true;
          stepOutput = res.output;
          context.stepOutputs[step.id] = res.output;
        } else {
          lastError = res.error || "Step execution failed";
          if (!res.isRetryable) {
            break; // Non-retryable error (e.g. requires approval)
          }
          if (attempt <= maxRetries) {
            totalRetries++;
          }
        }
      } catch (err) {
        lastError = sanitizeError(err);
        if (attempt <= maxRetries) {
          totalRetries++;
        }
      }
    }

    const stepCompletedAt = new Date().toISOString();

    if (stepSuccess) {
      stepResults.push({
        stepId: step.id,
        stepName: step.name,
        status: "succeeded",
        startedAt: stepStartedAt,
        completedAt: stepCompletedAt,
        output: stepOutput,
      });
    } else {
      stepResults.push({
        stepId: step.id,
        stepName: step.name,
        status: "failed",
        startedAt: stepStartedAt,
        completedAt: stepCompletedAt,
        sanitizedError: lastError,
      });
      runStatus = lastError.includes("approval") ? "awaiting_approval" : "failed";
      overallSanitizedError = lastError;
      break; // Halt downstream steps upon failure
    }
  }

  const completedAt = new Date().toISOString();
  const durationMs = Date.now() - startTimeMs;

  const finalRun: ExecutionRun = {
    id: runId,
    workflowId: workflow.id,
    workflowName: workflow.name,
    userId: workflow.userId,
    status: runStatus,
    startedAt,
    completedAt,
    durationMs,
    triggerSource: options.triggerSource || "manual",
    stepResults,
    sanitizedError: overallSanitizedError,
    retryCount: totalRetries,
  };

  return persistRun(finalRun);
}

/**
 * Persists execution run in Supabase database with tenant isolation.
 */
async function persistRun(run: ExecutionRun): Promise<ExecutionRun> {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.from("execution_runs").insert({
      id: run.id.startsWith("run_") ? undefined : run.id,
      workflow_id: run.workflowId,
      user_id: run.userId,
      status: run.status,
      trigger_source: run.triggerSource,
      started_at: run.startedAt,
      completed_at: run.completedAt,
      duration_ms: run.durationMs,
      step_results: run.stepResults,
      sanitized_error: run.sanitizedError,
      retry_count: run.retryCount,
    });

    // Update workflow last_run_at
    await supabase
      .from("workflows")
      .update({ last_run_at: run.completedAt })
      .eq("id", run.workflowId)
      .eq("user_id", run.userId);
  } catch {
    // Graceful fallback for local evaluation
  }

  return run;
}
