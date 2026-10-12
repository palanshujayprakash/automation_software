"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  FileSpreadsheet,
  Mail,
  Clock,
  AlertCircle,
  CheckCircle2,
  Lock,
  Layers,
  Edit2,
  Save,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkflowDefinition } from "@/lib/validations/workflow";
import { RequiredScopeInfo } from "@/lib/ai/workflow-generator";
import { saveWorkflowAction } from "@/app/workflows/actions";

export default function NewWorkflowPage() {
  const [promptText, setPromptText] = React.useState(
    "Every morning, summarize my calendar events and save the summary to Google Sheets."
  );
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [workflow, setWorkflow] = React.useState<WorkflowDefinition | null>(null);
  const [requiredScopes, setRequiredScopes] = React.useState<RequiredScopeInfo[]>([]);
  const [isApproved, setIsApproved] = React.useState(false);

  const samplePrompts = [
    "Every morning, summarize my calendar events and save the summary to Google Sheets.",
    "When a new spreadsheet row is added, draft a confirmation email in Gmail.",
    "Every weekday, compile calendar meetings into a morning digest draft.",
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setIsApproved(false);

    try {
      const res = await fetch("/api/workflows/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate workflow");
      }

      setWorkflow(data.workflow);
      setRequiredScopes(data.requiredScopes || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error generating workflow");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (status: "draft" | "active") => {
    if (!workflow) return;
    setIsSaving(true);
    try {
      await saveWorkflowAction({
        definition: workflow,
        isApproved,
        promptProposal: promptText,
        status,
      });
    } catch {
      // Handles Next.js redirect
    }
  };

  const handleStepNameChange = (index: number, newName: string) => {
    if (!workflow) return;
    const updatedSteps = [...workflow.steps];
    updatedSteps[index] = { ...updatedSteps[index], name: newName };
    setWorkflow({ ...workflow, steps: updatedSteps });
  };

  const getServiceIcon = (service?: string) => {
    switch (service) {
      case "calendar":
        return <Calendar className="h-5 w-5 text-sky-600" />;
      case "sheets":
        return <FileSpreadsheet className="h-5 w-5 text-emerald-600" />;
      case "gmail":
        return <Mail className="h-5 w-5 text-rose-600" />;
      default:
        return <Clock className="h-5 w-5 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary-600" />
            AI Workflow Builder
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Describe your automation in natural language. Review the generated proposal, verify required scopes, and approve prior to execution.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/workflows">
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </Link>
          <Button
            size="sm"
            variant="outline"
            disabled={!workflow || isSaving}
            onClick={() => handleSave("draft")}
          >
            Save Draft
          </Button>
          <Button
            size="sm"
            disabled={!workflow || !isApproved || isSaving}
            isLoading={isSaving}
            onClick={() => handleSave("active")}
          >
            <CheckCircle2 className="h-4 w-4 mr-1.5" />
            Approve & Activate
          </Button>
        </div>
      </div>

      {/* AI Prompt Input Section */}
      <Card className="border-primary-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
            Natural Language Automation Prompt
          </CardTitle>
          <CardDescription>
            Specify triggers and Google actions. Untrusted arbitrary code execution is strictly prohibited.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="relative">
            <textarea
              rows={3}
              className="w-full rounded-lg border border-slate-200 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="e.g. Read my calendar events for today and save a summary in Google Sheets..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-500 font-medium">Try suggestion:</span>
            {samplePrompts.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPromptText(sample)}
                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                {sample.slice(0, 48)}...
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Validated against registered safe actions. Server-side Zod schema verification active.
            </span>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={handleGenerate}
              isLoading={isGenerating}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Generate Workflow Proposal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Proposal Preview Panel */}
      {workflow ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-slate-900">
                  {workflow.name}
                </h3>
                <Badge variant="default" className="text-xs">
                  AI Proposal v{workflow.version}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {workflow.description}
              </p>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <Layers className="h-4 w-4 text-slate-400" />
              <span>{workflow.steps.length} Pipeline Steps</span>
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            {workflow.steps.map((step, idx) => (
              <div
                key={step.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-card hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-200">
                    {getServiceIcon(step.type === "action" ? step.service : undefined)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Step {idx + 1} • {step.type}
                      </span>
                      {step.type === "action" && (
                        <Badge variant="outline" className="text-[10px]">
                          {step.service}
                        </Badge>
                      )}
                    </div>
                    <input
                      type="text"
                      className="text-sm font-semibold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-primary-500 focus:outline-none mt-0.5 w-full"
                      value={step.name}
                      onChange={(e) => handleStepNameChange(idx, e.target.value)}
                      title="Click to rename step"
                    />
                    <div className="text-xs text-slate-500 font-mono text-[11px]">
                      {step.type === "trigger" && `Trigger: ${(step as { triggerType: string }).triggerType}`}
                      {step.type === "action" && `Action: ${(step as { actionType: string }).actionType}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 self-end sm:self-center">
                  <Badge variant="muted" className="text-[10px]">
                    Step verified
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Required OAuth Scopes and Governance Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lock className="h-4 w-4 text-indigo-600" />
                  Required Google Permissions
                </CardTitle>
                <CardDescription>
                  Least-privilege OAuth scopes necessary to execute these steps
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {requiredScopes.length === 0 ? (
                  <p className="text-xs text-slate-400">No external scopes required.</p>
                ) : (
                  requiredScopes.map((scopeInfo, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 text-xs"
                    >
                      <div className="font-semibold text-slate-800 capitalize">
                        {scopeInfo.service}: {scopeInfo.description}
                      </div>
                      <code className="text-[10px] font-mono text-slate-500 break-all block mt-0.5">
                        {scopeInfo.scope}
                      </code>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Explicit Human Approval Card */}
            <Card className="border-indigo-100 bg-indigo-50/30 flex flex-col justify-between">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-indigo-950">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Human Approval Gate
                </CardTitle>
                <CardDescription>
                  AI output is a proposal only. Explicit approval is required prior to activation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <label className="flex items-start gap-3 p-3 rounded-lg bg-white border border-indigo-100 cursor-pointer shadow-2xs">
                  <input
                    type="checkbox"
                    checked={isApproved}
                    onChange={(e) => setIsApproved(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-900 block">
                      I have reviewed and approved this workflow definition
                    </span>
                    <span className="text-slate-500 block mt-0.5">
                      Confirming allows the engine to schedule or manually run these actions under your authenticated permissions.
                    </span>
                  </div>
                </label>
              </CardContent>
              <CardFooter className="pt-2 flex justify-end gap-2 border-t border-indigo-100/60">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSave("draft")}
                  disabled={isSaving}
                >
                  Save as Inactive Draft
                </Button>
                <Button
                  size="sm"
                  disabled={!isApproved || isSaving}
                  isLoading={isSaving}
                  onClick={() => handleSave("active")}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  Approve & Activate
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        /* Empty / Guidance State before generation */
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl border border-dashed border-slate-200 bg-white shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <h4 className="text-base font-semibold text-slate-900">
            Awaiting Automation Prompt
          </h4>
          <p className="text-xs text-slate-500 max-w-md mt-1 mb-4">
            Type your workflow requirement above and click <strong>Generate Workflow Proposal</strong>. You will receive an inspectable, step-by-step pipeline preview.
          </p>
        </div>
      )}
    </div>
  );
}
