Google Stitch Master UI Prompt
FlowPilot AI Automation Dashboard | Screen-by-screen UI/UX design specification
How to use this PDF
Copy the master prompt into your project agent. Review the repository and configuration first, then follow the module
gates. Keep a separate copy for future edits.
Page 1
FlowPilot | AI Automation Dashboard
Master UI Design Prompt
Role and product
ROLE:
Act as a senior SaaS product designer, UI/UX architect, and design-system
specialist.
PRODUCT:
Design "FlowPilot", a modern AI Automation Dashboard for creating AI-assisted
workflows, connecting Google services, monitoring execution runs, and managing
security. This is a real SaaS application interface, not a marketing landing
page.
GOAL:
Create a polished, developer-ready dashboard with a coherent design system,
consistent components, responsive screens, and connected prototype flows
where supported.
Visual direction and application shell
VISUAL DIRECTION:- Modern, minimal, professional B2B SaaS.- Light theme as the primary theme.- White and soft neutral-gray surfaces.- Deep indigo or violet as a restrained primary accent.- Dark, readable typography; thin borders; subtle shadows.- Rounded cards and consistent spacing.- Clear status colors for success, failure, pending, and warning.- Lucide-style outline icons.- Avoid excessive gradients, glassmorphism, and decorative animation.
DESKTOP SHELL:- Fixed or collapsible left sidebar.- Main content area and top bar.- Page title, search, notifications, and user menu.- Consistent content width and page padding.
SIDEBAR:
1. Overview
2. Workflows
3. AI Builder
4. Integrations
5. Run History
6. Security Center
7. Settings
Include a prominent "Create workflow" action.
MOBILE:
Responsive navigation drawer, stacked metric cards, manageable mobile lists,
touch-friendly controls, and no horizontal page overflow.
Screen 1 — Dashboard overview
Create:- Welcome heading and supporting description.- Create workflow CTA.- Total workflows metric.- Successful runs metric.- Failed runs metric.- Recent activity.- Recent workflows table.- Integration connection status.- Workflow status badges.- Helpful new-user empty states.
Use illustrative sample content and label it as sample data in the prototype.
Do not imply prototype data is connected to a real backend.
Page 2
FlowPilot | AI Automation Dashboard
Screen 2 — AI workflow builder
Create a workflow creation experience with:- Large natural-language input.- Example prompt suggestions.- Generate workflow action and loading state.- Workflow preview panel.- Trigger, condition, and action blocks.- Editable workflow steps.- Integration and permission indicators.- Save draft, cancel, and approve actions.- Validation errors and missing-connection warnings.
Example:
"Every morning, summarize my calendar events and save the summary to Sheets."
Visual flow:
Trigger fi Read calendar events fi Create summary fi Write to spreadsheet.
Communicate that AI output is a proposal. Users must review and approve it
before execution.
Screen 3 — Workflow details
Include workflow name, description, draft/active/paused/error status, workflow
steps, last run, next scheduled run only where actually configured, edit,
pause, resume, and run-now actions, recent execution records, and permission
and approval information.
Clearly distinguish configured schedules from confirmed scheduled execution.
Screen 4 — Integration manager
Create integration cards for:- Gmail- Google Calendar- Google Sheets
Each card includes icon, name, short description, connected/disconnected
status, granted permission summary, connect/reconnect/disconnect actions,
and last verified connection time.
Use confirmation dialogs for disconnect. Never show access tokens or secrets.
Screen 5 — Execution history and details
HISTORY:- Search and filters for workflow, status, and date range.- Execution ID, workflow name, start time, duration, status badge,
  result summary, and view-details action.- States: succeeded, failed, running, queued, awaiting approval, cancelled.- Pagination or manageable lists.
DETAILS:- Sanitized error information.- Step-by-step execution results.- Timestamps, status transitions, and retry information where applicable.
Do not show sensitive credentials in any result or error display.
Screen 6 — Security Center
Include:- Connected integration inventory.- Permission summaries.- Recent security events.- Workflow approval records.- Account/session information where supported.- Integration revocation and disconnect actions.- Security configuration checks.- Warnings for incomplete configurations.
Do not invent a security score or claim a control is enabled without evidence.
Represent verified, warning, and unverified states clearly.
Page 3
FlowPilot | AI Automation Dashboard
Screen 7 — Settings
Include:- Profile and account preferences.- Notification preferences.- Theme preferences.- Account security.- Connected services.- Data and privacy settings.
Use clear labels, accessible forms, validation states, and confirmation
dialogs for sensitive changes.
Reusable component library and accessibility
Create reusable designs for:- Sidebar and top navigation.- Metric cards.- Buttons and form controls.- Search and filters.- Tables and pagination.- Status badges.- Integration cards.- Workflow nodes and connectors.- Confirmation dialogs and toasts.- Loading skeletons, empty states, and error states.
Use consistent component variants, spacing, typography, radii, and design
tokens.
Accessibility:- Strong text/control contrast.- Visible keyboard focus and logical tab order.- Clear labels and validation messages.- Never rely on color alone for status.- Respect reduced-motion preferences.
Interactions and developer handoff
Design expected interactions for:- Opening the workflow builder.- Entering a prompt and reviewing generated steps.- Editing a workflow.- Connecting an integration.- Filtering execution history.- Opening execution details.- Confirming sensitive actions.- Handling empty and error states.
If supported, create linked screens and interactive prototype flows.
DEVELOPER HANDOFF:
Target stack: Next.js App Router, React, TypeScript, Tailwind CSS, and
shadcn/ui. Use reusable components rather than independent styling for each
screen. Keep layouts feasible for responsive web implementation.
Do not generate backend code or pretend integrations are functional.
FINAL DELIVERABLE:
1. Dashboard overview.
2. AI workflow builder.
3. Workflow details.
4. Integration manager.
5. Execution history.
6. Execution detail.
7. Security Center.
8. Settings.
9. Reusable component library.
10. Connected prototype flows, if supported.
Maintain one coherent design language across all screens.
Page 4
FlowPilot | AI Automation Dashboard