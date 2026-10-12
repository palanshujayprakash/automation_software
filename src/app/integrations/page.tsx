import { Mail, Calendar, FileSpreadsheet, ShieldCheck, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function IntegrationsPage() {
  const integrations = [
    {
      name: "Google Calendar",
      service: "calendar",
      icon: Calendar,
      description: "Read calendar events for automated daily scheduling and time audits.",
      status: "disconnected",
      scope: "https://www.googleapis.com/auth/calendar.readonly",
      badge: "Least Privilege",
    },
    {
      name: "Google Sheets",
      service: "sheets",
      icon: FileSpreadsheet,
      description: "Read data from spreadsheets and append approved records safely.",
      status: "disconnected",
      scope: "https://www.googleapis.com/auth/spreadsheets",
      badge: "Row Append Only",
    },
    {
      name: "Gmail",
      service: "gmail",
      icon: Mail,
      description: "Prepare and create email drafts. Sending emails requires explicit user approval.",
      status: "disconnected",
      scope: "https://www.googleapis.com/auth/gmail.compose",
      badge: "Drafts Only Default",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Integration Manager
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Connect and govern Google services via secure OAuth 2.0 PKCE. Tokens are stored encrypted with AES-256.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {integrations.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.service} className="flex flex-col justify-between">
              <div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="muted">Not Connected</Badge>
                  </div>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription className="pt-1">{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="rounded-lg bg-slate-50 p-2.5 text-slate-600 border border-slate-100">
                    <div className="font-semibold text-slate-700 mb-0.5">Permitted Scope:</div>
                    <code className="text-[11px] font-mono break-all text-slate-500">{item.scope}</code>
                  </div>
                </CardContent>
              </div>

              <CardFooter className="pt-3">
                <Button className="w-full" size="sm" variant="outline">
                  Connect {item.name}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Card className="border-slate-200 bg-white">
        <CardContent className="p-4 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Zero raw access tokens or refresh tokens are ever exposed to the client interface or logs.</span>
          </div>
          <span className="font-semibold text-slate-700">AES-256 Encryption Active</span>
        </CardContent>
      </Card>
    </div>
  );
}
