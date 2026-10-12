"use client";

import * as React from "react";
import {
  User,
  Bell,
  Shield,
  Key,
  Database,
  Sliders,
  CheckCircle2,
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
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const [displayName, setDisplayName] = React.useState("Student Operator");
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [requireRunApproval, setRequireRunApproval] = React.useState(true);
  const [sanitizeLogs, setSanitizeLogs] = React.useState(true);
  const [savedNotice, setSavedNotice] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Account & System Settings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your operator profile, notifications, and execution safeguards
          </p>
        </div>
        {savedNotice && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg animate-in fade-in">
            <CheckCircle2 className="h-4 w-4" /> Preferences updated successfully
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Operator Profile Card */}
        <Card>
          <form onSubmit={handleSave}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary-600" />
                <CardTitle className="text-base">Operator Profile</CardTitle>
              </div>
              <CardDescription>
                Personal details and account owner metadata
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Display Name
                </label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Email Address
                </label>
                <Input defaultValue="student@flowpilot.local" disabled />
                <span className="text-[10px] text-slate-400">
                  Bound to verified authentication session
                </span>
              </div>
            </CardContent>
            <CardFooter className="pt-3 border-t border-slate-100 flex justify-end">
              <Button size="sm" type="submit">
                Save Profile
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Execution Safeguards Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-base">Execution Safeguards</CardTitle>
            </div>
            <CardDescription>
              Configure automation approval thresholds and telemetry safety
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 cursor-pointer">
              <div>
                <div className="font-semibold text-slate-800">
                  Require Run Approvals
                </div>
                <div className="text-slate-500 text-[11px]">
                  Every destructive write requires explicit confirmation
                </div>
              </div>
              <input
                type="checkbox"
                checked={requireRunApproval}
                onChange={(e) => setRequireRunApproval(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 cursor-pointer">
              <div>
                <div className="font-semibold text-slate-800">
                  Sanitize Error Stack Traces
                </div>
                <div className="text-slate-500 text-[11px]">
                  Strip tokens, passwords, and secret keys from logs
                </div>
              </div>
              <input
                type="checkbox"
                checked={sanitizeLogs}
                onChange={(e) => setSanitizeLogs(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary-600"
              />
            </label>
          </CardContent>
          <CardFooter className="pt-3 border-t border-slate-100 flex justify-end">
            <Button size="sm" onClick={handleSave}>
              Save Safeguards
            </Button>
          </CardFooter>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-sky-600" />
              <CardTitle className="text-base">Notifications</CardTitle>
            </div>
            <CardDescription>Execution failure and security alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 cursor-pointer">
              <div>
                <div className="font-semibold text-slate-800">
                  Execution Failure Alerts
                </div>
                <div className="text-slate-500 text-[11px]">
                  Receive notification upon repeated pipeline failure
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary-600"
              />
            </label>
          </CardContent>
        </Card>

        {/* Cryptography & Data Privacy */}
        <Card className="border-indigo-100 bg-indigo-50/20">
          <CardHeader>
            <div className="flex items-center gap-2 text-indigo-950">
              <Lock className="h-4 w-4 text-indigo-600" />
              <CardTitle className="text-base">Data Isolation & Cryptography</CardTitle>
            </div>
            <CardDescription>Storage encryption and tenant boundaries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between py-1 border-b border-indigo-100/60">
              <span>Token Encryption</span>
              <span className="font-semibold text-slate-800">AES-256-GCM (Authenticated)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-indigo-100/60">
              <span>Database Isolation</span>
              <span className="font-semibold text-slate-800">PostgreSQL Row-Level Security</span>
            </div>
            <div className="flex justify-between py-1 border-b border-indigo-100/60">
              <span>OAuth Grant Policy</span>
              <span className="font-semibold text-slate-800">Least-Privilege Scopes Only</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
