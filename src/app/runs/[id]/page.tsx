import Link from "next/link";
import { ArrowLeft, History, CheckCircle2, AlertTriangle, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function RunDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/runs" className="hover:text-slate-900 flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" /> Back to History
        </Link>
        <span>/</span>
        <span className="font-mono text-slate-700">{id}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Execution Record
            </h2>
            <Badge variant="info">Queued</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Run ID: <code className="font-mono text-slate-700">{id}</code>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Execution Timeline & Steps</CardTitle>
            <CardDescription>Step-level execution outputs and logs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">Step 1: Check Authorization</span>
                <Badge variant="success" className="text-[10px]">Verified</Badge>
              </div>
              <p className="text-slate-500 mt-1">Ownership and RLS checked against authenticated user.</p>
            </div>
            <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">Step 2: Service Adapter Execution</span>
                <Badge variant="muted" className="text-[10px]">Pending</Badge>
              </div>
              <p className="text-slate-500 mt-1">Awaiting worker thread execution.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Run Metadata</CardTitle>
            <CardDescription>Execution environment attributes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Trigger Source</span>
              <span className="font-medium text-slate-800">Manual User Run</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Retry Count</span>
              <span className="font-medium text-slate-800">0</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Sanitized Errors</span>
              <span className="font-medium text-emerald-600">None</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
