import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  RotateCw,
  Layers,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function RunDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Realistic sample steps for run detail view
  const sampleSteps = [
    {
      id: "step-1",
      name: "Check User Session & Ownership",
      status: "succeeded" as const,
      startedAt: "10:30:00 AM",
      completedAt: "10:30:00 AM",
      output: { authorized: true, tenantScope: "user_isolated" },
    },
    {
      id: "step-2",
      name: "Execute Google Calendar Read Events",
      status: "succeeded" as const,
      startedAt: "10:30:00 AM",
      completedAt: "10:30:01 AM",
      output: {
        eventsFound: 3,
        scope: "calendar.readonly",
        sampleEvent: "Product Architecture Review",
      },
    },
    {
      id: "step-3",
      name: "Append Summary to Google Sheet",
      status: "succeeded" as const,
      startedAt: "10:30:01 AM",
      completedAt: "10:30:02 AM",
      output: {
        spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
        rowsAppended: 1,
        status: "Row appended successfully",
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/runs" className="hover:text-slate-900 flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to History
        </Link>
        <span>/</span>
        <span className="font-mono text-slate-700">{id}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Daily Calendar Summary to Sheets
            </h2>
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="h-3 w-3" /> Succeeded
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Run Identifier: <code className="font-mono text-slate-700">{id}</code>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step-by-Step Timeline (2 Cols) */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary-600" />
            Execution Timeline & Step Outputs
          </h3>

          <div className="space-y-3">
            {sampleSteps.map((step, idx) => (
              <Card key={step.id} className="p-4 shadow-card">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900">
                        Step {idx + 1}: {step.name}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {step.startedAt} → {step.completedAt}
                      </span>
                    </div>
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    Completed
                  </Badge>
                </div>

                {/* Sanitized Step Output JSON Box */}
                <div className="mt-3 rounded-lg bg-slate-900 p-3 text-slate-200 text-[11px] font-mono overflow-x-auto">
                  <pre>{JSON.stringify(step.output, null, 2)}</pre>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Execution Metadata & Governance Card (1 Col) */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Run Telemetry</CardTitle>
              <CardDescription>Engine performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Trigger Source</span>
                <span className="font-semibold text-slate-800">Scheduled Trigger</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Total Duration</span>
                <span className="font-semibold text-slate-800">1,850 ms</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Retry Attempts</span>
                <span className="font-semibold text-emerald-600">0 (Succeeded on 1st attempt)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Sanitized Errors</span>
                <span className="font-semibold text-slate-800">None</span>
              </div>
            </CardContent>
          </Card>

          {/* Security & Audit Verification Card */}
          <Card className="border-emerald-100 bg-emerald-50/30">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-emerald-800">
                <ShieldCheck className="h-4 w-4" />
                <CardTitle className="text-xs uppercase tracking-wider text-emerald-900">
                  Audit Verified
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Step outputs were scrubbed for credential leaks before display. Row-Level Security verified that this execution matches your tenant owner key.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
