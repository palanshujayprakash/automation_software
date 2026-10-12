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
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function NewWorkflowPage() {
  const [promptText, setPromptText] = React.useState(
    "Every morning, summarize my calendar events and save the summary to Google Sheets."
  );

  const samplePrompts = [
    "Every morning, summarize my calendar events and save the summary to Google Sheets.",
    "When a new spreadsheet row is added, draft a confirmation email in Gmail.",
    "Read today's schedule and prepare a daily digest draft.",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary-600" />
            AI Workflow Builder
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Describe your automation in plain English. The AI generates a structured proposal requiring your explicit review and approval.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/workflows">
            <Button variant="outline" size="sm">Cancel</Button>
          </Link>
          <Button size="sm" disabled>Save Proposal</Button>
        </div>
      </div>

      {/* AI Prompt Input Section */}
      <Card className="border-primary-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
            Natural Language Automation Prompt
          </CardTitle>
          <CardDescription>
            State the trigger, condition, and target actions. Only registered safe actions are allowed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              className="w-full rounded-lg border border-slate-200 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="e.g. Read my calendar events for today and write a summary to Google Sheets..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-500 font-medium">Try example:</span>
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

          <div className="pt-2 flex justify-between items-center">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Zod schema validation enforced server-side. Untrusted code execution prohibited.
            </span>
            <Button size="sm" className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Generate Workflow
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Step Preview (Prototype Proposal View) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            Proposed Workflow Steps
          </h3>
          <Badge variant="outline" className="text-xs">
            Review Mode • Not Yet Executed
          </Badge>
        </div>

        {/* Step Nodes Chain */}
        <div className="space-y-3">
          {/* Step 1: Trigger */}
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">Step 1 • Trigger</span>
                <Badge variant="info" className="text-[10px]">Scheduled</Badge>
              </div>
              <h4 className="text-sm font-medium text-slate-900 mt-0.5">Every morning at 08:00 AM</h4>
              <p className="text-xs text-slate-500">Cron schedule: 0 8 * * *</p>
            </div>
          </div>

          {/* Step 2: Read Calendar */}
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Step 2 • Action</span>
                <Badge variant="default" className="text-[10px]">Google Calendar</Badge>
              </div>
              <h4 className="text-sm font-medium text-slate-900 mt-0.5">Read calendar events for today</h4>
              <p className="text-xs text-slate-500">Scope: https://www.googleapis.com/auth/calendar.readonly</p>
            </div>
          </div>

          {/* Step 3: Write to Sheets */}
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Step 3 • Action</span>
                <Badge variant="success" className="text-[10px]">Google Sheets</Badge>
              </div>
              <h4 className="text-sm font-medium text-slate-900 mt-0.5">Append summary row to configured sheet</h4>
              <p className="text-xs text-slate-500">Requires explicit permission and connection before first run.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
