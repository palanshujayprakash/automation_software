import * as React from "react";
import Link from "next/link";
import { Mail, Calendar, FileSpreadsheet, ArrowRight, Blocks } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface IntegrationSummaryItem {
  service: "gmail" | "calendar" | "sheets";
  name: string;
  status: "connected" | "disconnected" | "error";
}

export function IntegrationsSummary({
  integrations,
}: {
  integrations: IntegrationSummaryItem[];
}) {
  const getIcon = (service: IntegrationSummaryItem["service"]) => {
    switch (service) {
      case "gmail":
        return <Mail className="h-4 w-4 text-rose-500" />;
      case "calendar":
        return <Calendar className="h-4 w-4 text-sky-500" />;
      case "sheets":
        return <FileSpreadsheet className="h-4 w-4 text-emerald-500" />;
      default:
        return <Blocks className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle>Connected Services</CardTitle>
          <CardDescription>Google OAuth integrations</CardDescription>
        </div>
        <Link href="/integrations">
          <Button variant="ghost" size="sm" className="text-xs">
            Manage <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {integrations.map((item) => (
          <div
            key={item.service}
            className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/70 text-xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-xs border border-slate-200">
                {getIcon(item.service)}
              </div>
              <span className="font-medium text-slate-700">{item.name}</span>
            </div>
            {item.status === "connected" ? (
              <Badge variant="success" className="text-[10px]">
                Connected
              </Badge>
            ) : item.status === "error" ? (
              <Badge variant="error" className="text-[10px]">
                Attention
              </Badge>
            ) : (
              <Badge variant="muted" className="text-[10px]">
                Disconnected
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
