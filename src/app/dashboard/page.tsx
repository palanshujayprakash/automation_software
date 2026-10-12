import Link from "next/link";
import {
  GitFork,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Blocks,
  Play,
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

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-gradient-to-r from-primary-900 to-indigo-950 p-6 text-white shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-0.5 text-xs font-medium text-primary-200 mb-2">
            <Sparkles className="h-3 w-3 text-primary-300" /> Module 1 Foundation Active
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Welcome to FlowPilot
          </h2>
          <p className="text-sm text-indigo-200 mt-1 max-w-xl">
            Design AI-assisted automations, connect Google workspace tools, and inspect real-time execution safety and audit records.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/workflows/new">
            <Button className="bg-white text-primary-900 hover:bg-slate-100 font-semibold shadow-sm">
              <Sparkles className="h-4 w-4 mr-2 text-primary-600" />
              Build with AI
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Workflows
            </CardTitle>
            <GitFork className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0</div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span>Ready for creation</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Successful Runs
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">0</div>
            <p className="text-xs text-slate-500 mt-1">
              Zero errors recorded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Failed Runs
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0</div>
            <p className="text-xs text-slate-500 mt-1">
              Sanitized error logging active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Connected Services
            </CardTitle>
            <Blocks className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0 / 3</div>
            <p className="text-xs text-slate-500 mt-1">
              Gmail, Calendar, Sheets
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Workflows Table & Integration Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Workflows (2 Columns) */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Workflows</CardTitle>
                  <CardDescription>
                    All workflows created and governed by your account
                  </CardDescription>
                </div>
                <Link href="/workflows">
                  <Button variant="ghost" size="sm" className="text-xs">
                    View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              </CardHeader>

              <CardContent>
                {/* Empty State */}
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-3">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    No workflows created yet
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
                    Prompt the AI builder to construct your first automated pipeline with verified Gmail and Google Calendar actions.
                  </p>
                  <Link href="/workflows/new">
                    <Button size="sm">
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                      Generate First Workflow
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Database RLS Enforcement Ready
              </span>
              <span>Module 1 Baseline</span>
            </div>
          </Card>
        </div>

        {/* Integration Status & Security Overview (1 Column) */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrations Status</CardTitle>
              <CardDescription>Google OAuth services connection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Google Calendar", service: "calendar", status: "disconnected" },
                { name: "Google Sheets", service: "sheets", status: "disconnected" },
                { name: "Gmail", service: "gmail", status: "disconnected" },
              ].map((item) => (
                <div
                  key={item.service}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50"
                >
                  <div className="flex items-center gap-2.5">
                    <Blocks className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-medium text-slate-700">
                      {item.name}
                    </span>
                  </div>
                  <Badge variant="muted" className="text-[10px]">
                    Not Connected
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50/40">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-amber-800">
                <ShieldAlert className="h-4 w-4" />
                <CardTitle className="text-xs uppercase tracking-wider text-amber-900">
                  Security Guard
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-amber-800 leading-relaxed">
                Tokens are stored encrypted with AES-256. Destructive actions require user approval before execution.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
