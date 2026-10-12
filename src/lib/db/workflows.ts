import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Workflow } from "@/types";

/**
 * Data Access Layer for Workflows with mandatory user-ownership checks.
 * Combines Row-Level Security with explicit server-side authorization to prevent IDOR.
 */
export async function getUserWorkflows(userId: string): Promise<Workflow[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("workflows")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map((item) => ({
      id: item.id,
      userId: item.user_id,
      name: item.name,
      description: item.description,
      status: item.status,
      promptProposal: item.prompt_proposal,
      steps: item.steps || [],
      isApproved: item.is_approved,
      requiresApprovalForRuns: item.requires_approval_for_runs,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      lastRunAt: item.last_run_at,
      nextScheduledRunAt: item.next_scheduled_run_at,
    }));
  } catch {
    return [];
  }
}

export async function getWorkflowById(
  workflowId: string,
  userId: string
): Promise<Workflow | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("workflows")
      .select("*")
      .eq("id", workflowId)
      .eq("user_id", userId) // Crucial: enforce ownership match
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      description: data.description,
      status: data.status,
      promptProposal: data.prompt_proposal,
      steps: data.steps || [],
      isApproved: data.is_approved,
      requiresApprovalForRuns: data.requires_approval_for_runs,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      lastRunAt: data.last_run_at,
      nextScheduledRunAt: data.next_scheduled_run_at,
    };
  } catch {
    return null;
  }
}
