"use client";

import * as React from "react";
import Link from "next/link";
import { Zap, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  loginAction,
  quickDemoSignInAction,
  type AuthState,
} from "@/app/auth/actions";

export default function LoginPage() {
  const [state, setState] = React.useState<AuthState>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDemoLoading, setIsDemoLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setState({});
    const formData = new FormData(e.currentTarget);
    try {
      const res = await loginAction(null, formData);
      if (res?.error) {
        setState(res);
        setIsLoading(false);
      }
    } catch {
      // In Next.js, redirect throws an error which handles navigation
    }
  };

  const handleDemoSignIn = async () => {
    setIsDemoLoading(true);
    try {
      await quickDemoSignInAction();
    } catch {
      // Handles Next.js redirect
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <CardTitle className="text-xl">Sign in to FlowPilot</CardTitle>
          <CardDescription>
            Access your secure AI workflows and connected integrations
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
                Email address
              </label>
              <Input
                name="email"
                type="email"
                placeholder="you@company.com"
                required
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-slate-700">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-primary-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-2"
              size="md"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Button */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400">Or Demo Access</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full text-xs font-semibold text-slate-700 hover:bg-slate-50"
            onClick={handleDemoSignIn}
            isLoading={isDemoLoading}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary-600" />
            Quick Demo Sign-In (Student Operator)
          </Button>

          <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500 border border-slate-100 flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Secured via Supabase Auth with Row-Level Security isolation.
            </span>
          </div>

          <div className="text-center text-xs text-slate-500 pt-2">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-primary-600 hover:underline"
            >
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
