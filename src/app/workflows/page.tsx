import Link from "next/link";
import {
  GitFork,
  Sparkles,
  Plus,
  Search,
  Filter,
  Play,
  Clock,
  ArrowRight,
  ShieldCheck,
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
import { requireUser } from "@/lib/auth/session";
import { getUserWorkflows } from "@/lib/db/workflows";
import { Workflow } from "@/types";

export default async function WorkflowsPage() {
  const user = await requireUser();
  let workflows = await getUserWorkflows(user.id);

  // If in local evaluation / demo mode, provide sample workflows
  if (workflows.length === 0 && user.isDemoUser) {
    workflows = [
      {
        id: "demo-wf-1",
        userId: user.id,
        name: "Daily Calendar Summary to Sheets",
        description: "Extracts morning schedule and appends meeting agenda to spreadsheets.",
        status: "active",
        steps: [],
        isApproved: true,
        requiresApprovalForRuns: true,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        lastRunAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: "demo-wf-2",
        userId: user.id,
        name: "Spreadsheet Row to Gmail Draft",
        description: "Prepares a review email draft in Gmail when client rows change.",
        status: "active",
        steps: [],
        isApproved: true,
        requiresApprovalForRuns: true,
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        lastRunAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "demo-wf-3",
        userId: user.id,
        name: "Weekly Schedule Audit",
        description: "Runs on Fridays to log all calendar commitments.",
        status: "draft",
        steps: [],
        isApproved: false,
        requiresApprovalForRuns: true,
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ];
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Workflows
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your AI-assisted pipelines, schedules, and active execution policies
          </p>
        </div>
        <Link href="/workflows/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            Create workflow
          </Button>
        </Link>
      </div>

      {/* Workflows List Grid */}
      {workflows.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600 mb-3">
              <GitFork className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              No workflows configured
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Use the natural language AI builder to create your first workflow with registered Google integrations.
            </p>
            <Link href="/workflows/new">
              <Button size="sm">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Build with AI
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflows.map((wf) => (
            <Card
              key={wf.id}
              className="flex flex-col justify-between shadow-card hover:shadow-elevated transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                    <GitFork className="h-4 w-4" />
                  </div>
                  {wf.status === "active" ? (
                    <Badge variant="success" className="text-[10px]">
                      Active
                    </Badge>
                  ) : wf.status === "paused" ? (
                    <Badge variant="warning" className="text-[10px]">
                      Paused
                    </Badge>
                  ) : (
                    <Badge variant="muted" className="text-[10px]">
                      Draft
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-sm">
                  <Link
                    href={`/workflows/${wf.id}`}
                    className="hover:text-primary-600 hover:underline"
                  >
                    {wf.name}
                  </Link>
                </CardTitle>
                <CardDescription className="text-xs line-clamp-2 mt-1">
                  {wf.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-2 text-xs text-slate-500 border-t border-slate-100 pt-3">
                <div className="flex justify-between items-center text-[11px]">
                  <span>Last run:</span>
                  <span className="font-medium text-slate-700">
                    {wf.lastRunAt
                      ? new Date(wf.lastRunAt).toLocaleDateString()
                      : "Never"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span>Approval status:</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    {wf.isApproved ? "Approved" : "Pending Approval"}
                  </span>
                </div>
              </CardContent>

              <div className="p-3 bg-slate-50/70 border-t border-slate-100 rounded-b-xl flex items-center justify-between gap-2">
                <Link href={`/workflows/${wf.id}`} className="w-full">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Inspect & Configure
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
