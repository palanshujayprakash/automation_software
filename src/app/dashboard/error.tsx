"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sanitized error logging
    console.error("Dashboard render error:", error.message);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-4">
      <Card className="max-w-md w-full border-red-200">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <AlertCircle className="h-5 w-5" />
          </div>
          <CardTitle className="text-base text-red-900">
            Failed to Load Dashboard Data
          </CardTitle>
          <CardDescription>
            An error occurred while querying workflow metrics.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-xs text-slate-500 font-mono bg-slate-50 p-2.5 rounded border border-slate-200 break-all">
            {error.message || "An unexpected error occurred"}
          </p>
          <Button onClick={() => reset()} size="sm" className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
