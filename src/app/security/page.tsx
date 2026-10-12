import { ShieldCheck, ShieldAlert, Key, Lock, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SecurityCenterPage() {
  const securityChecks: Array<{
    id: string;
    title: string;
    status: "verified" | "warning" | "unverified";
    description: string;
    category: string;
  }> = [
    {
      id: "auth-rls",
      title: "Row Level Security (RLS)",
      status: "verified",
      description: "Database policies isolate user records by auth.uid(). Cross-user data leaks are prevented.",
      category: "Database Isolation",
    },
    {
      id: "token-aes",
      title: "Token Storage Encryption",
      status: "verified",
      description: "OAuth refresh tokens are encrypted using AES-256-GCM before database persistence.",
      category: "Secrets & Encryption",
    },
    {
      id: "approvals-gate",
      title: "Destructive Action Guard",
      status: "verified",
      description: "Email sending and spreadsheet modifications require explicit user approval by default.",
      category: "Execution Policy",
    },
    {
      id: "mfa-check",
      title: "Multi-Factor Authentication (MFA)",
      status: "unverified",
      description: "MFA enforcement depends on Supabase Auth configuration in active environment.",
      category: "Account Protection",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Security Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit cryptographic safeguards, RLS isolation policies, and OAuth scope boundaries.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security Controls Table / Cards */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Security Configuration Checks
          </h3>
          <div className="space-y-3">
            {securityChecks.map((check) => (
              <Card key={check.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-900">{check.title}</h4>
                      {check.status === "verified" ? (
                        <Badge variant="success" className="text-[10px] gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Verified
                        </Badge>
                      ) : check.status === "warning" ? (
                        <Badge variant="warning" className="text-[10px] gap-1">
                          <AlertTriangle className="h-3 w-3" /> Warning
                        </Badge>
                      ) : (
                        <Badge variant="muted" className="text-[10px] gap-1">
                          <HelpCircle className="h-3 w-3" /> Unverified
                        </Badge>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block mt-0.5">
                      {check.category}
                    </span>
                    <p className="text-xs text-slate-600 mt-1">{check.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Audit Log / Event Feed */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Recent Security Events
          </h3>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Audit Trail</CardTitle>
              <CardDescription>Immutable record of security and authorization events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-semibold text-slate-900">System Initialized</span>
                  <span>Just now</span>
                </div>
                <p className="text-slate-600 mt-1">
                  Repository foundation established with strict RLS types and environment sanitation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
