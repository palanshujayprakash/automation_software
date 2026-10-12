import Link from "next/link";
import { Sparkles, ShieldCheck, Database, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/db/metrics";
import { MetricsGrid } from "@/components/dashboard/metrics-grid";
import { RecentWorkflowsTable } from "@/components/dashboard/recent-workflows-table";
import { RecentActivityFeed } from "@/components/dashboard/recent-activity-feed";
import { IntegrationsSummary } from "@/components/dashboard/integrations-summary";
import { Badge } from "@/components/ui/badge";

export default async function DashboardOverviewPage() {
  const user = await requireUser();
  const data = await getDashboardData(user.id, user.isDemoUser);

  return (
    <div className="space-y-8">
      {/* Welcome & Context Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-gradient-to-r from-primary-900 to-indigo-950 p-6 text-white shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-0.5 text-xs font-medium text-primary-200">
              <Sparkles className="h-3 w-3 text-primary-300" />
              Welcome back, {user.fullName || "Operator"}
            </span>
            {data.isDemoMode ? (
              <Badge variant="warning" className="text-[10px] bg-amber-500/20 text-amber-200 border-amber-400/30">
                Sample Prototype Data
              </Badge>
            ) : (
              <Badge variant="success" className="text-[10px] bg-emerald-500/20 text-emerald-200 border-emerald-400/30">
                Live Supabase Verified
              </Badge>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            FlowPilot Automation Center
          </h2>
          <p className="text-sm text-indigo-200 mt-1 max-w-xl">
            Orchestrate AI workflows, inspect execution metrics, and enforce least-privilege security controls across your tools.
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

      {/* Real / Prototype Metrics Notice */}
      {data.isDemoMode && (
        <div className="flex items-center gap-2.5 rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-800">
          <Info className="h-4 w-4 shrink-0 text-amber-600" />
          <span>
            <strong>Evaluation Mode:</strong> Metrics and records below are illustrative sample data for local review per stitch.md specs. Real database metrics will populate automatically when connected to a live Supabase instance.
          </span>
        </div>
      )}

      {/* Metrics Row */}
      <MetricsGrid metrics={data.metrics} />

      {/* Main Grid: Workflows Table & Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Workflows Table (2 Cols on lg) */}
        <div className="lg:col-span-2 space-y-6">
          <RecentWorkflowsTable workflows={data.recentWorkflows} />
          <RecentActivityFeed runs={data.recentRuns} />
        </div>

        {/* Right Column: Integrations & Governance Card (1 Col) */}
        <div className="space-y-6">
          <IntegrationsSummary integrations={data.integrations} />

          {/* Security Guard Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
            <div className="flex items-center gap-2 text-slate-900 mb-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-semibold">Governance & Safeguards</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              All automation runs execute with tenant isolation. Destructive actions like email dispatch and sheet row deletion require manual review.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span className="text-[11px] font-medium text-slate-500">Security Center Status</span>
              <span className="font-semibold text-emerald-600">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
