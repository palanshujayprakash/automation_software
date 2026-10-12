import * as React from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Key,
  Lock,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Unlink,
  Clock,
  UserCheck,
  FileText,
  AlertCircle,
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
import { requireUser } from "@/lib/auth/session";
import { getSecurityCenterData } from "@/lib/security/checks";
import { revokeIntegrationTokenAction } from "@/app/security/actions";

export default async function SecurityCenterPage() {
  const user = await requireUser();
  const data = await getSecurityCenterData(user.id, user.isDemoUser);

  return (
    <div className="space-y-8">
      {/* Page Title & Philosophy Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            Security Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographic safeguards, Row-Level Security tenant isolation, and Google OAuth permission audit.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs gap-1.5 py-1 px-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Zero Inferred Scores • Evidence-Based Only
          </Badge>
        </div>
      </div>

      {/* Section 1: Security Configuration Checks Grid */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          Security Configuration Checks
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.checks.map((check) => (
            <Card key={check.id} className="flex flex-col justify-between shadow-card">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-semibold text-slate-900">
                    {check.title}
                  </CardTitle>
                  {check.status === "verified" ? (
                    <Badge variant="success" className="text-[10px] shrink-0 gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Verified
                    </Badge>
                  ) : check.status === "warning" ? (
                    <Badge variant="warning" className="text-[10px] shrink-0 gap-1">
                      <AlertTriangle className="h-3 w-3" /> Warning
                    </Badge>
                  ) : (
                    <Badge variant="muted" className="text-[10px] shrink-0 gap-1">
                      <HelpCircle className="h-3 w-3" /> Unverified
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-[11px] uppercase tracking-wider font-mono text-slate-400">
                  {check.category}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 space-y-2">
                <p>{check.description}</p>
                {check.remediation && (
                  <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                    <strong>Remediation:</strong> {check.remediation}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Section 2: Connected Integration Inventory & Revocation Controls */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          Connected Integration Inventory & Revocation
        </h3>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase font-semibold">
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Permitted Scope</th>
                    <th className="py-3 px-4">Storage Security</th>
                    <th className="py-3 px-4 text-right">Revocation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {data.connectedIntegrations.map((item) => (
                    <tr key={item.service} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {item.name}
                      </td>
                      <td className="py-3 px-4">
                        {item.status === "connected" ? (
                          <Badge variant="success" className="text-[10px]">
                            Connected
                          </Badge>
                        ) : (
                          <Badge variant="muted" className="text-[10px]">
                            Disconnected
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {item.scope}
                      </td>
                      <td className="py-3 px-4">
                        {item.encrypted ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                            <Lock className="h-3 w-3 text-emerald-600" /> AES-256-GCM
                          </span>
                        ) : (
                          <span className="text-slate-400">Not stored</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {item.status === "connected" ? (
                          <form
                            action={async () => {
                              "use server";
                              await revokeIntegrationTokenAction(item.service);
                            }}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                              type="submit"
                            >
                              <Unlink className="h-3 w-3 mr-1" />
                              Revoke Token
                            </Button>
                          </form>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 3: Audit Trail & Workflow Approval History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Security Events */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-slate-400" />
            Recent Security Events
          </h3>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Audit Trail</CardTitle>
              <CardDescription>
                Immutable record of authentication, approvals, and token events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.auditEvents.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  No security events recorded.
                </p>
              ) : (
                data.auditEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 text-xs"
                  >
                    <div className="flex items-center justify-between text-slate-500 mb-0.5">
                      <span className="font-mono text-[11px] font-semibold text-slate-800">
                        {event.eventType}
                      </span>
                      <span className="text-[10px]">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-slate-600">{event.description}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Workflow Approval Records */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-1.5">
            <UserCheck className="h-4 w-4 text-slate-400" />
            Workflow Approval Records
          </h3>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Human Review History</CardTitle>
              <CardDescription>
                Proof of operator confirmation for AI proposals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.approvalsHistory.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  No approval records logged yet.
                </p>
              ) : (
                data.approvalsHistory.map((appr) => (
                  <div
                    key={appr.id}
                    className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">
                        {appr.workflowName}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Approved by {appr.approver} • {new Date(appr.approvedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant="success" className="text-[10px]">
                      Approved
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
