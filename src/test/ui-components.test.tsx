import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

describe("Base UI Components", () => {
  it("renders Button with proper variant and disabled state", () => {
    render(<Button disabled>Click Me</Button>);
    const btn = screen.getByRole("button", { name: /click me/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();
  });

  it("renders Badge with semantic variant classes", () => {
    render(<Badge variant="success">Completed</Badge>);
    const badge = screen.getByText(/completed/i);
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("text-emerald-700");
  });

  it("renders Card with title and content", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Healthy status</p>
        </CardContent>
      </Card>
    );
    expect(screen.getByText("System Overview")).toBeInTheDocument();
    expect(screen.getByText("Healthy status")).toBeInTheDocument();
  });

  it("renders Input with error message when provided", () => {
    render(<Input placeholder="Email" error="Invalid email address" />);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
  });
});
