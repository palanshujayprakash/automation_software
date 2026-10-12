import * as React from "react";
import { GitFork, CheckCircle2, AlertTriangle, ShieldAlert, Blocks } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardMetrics } from "@/types";

export function MetricsGrid({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Workflows */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Total Workflows
          </CardTitle>
          <GitFork className="h-4 w-4 text-slate-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">
            {metrics.totalWorkflows}
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="font-medium text-slate-700">
              {metrics.activeWorkflows}
            </span>{" "}
            active pipelines
          </p>
        </CardContent>
      </Card>

      {/* Successful Runs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Successful Runs
          </CardTitle>
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">
            {metrics.successfulRuns}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {metrics.successfulRuns > 0
              ? "Completed without errors"
              : "Zero runs completed yet"}
          </p>
        </CardContent>
      </Card>

      {/* Failed Runs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Failed Runs
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">
            {metrics.failedRuns}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {metrics.failedRuns > 0
              ? "Sanitized errors logged"
              : "Zero errors recorded"}
          </p>
        </CardContent>
      </Card>

      {/* Connected Services */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Connected Services
          </CardTitle>
          <Blocks className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">
            {metrics.connectedIntegrationsCount} / 3
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gmail, Calendar, Sheets
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
