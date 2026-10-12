import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { getDashboardData } from "@/lib/db/metrics";
import { MetricsGrid } from "@/components/dashboard/metrics-grid";
import { RecentWorkflowsTable } from "@/components/dashboard/recent-workflows-table";
import { Workflow } from "@/types";

describe("Module 3: Dashboard UI & Real Metrics", () => {
  describe("Metrics Calculation Logic", () => {
    it("returns correct demo prototype data when demo user is provided", async () => {
      const data = await getDashboardData("test-user-id", true);
      expect(data.isDemoMode).toBe(true);
      expect(data.metrics.totalWorkflows).toBe(3);
      expect(data.metrics.successfulRuns).toBe(14);
      expect(data.metrics.failedRuns).toBe(1);
      expect(data.recentWorkflows.length).toBe(3);
      expect(data.recentRuns.length).toBe(3);
      expect(data.integrations.length).toBe(3);
    });

    it("returns zero metrics and empty workflows when database is unpopulated", async () => {
      const data = await getDashboardData("nonexistent-user-id", false);
      expect(data.isDemoMode).toBe(false);
      expect(data.metrics.totalWorkflows).toBe(0);
      expect(data.metrics.successfulRuns).toBe(0);
      expect(data.metrics.failedRuns).toBe(0);
      expect(data.recentWorkflows.length).toBe(0);
    });
  });

  describe("UI Component Rendering", () => {
    it("renders MetricsGrid with appropriate metric values", () => {
      render(
        <MetricsGrid
          metrics={{
            totalWorkflows: 8,
            activeWorkflows: 5,
            successfulRuns: 42,
            failedRuns: 2,
            pendingApprovals: 1,
            connectedIntegrationsCount: 3,
          }}
        />
      );

      expect(screen.getByText("8")).toBeInTheDocument();
      expect(screen.getByText("42")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3 / 3")).toBeInTheDocument();
    });

    it("renders empty state in RecentWorkflowsTable when no workflows exist", () => {
      render(<RecentWorkflowsTable workflows={[]} />);
      expect(
        screen.getByText(/no workflows created yet/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /generate first workflow/i })
      ).toBeInTheDocument();
    });

    it("renders workflows and status badges in RecentWorkflowsTable when workflows exist", () => {
      const sampleWorkflows: Workflow[] = [
        {
          id: "wf-1",
          userId: "user-1",
          name: "Invoice Processing Pipeline",
          description: "Extract invoices and add to sheets",
          status: "active",
          steps: [],
          isApproved: true,
          requiresApprovalForRuns: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      render(<RecentWorkflowsTable workflows={sampleWorkflows} />);
      expect(screen.getByText("Invoice Processing Pipeline")).toBeInTheDocument();
      expect(screen.getByText("Active")).toBeInTheDocument();
    });
  });
});
