# FlowPilot — AI Automation Dashboard SaaS

FlowPilot is a secure, modern AI Automation Dashboard SaaS built with **Next.js 15 App Router**, **React 19**, **TypeScript (Strict Mode)**, **Tailwind CSS**, and **Supabase (PostgreSQL with Row-Level Security)**.

It empowers operators to build natural-language workflows, connect Google workspace services (Calendar, Sheets, Gmail), execute approved pipelines with step-level telemetry, and inspect cryptographic safeguards and audit trails.

---

## 🏛️ Architecture Overview

FlowPilot follows a strict separation of concerns designed for production resilience and code review:

```
src/
├── app/                      # Next.js App Router (16 routes + API handlers)
│   ├── (auth)/               # /login, /signup
│   ├── dashboard/            # Screen 1: Dashboard overview & metrics
│   ├── workflows/            # Screen 2 & 3: Workflows list, builder (/new), details (/[id])
│   ├── integrations/         # Screen 4: Google OAuth manager
│   ├── runs/                 # Screen 5: Execution history and step details (/[id])
│   ├── security/             # Screen 6: Evidence-based Security Center
│   ├── settings/             # Screen 7: Preferences and execution safeguards
│   ├── api/                  # Server route handlers (/api/workflows/generate, /api/auth/...)
│   └── globals.css           # Design tokens matching stitch.md specifications
├── components/
│   ├── ui/                   # Reusable UI primitives (Button, Card, Badge, Input)
│   ├── layout/               # Desktop Sidebar, Mobile Drawer, Topbar Shell
│   └── dashboard/            # MetricsGrid, RecentWorkflowsTable, ActivityFeed, IntegrationsSummary
├── lib/
│   ├── ai/                   # Workflow proposal generator & scope detector
│   ├── auth/                 # Server-side session verification & anti-IDOR helpers
│   ├── crypto/               # AES-256-GCM token encryption and tamper protection
│   ├── db/                   # Workflows and metrics data access layer
│   ├── execution/            # Core runner, bounded retries, and registered action handlers
│   ├── integrations/         # Google OAuth 2.0 PKCE and CSRF state HMAC generator
│   ├── supabase/             # Browser, Server (SSR cookies), and Server-Only Admin clients
│   └── validations/          # Zod schemas for auth and workflow definitions
├── test/                     # 10 comprehensive Vitest test suites (43 tests)
└── types/                    # Strict domain types
```

---

## 🛡️ Security Design (Defense in Depth)

1. **Row-Level Security (RLS) Isolation:**
   - Every database table (`profiles`, `integrations`, `workflows`, `execution_runs`, `approval_records`, `audit_events`) has RLS enabled.
   - Policies strictly enforce `auth.uid() = user_id`, preventing cross-tenant data leakage.

2. **Insecure Direct Object Reference (IDOR) Prevention:**
   - User identity is derived strictly from the server-verified session (`getCurrentUser()`), never from client query parameters or request bodies.

3. **AES-256-GCM Token Encryption at Rest:**
   - Google OAuth refresh and access tokens are encrypted using authenticated `aes-256-gcm`.
   - Modifying ciphertext or the authentication tag (`authTag`) immediately throws a decryption error.
   - Plaintext tokens are never exposed to browser components, logs, or error responses.

4. **Prohibition of Untrusted Code Execution:**
   - The AI builder generates structured workflows validated with versioned Zod schemas (`WorkflowDefinitionSchema`).
   - Only pre-registered safe action handlers are executed. Raw shell commands, arbitrary SQL, and dynamic code execution are forbidden.

5. **Human-in-the-Loop Approval Gate:**
   - AI outputs are treated strictly as proposals.
   - Destructive actions (like direct email dispatch) require explicit operator review and confirmation.

6. **Evidence-Based Security Center:**
   - No fabricated scores or arbitrary percentages.
   - Every control reflects a genuine check (`verified`, `warning`, or `unverified`).

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v20+ or v24+
- **npm**: v10+ or v11+

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Copy the template configuration:
```bash
cp .env.example .env.local
```
*(FlowPilot includes built-in offline evaluation fallbacks, allowing local review and testing without external cloud credentials).*

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

- To evaluate immediately, click **"Quick Demo Sign-In (Student Operator)"** on the login screen.

---

## 🧪 Testing & Verification Gates

Run the automated test suites:
```bash
# Run Vitest test suite (10 test files, 43 tests)
npm test

# Run TypeScript strict type-check
npm run typecheck

# Run Next.js production build verification
npm run build
```

---

## 🎓 BCA Interview & Viva Questions Guide

**Q1: How does FlowPilot protect user data against unauthorized access?**  
*Answer:* FlowPilot enforces a two-tier security model: (1) At the database layer, Supabase PostgreSQL Row-Level Security (RLS) policies isolate every record by `auth.uid() = user_id`. (2) At the application layer, all API endpoints and server actions extract the user ID directly from the validated session cookie, completely preventing Insecure Direct Object References (IDOR).

**Q2: How does the AI Workflow Builder prevent prompt injection and remote code execution?**  
*Answer:* FlowPilot never passes LLM outputs to an `eval()`, shell, or SQL engine. The AI output is constrained to a structured JSON definition validated against a strict, versioned Zod schema (`WorkflowDefinitionSchema`). If the model outputs an unknown or unauthorized action type, the validator immediately rejects the proposal. Furthermore, workflows require explicit human review and approval before execution.

**Q3: How are sensitive Google OAuth credentials protected?**  
*Answer:* Refresh tokens and access tokens are encrypted using **AES-256-GCM** (authenticated encryption) before being saved to the database. During encryption, an initialization vector (IV) and authentication tag are produced. If the ciphertext or tag is tampered with, decryption fails. Plaintext tokens are stripped from all API responses and logs.

**Q4: Why does the Security Center not have a single security percentage score?**  
*Answer:* Arbitrary security scores create a false sense of security. Per enterprise security best practices and project requirements, FlowPilot displays genuine, evidence-based statuses: controls are either verifiably active (`verified`), need attention (`warning`), or cannot be proven in the current environment (`unverified`), complete with transparent remediation steps.

---

## 📄 License
ISC License. Built for FlowPilot AI Automation SaaS.
