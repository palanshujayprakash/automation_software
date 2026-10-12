import Link from "next/link";
import { GitFork, Sparkles, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function WorkflowsPage() {
  return (
    <div className="space-y-6">
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

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Input placeholder="Search workflows..." className="h-9" />
        </div>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Filter className="h-3.5 w-3.5 text-slate-500" />
          Filter
        </Button>
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600 mb-3">
            <GitFork className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">No workflows configured</h3>
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
    </div>
  );
}
