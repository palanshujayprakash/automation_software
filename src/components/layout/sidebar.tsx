"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GitFork,
  Sparkles,
  Blocks,
  History,
  ShieldCheck,
  Settings,
  Plus,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Workflows", href: "/workflows", icon: GitFork },
  { name: "AI Builder", href: "/workflows/new", icon: Sparkles },
  { name: "Integrations", href: "/integrations", icon: Blocks },
  { name: "Run History", href: "/runs", icon: History },
  { name: "Security Center", href: "/security", icon: ShieldCheck },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 bg-white min-h-screen p-4 justify-between">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 px-3 py-2 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white shadow-sm">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-900 block leading-tight">
              FlowPilot
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              AI Automation SaaS
            </span>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="px-2 mb-6">
          <Link href="/workflows/new" className="w-full block">
            <Button className="w-full justify-center shadow-sm" size="md">
              <Plus className="h-4 w-4 mr-1.5" />
              Create workflow
            </Button>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1 px-2" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isActive ? "text-primary-600" : "text-slate-400"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Security Status Footnote */}
      <div className="px-3 py-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-medium text-slate-700 mb-0.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Security Guard Active</span>
        </div>
        <span>RLS & least-privilege mode</span>
      </div>
    </aside>
  );
}
