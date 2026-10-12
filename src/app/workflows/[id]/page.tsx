import Link from "next/link";
import { ArrowLeft, Play, Pause, Edit, ShieldCheck, Clock, GitFork } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/workflows" className="hover:text-slate-900 flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" /> Back to Workflows
        </Link>
        <span>/</span>
        <span className="font-mono text-slate-700">{id}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Daily Calendar Digest
            </h2>
            <Badge variant="muted">Draft</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Summarizes morning schedule and appends meeting agenda to spreadsheets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit
          </Button>
          <Button size="sm">
            <Play className="h-3.5 w-3.5 mr-1.5" /> Run Now
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Configured Steps</CardTitle>
            <CardDescription>Execution pipeline definitions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs">
              <span className="font-semibold text-slate-900">1. Trigger: Scheduled Morning</span>
              <p className="text-slate-500 mt-0.5">Runs at 08:00 AM UTC everyday</p>
            </div>
            <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs">
              <span className="font-semibold text-slate-900">2. Action: Read Google Calendar</span>
              <p className="text-slate-500 mt-0.5">Fetches upcoming calendar events within next 12 hours</p>
            </div>
            <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs">
              <span className="font-semibold text-slate-900">3. Action: Write Google Sheet</span>
              <p className="text-slate-500 mt-0.5">Appends structured rows to target spreadsheet</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Governance & Policy</CardTitle>
            <CardDescription>Security and execution safeguards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Requires Approval</span>
              <span className="font-medium text-slate-800">Enabled</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Max Retries</span>
              <span className="font-medium text-slate-800">2 attempts</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Timeout</span>
              <span className="font-medium text-slate-800">30 seconds</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 p-2 rounded-lg mt-2">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>RLS owner verification verified on server</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
