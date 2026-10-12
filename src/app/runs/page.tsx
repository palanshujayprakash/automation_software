"use client";

import * as React from "react";
import Link from "next/link";
import {
  History,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  RotateCw,
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
import { Input } from "@/components/ui/input";
import { ExecutionRun, RunStatus } from "@/types";

export default function RunsPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<RunStatus | "all">("all");

  const [runs] = React.useState<ExecutionRun[]>([
    {
      id: "run-20261012-01",
      workflowId: "demo-wf-1",
      workflowName: "Daily Calendar Summary to Sheets",
      userId: "user-1",
      status: "succeeded",
      startedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      completedAt: new Date(Date.now() - 3600000 * 2 + 1850).toISOString(),
      durationMs: 1850,
      triggerSource: "scheduled",
      stepResults: [],
      retryCount: 0,
    },
    {
      id: "run-20261012-02",
      workflowId: "demo-wf-2",
      workflowName: "Spreadsheet Row to Gmail Draft",
      userId: "user-1",
      status: "awaiting_approval",
      startedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      triggerSource: "manual",
      stepResults: [],
      sanitizedError: "Direct email sending requires explicit human approval before execution",
      retryCount: 0,
    },
    {
      id: "run-20261012-03",
      workflowId: "demo-wf-1",
      workflowName: "Daily Calendar Summary to Sheets",
      userId: "user-1",
      status: "failed",
      startedAt: new Date(Date.now() - 86400000).toISOString(),
      completedAt: new Date(Date.now() - 86400000 + 620).toISOString(),
      durationMs: 620,
      triggerSource: "manual",
      stepResults: [],
      sanitizedError: "Google Sheets quota temporary limit reached. Retried 2 times.",
      retryCount: 2,
    },
  ]);

  const filteredRuns = runs.filter((run) => {
    const matchesSearch =
      run.workflowName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      run.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ? true : run.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: RunStatus) => {
    switch (status) {
      case "succeeded":
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="h-3 w-3" /> Succeeded
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="error" className="gap-1">
            <AlertTriangle className="h-3 w-3" /> Failed
          </Badge>
        );
      case "awaiting_approval":
        return (
          <Badge variant="warning" className="gap-1">
            <ShieldCheck className="h-3 w-3" /> Awaiting Approval
          </Badge>
        );
      default:
        return (
          <Badge variant="info" className="gap-1">
            <Clock className="h-3 w-3" /> Running
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Execution History
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit logs and step execution timelines for all automated and manual pipeline runs
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by workflow or run ID..."
            className="pl-8 text-xs h-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(["all", "succeeded", "failed", "awaiting_approval"] as const).map(
            (status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "primary" : "outline"}
                size="sm"
                className="text-xs capitalize h-8"
                onClick={() => setStatusFilter(status)}
              >
                {status.replace("_", " ")}
              </Button>
            )
          )}
        </div>
      </div>

      {/* Runs List Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase font-semibold">
                  <th className="py-3 px-4">Run ID & Workflow</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Trigger</th>
                  <th className="py-3 px-4 hidden md:table-cell">Duration</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRuns.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No execution runs match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRuns.map((run) => (
                    <tr key={run.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <Link
                          href={`/runs/${run.id}`}
                          className="font-semibold text-slate-900 hover:text-primary-600 block"
                        >
                          {run.workflowName}
                        </Link>
                        <span className="font-mono text-[10px] text-slate-400">
                          {run.id}
                        </span>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(run.status)}</td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <Badge variant="muted" className="text-[10px] capitalize">
                          {run.triggerSource}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell text-slate-500">
                        {run.durationMs ? `${run.durationMs}ms` : "—"}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(run.startedAt).toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link href={`/runs/${run.id}`}>
                          <Button variant="outline" size="sm" className="h-7 text-xs px-2.5">
                            Inspect
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
