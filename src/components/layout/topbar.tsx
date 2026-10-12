"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Search,
  Menu,
  X,
  User,
  Zap,
  LayoutDashboard,
  GitFork,
  Sparkles,
  Blocks,
  History,
  ShieldCheck,
  Settings,
  Plus,
} from "lucide-react";
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

export function Topbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  // Close mobile drawer upon navigation
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard Overview";
    if (pathname?.startsWith("/workflows/new")) return "AI Workflow Builder";
    if (pathname?.startsWith("/workflows")) return "Workflows";
    if (pathname?.startsWith("/integrations")) return "Integration Manager";
    if (pathname?.startsWith("/runs")) return "Execution History";
    if (pathname?.startsWith("/security")) return "Security Center";
    if (pathname?.startsWith("/settings")) return "Settings";
    return "FlowPilot";
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 md:px-8 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right action group */}
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="search"
              placeholder="Search workflows, runs..."
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            className="relative h-9 w-9 text-slate-600 rounded-lg"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary-600 ring-2 ring-white" />
          </Button>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              <User className="h-4 w-4 text-slate-600" />
            </div>
            <div className="hidden md:block text-left text-xs">
              <div className="font-semibold text-slate-900">Operator</div>
              <div className="text-[11px] text-slate-500">Active Session</div>
            </div>
            <form action="/api/auth/signout" method="POST">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-slate-500 hover:text-red-600 ml-1"
                title="Sign out"
                type="submit"
              >
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white p-4 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
                    <Zap className="h-4 w-4 fill-current" />
                  </div>
                  <span className="font-bold text-slate-900">FlowPilot</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4">
                <Link href="/workflows/new" className="w-full block">
                  <Button className="w-full justify-center" size="sm">
                    <Plus className="h-4 w-4 mr-1.5" />
                    Create workflow
                  </Button>
                </Link>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? "bg-primary-50 text-primary-700 font-semibold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="text-xs text-slate-400 border-t border-slate-100 pt-3">
              FlowPilot SaaS • Antigravity
            </div>
          </div>
        </div>
      )}
    </>
  );
}
