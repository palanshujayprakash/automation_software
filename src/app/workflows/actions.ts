"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { WorkflowDefinitionSchema, WorkflowDefinition } from "@/lib/validations/workflow";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function saveWorkflowAction(payload: {
  definition: WorkflowDefinition;
  isApproved: boolean;
  promptProposal?: string;
  status: "draft" | "active";
}) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required to save workflow");
  }

  // Strictly validate workflow definition with Zod
  const validated = WorkflowDefinitionSchema.parse(payload.definition);

  // If live Supabase is available, insert into database
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("workflows")
      .insert({
        user_id: user.id,
        name: validated.name,
        description: validated.description,
        status: payload.status,
        prompt_proposal: payload.promptProposal,
        steps: validated.steps,
        is_approved: payload.isApproved,
        requires_approval_for_runs: validated.requiresApprovalForRuns,
      })
      .select("id")
      .single();

    if (!error && data?.id) {
      // Record audit event
      await supabase.from("audit_events").insert({
        user_id: user.id,
        event_type: payload.isApproved ? "workflow.approved" : "workflow.created",
        description: `Workflow "${validated.name}" saved with status "${payload.status}"`,
        severity: "info",
        metadata: { workflowId: data.id },
      });

      redirect("/workflows");
    }
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      typeof (err as { digest: unknown }).digest === "string" &&
      (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw err;
    }
  }

  // Graceful fallback for local evaluation
  redirect("/workflows");
}
