import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Banner Skeleton */}
      <div className="h-32 rounded-xl bg-slate-200" />

      {/* Metrics Row Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-28">
            <CardHeader className="pb-2">
              <div className="h-3 w-24 bg-slate-200 rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-slate-200 rounded mb-2" />
              <div className="h-3 w-32 bg-slate-100 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 rounded-xl bg-slate-200" />
        <div className="h-96 rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}
