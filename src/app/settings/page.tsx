import { User, Bell, Shield, Key, Database, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Account & System Settings
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your operator profile, notifications, and encryption preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary-600" />
              <CardTitle>Operator Profile</CardTitle>
            </div>
            <CardDescription>Personal details and account owner metadata</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Display Name</label>
              <Input defaultValue="Student Operator" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Email Address</label>
              <Input defaultValue="student@flowpilot.local" disabled />
            </div>
          </CardContent>
          <CardFooter className="pt-3">
            <Button size="sm">Update Profile</Button>
          </CardFooter>
        </Card>

        {/* Security & Token Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" />
              <CardTitle>Execution Safeguards</CardTitle>
            </div>
            <CardDescription>Configure automation approval thresholds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50">
              <div>
                <div className="font-semibold text-slate-800">Require Manual Run Approval</div>
                <div className="text-slate-500">Every pipeline write action prompts for confirmation</div>
              </div>
              <span className="font-mono text-xs font-semibold text-emerald-600">ACTIVE</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50">
              <div>
                <div className="font-semibold text-slate-800">Sanitize Error Stack Traces</div>
                <div className="text-slate-500">Strip tokens, secrets, and headers from run logs</div>
              </div>
              <span className="font-mono text-xs font-semibold text-emerald-600">ENFORCED</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
