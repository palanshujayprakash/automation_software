"use client";

import * as React from "react";
import Link from "next/link";
import { Zap, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signupAction, type AuthState } from "@/app/auth/actions";

export default function SignupPage() {
  const [state, setState] = React.useState<AuthState>({});
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setState({});
    const formData = new FormData(e.currentTarget);
    try {
      const res = await signupAction(null, formData);
      if (res?.error) {
        setState(res);
        setIsLoading(false);
      }
    } catch {
      // In Next.js, redirect throws an error which handles navigation
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <CardTitle className="text-xl">Create your FlowPilot account</CardTitle>
          <CardDescription>
            Start orchestrating AI automations with verifiable security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Full Name
              </label>
              <Input
                name="fullName"
                type="text"
                placeholder="Alex Morgan"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Email address
              </label>
              <Input
                name="email"
                type="email"
                placeholder="alex@example.com"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Password
              </label>
              <Input
                name="password"
                type="password"
                placeholder="At least 8 characters"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-2"
              size="md"
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>

          <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500 border border-slate-100 flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Encrypted credentials with automated user tenant isolation.</span>
          </div>

          <div className="text-center text-xs text-slate-500 pt-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary-600 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
