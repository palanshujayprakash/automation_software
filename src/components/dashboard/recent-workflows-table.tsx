import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Play, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Workflow } from "@/types";

export function RecentWorkflowsTable({
  workflows,
}: {
  workflows: Workflow[];
}) {
  const getStatusBadge = (status: Workflow["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "paused":
        return <Badge variant="warning">Paused</Badge>;
      case "error":
        return <Badge variant="error">Error</Badge>;
      case "draft":
      default:
        return <Badge variant="muted">Draft</Badge>;
    }
  };

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Workflows</CardTitle>
            <CardDescription>
              Pipelines managed and isolated under your account
            </CardDescription>
          </div>
          <Link href="/workflows">
            <Button variant="ghost" size="sm" className="text-xs">
              View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent>
          {workflows.length === 0 ? (
            /* Helpful empty state */
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-3">
                <Sparkles className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900">
                No workflows created yet
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
                Use the AI builder to propose your first pipeline connecting Google Calendar or Sheets.
              </p>
              <Link href="/workflows/new">
                <Button size="sm">
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Generate First Workflow
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 hidden sm:table-cell">Last Run</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {workflows.map((wf) => (
                    <tr key={wf.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 font-medium text-slate-900">
                        <Link
                          href={`/workflows/${wf.id}`}
                          className="hover:text-primary-600 hover:underline block"
                        >
                          {wf.name}
                        </Link>
                        <span className="text-[11px] text-slate-400 line-clamp-1">
                          {wf.description}
                        </span>
                      </td>
                      <td className="py-3">{getStatusBadge(wf.status)}</td>
                      <td className="py-3 hidden sm:table-cell text-slate-500">
                        {wf.lastRunAt ? (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-400" />
                            {new Date(wf.lastRunAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-slate-400">Never</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <Link href={`/workflows/${wf.id}`}>
                          <Button variant="outline" size="sm" className="h-7 text-xs px-2.5">
                            Inspect
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Row-Level Security Active
        </span>
        <span>Isolated Tenant Scope</span>
      </div>
    </Card>
  );
}
