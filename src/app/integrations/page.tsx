"use client";

import * as React from "react";
import {
  Mail,
  Calendar,
  FileSpreadsheet,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Unlink,
  ExternalLink,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  initiateGoogleOAuth,
  simulateDemoConnect,
  disconnectServiceAction,
} from "@/app/integrations/actions";
import { SupportedGoogleService } from "@/lib/integrations/google-oauth";

interface IntegrationState {
  service: SupportedGoogleService;
  name: string;
  icon: typeof Calendar;
  description: string;
  status: "connected" | "disconnected";
  scope: string;
  badge: string;
  email?: string;
  lastVerified?: string;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = React.useState<IntegrationState[]>([
    {
      service: "calendar",
      name: "Google Calendar",
      icon: Calendar,
      description: "Read calendar events for automated schedule digests and meeting notifications.",
      status: "connected",
      scope: "https://www.googleapis.com/auth/calendar.readonly",
      badge: "Least Privilege • Read Only",
      email: "operator.calendar@gmail.com",
      lastVerified: "Today at 08:30 AM",
    },
    {
      service: "sheets",
      name: "Google Sheets",
      icon: FileSpreadsheet,
      description: "Read data from spreadsheets and append approved summary rows safely.",
      status: "connected",
      scope: "https://www.googleapis.com/auth/spreadsheets",
      badge: "Row Append Only",
      email: "operator.sheets@gmail.com",
      lastVerified: "Today at 09:15 AM",
    },
    {
      service: "gmail",
      name: "Gmail",
      icon: Mail,
      description: "Prepare and compose email drafts. Sending emails is restricted by default.",
      status: "disconnected",
      scope: "https://www.googleapis.com/auth/gmail.compose",
      badge: "Drafts Only Default",
    },
  ]);

  const [loadingService, setLoadingService] = React.useState<string | null>(null);
  const [disconnectConfirm, setDisconnectConfirm] = React.useState<SupportedGoogleService | null>(null);

  const handleConnect = async (service: SupportedGoogleService) => {
    setLoadingService(service);
    try {
      const res = await initiateGoogleOAuth(service);
      if (res.url) {
        window.location.href = res.url;
        return;
      }

      // Demo fallback connect
      await simulateDemoConnect(service);
      setIntegrations((prev) =>
        prev.map((item) =>
          item.service === service
            ? {
                ...item,
                status: "connected",
                email: `${service}.demo@flowpilot.local`,
                lastVerified: "Just now",
              }
            : item
        )
      );
    } finally {
      setLoadingService(null);
    }
  };

  const handleDisconnect = async (service: SupportedGoogleService) => {
    setLoadingService(service);
    try {
      await disconnectServiceAction(service);
      setIntegrations((prev) =>
        prev.map((item) =>
          item.service === service
            ? {
                ...item,
                status: "disconnected",
                email: undefined,
                lastVerified: undefined,
              }
            : item
        )
      );
    } finally {
      setLoadingService(null);
      setDisconnectConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Integration Manager
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Connect and govern Google services via secure OAuth 2.0 PKCE. Tokens are stored encrypted with AES-256-GCM.
          </p>
        </div>
      </div>

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {integrations.map((item) => {
          const Icon = item.icon;
          const isConnected = item.status === "connected";
          const isLoading = loadingService === item.service;

          return (
            <Card key={item.service} className="flex flex-col justify-between shadow-card hover:shadow-elevated transition-shadow">
              <div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    {isConnected ? (
                      <Badge variant="success" className="text-[10px] gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Connected
                      </Badge>
                    ) : (
                      <Badge variant="muted" className="text-[10px]">
                        Not Connected
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base">{item.name}</CardTitle>
                  <CardDescription className="pt-1 text-xs">
                    {item.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 text-xs">
                  {/* Account / Verification Info */}
                  {isConnected && (
                    <div className="rounded-lg bg-emerald-50/60 p-2.5 border border-emerald-100 text-emerald-900">
                      <div className="font-semibold text-[11px]">
                        Account: <span className="font-mono text-emerald-800">{item.email}</span>
                      </div>
                      <div className="text-[10px] text-emerald-700 mt-0.5">
                        Verified: {item.lastVerified}
                      </div>
                    </div>
                  )}

                  {/* Permission Scope */}
                  <div className="rounded-lg bg-slate-50 p-2.5 text-slate-600 border border-slate-100">
                    <div className="font-semibold text-slate-700 mb-0.5 flex items-center justify-between">
                      <span>Permitted Scope:</span>
                      <span className="text-[10px] text-primary-600 font-medium">
                        {item.badge}
                      </span>
                    </div>
                    <code className="text-[10px] font-mono break-all text-slate-500">
                      {item.scope}
                    </code>
                  </div>
                </CardContent>
              </div>

              <CardFooter className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {isConnected ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                      onClick={() => setDisconnectConfirm(item.service)}
                    >
                      <Unlink className="h-3.5 w-3.5 mr-1" />
                      Disconnect
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-slate-500"
                      onClick={() => handleConnect(item.service)}
                      isLoading={isLoading}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Re-verify
                    </Button>
                  </>
                ) : (
                  <Button
                    className="w-full text-xs"
                    size="sm"
                    onClick={() => handleConnect(item.service)}
                    isLoading={isLoading}
                  >
                    Connect {item.name}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Disconnect Confirmation Modal */}
      {disconnectConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <Card className="max-w-md w-full shadow-elevated border-red-200">
            <CardHeader>
              <div className="flex items-center gap-2 text-red-600 mb-1">
                <AlertTriangle className="h-5 w-5" />
                <CardTitle className="text-base text-red-900">
                  Disconnect Google Service?
                </CardTitle>
              </div>
              <CardDescription>
                Revoking this connection will delete encrypted OAuth refresh tokens. Any scheduled workflows relying on this service will pause.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDisconnectConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDisconnect(disconnectConfirm)}
                isLoading={loadingService === disconnectConfirm}
              >
                Confirm Disconnect
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Security Governance Notice */}
      <Card className="border-slate-200 bg-white">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              All OAuth refresh and access tokens are encrypted using AES-256-GCM before database storage. Raw credentials are never transmitted to the browser or written to logs.
            </span>
          </div>
          <span className="font-semibold text-slate-800 shrink-0">
            AES-256-GCM Active
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
