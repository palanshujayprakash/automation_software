"use client";

import Link from "next/link";
import { Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
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
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Email address</label>
              <Input type="email" placeholder="you@company.com" required />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-slate-700">Password</label>
                <a href="#" className="text-xs text-primary-600 hover:underline">Forgot password?</a>
              </div>
              <Input type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full mt-2" size="md">
              Sign In
            </Button>
          </form>

          <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500 border border-slate-100 flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Secured via Supabase Auth with Row-Level Security isolation.</span>
          </div>

          <div className="text-center text-xs text-slate-500 pt-2">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-primary-600 hover:underline">
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
