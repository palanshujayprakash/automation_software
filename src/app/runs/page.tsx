import Link from "next/link";
import { History, Filter, Search, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function RunsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Execution History
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit logs and execution timelines for all automated and manual pipeline runs
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Input placeholder="Filter by workflow or run ID..." className="h-9" />
        </div>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Filter className="h-3.5 w-3.5 text-slate-500" />
          Status Filter
        </Button>
      </div>

      <Card>
        <CardContent className="p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 mb-3">
            <History className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">No execution runs recorded</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Runs are triggered manually or via approved background automation. All execution steps and sanitized outputs will be tracked here.
          </p>
          <Link href="/workflows/new">
            <Button size="sm">Create & Test a Workflow</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
