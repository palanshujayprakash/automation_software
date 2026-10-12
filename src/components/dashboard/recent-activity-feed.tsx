import * as React from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExecutionRun } from "@/types";

export function RecentActivityFeed({ runs }: { runs: ExecutionRun[] }) {
  const getStatusIcon = (status: ExecutionRun["status"]) => {
    switch (status) {
      case "succeeded":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "awaiting_approval":
        return <ShieldCheck className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: ExecutionRun["status"]) => {
    switch (status) {
      case "succeeded":
        return <Badge variant="success">Succeeded</Badge>;
      case "failed":
        return <Badge variant="error">Failed</Badge>;
      case "awaiting_approval":
        return <Badge variant="warning">Needs Approval</Badge>;
      default:
        return <Badge variant="info">Running</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle>Recent Run History</CardTitle>
          <CardDescription>Execution outputs and duration records</CardDescription>
        </div>
        <Link href="/runs">
          <Button variant="ghost" size="sm" className="text-xs">
            All runs <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {runs.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            No pipeline executions triggered yet.
          </div>
        ) : (
          <div className="space-y-3">
            {runs.map((run) => (
              <div
                key={run.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors text-xs"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(run.status)}
                  <div>
                    <div className="font-semibold text-slate-900">
                      {run.workflowName}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>{new Date(run.startedAt).toLocaleTimeString()}</span>
                      {run.durationMs && <span>• {run.durationMs}ms</span>}
                      {run.sanitizedError && (
                        <span className="text-red-500 font-medium">
                          • {run.sanitizedError.slice(0, 32)}...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(run.status)}
                  <Link href={`/runs/${run.id}`}>
                    <Button variant="ghost" size="sm" className="h-7 text-xs px-2">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
