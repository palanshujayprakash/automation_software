import { describe, it, expect, vi } from "vitest";
import { LoginSchema, SignupSchema } from "@/lib/validations/auth";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";

describe("Module 2: Authentication & RLS Security Gate", () => {
  describe("Input Validation Schemas", () => {
    it("validates legitimate login credentials", () => {
      const result = LoginSchema.safeParse({
        email: "alex@example.com",
        password: "securepassword123",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid emails and short passwords", () => {
      const invalidEmail = LoginSchema.safeParse({
        email: "not-an-email",
        password: "12345678",
      });
      expect(invalidEmail.success).toBe(false);

      const shortPassword = LoginSchema.safeParse({
        email: "alex@example.com",
        password: "123",
      });
      expect(shortPassword.success).toBe(false);
    });

    it("enforces strong signup requirements", () => {
      const validSignup = SignupSchema.safeParse({
        fullName: "Alex Morgan",
        email: "alex@example.com",
        password: "strongpassword2026",
      });
      expect(validSignup.success).toBe(true);

      const shortName = SignupSchema.safeParse({
        fullName: "A",
        email: "alex@example.com",
        password: "strongpassword2026",
      });
      expect(shortName.success).toBe(false);
    });
  });

  describe("Middleware Route Protection & Redirection", () => {
    it("redirects unauthenticated requests from /dashboard to /login", async () => {
      const req = new NextRequest("http://localhost:3000/dashboard");
      const res = await middleware(req);
      expect(res.status).toBe(307); // Next.js redirect
      expect(res.headers.get("location")).toContain("/login?returnUrl=%2Fdashboard");
    });

    it("redirects unauthenticated requests from /workflows to /login", async () => {
      const req = new NextRequest("http://localhost:3000/workflows");
      const res = await middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/login?returnUrl=%2Fworkflows");
    });

    it("redirects authenticated requests from /login to /dashboard", async () => {
      const req = new NextRequest("http://localhost:3000/login", {
        headers: {
          cookie: "flowpilot_demo_session=test-session",
        },
      });
      const res = await middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/dashboard");
    });

    it("allows public access to /login when unauthenticated", async () => {
      const req = new NextRequest("http://localhost:3000/login");
      const res = await middleware(req);
      expect(res.status).toBe(200);
    });
  });
});
