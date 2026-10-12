import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Database Migration RLS Audit", () => {
  it("enforces Row-Level Security on every table in the initial migration", () => {
    const migrationPath = path.resolve(
      __dirname,
      "../../supabase/migrations/20261012000001_initial_schema.sql"
    );
    const content = fs.readFileSync(migrationPath, "utf-8");

    const requiredTables = [
      "profiles",
      "integrations",
      "workflows",
      "execution_runs",
      "approval_records",
      "audit_events",
    ];

    requiredTables.forEach((table) => {
      // Check table creation
      expect(content).toContain(`create table if not exists public.${table}`);

      // Check RLS enabled
      expect(content).toContain(
        `alter table public.${table} enable row level security;`
      );

      // Check policy exists
      expect(content).toContain(`on public.${table}`);
    });
  });
});
