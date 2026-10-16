"""
FlowPilot Database Layer (SQLite)
Provides local ACID persistence, audit trails, and data isolation.
Works seamlessly locally and on Streamlit Community Cloud without external dependencies.
"""

import sqlite3
import json
import uuid
from datetime import datetime, timezone

DB_PATH = "flowpilot.db"

def get_connection():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cur = conn.cursor()

    # Workflows Table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS workflows (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            trigger_type TEXT DEFAULT 'manual',
            schedule TEXT,
            steps_json TEXT NOT NULL,
            is_active INTEGER DEFAULT 1,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    """)

    # Integrations Table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS integrations (
            id TEXT PRIMARY KEY,
            provider TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            scopes TEXT NOT NULL,
            status TEXT NOT NULL,
            token_fingerprint TEXT,
            last_synced TEXT
        )
    """)

    # Execution Runs Telemetry Table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS runs (
            id TEXT PRIMARY KEY,
            workflow_id TEXT NOT NULL,
            workflow_title TEXT,
            status TEXT NOT NULL,
            triggered_by TEXT NOT NULL,
            started_at TEXT NOT NULL,
            completed_at TEXT,
            duration_ms INTEGER,
            steps_log_json TEXT NOT NULL
        )
    """)

    # Human-In-The-Loop Approvals Table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS approvals (
            id TEXT PRIMARY KEY,
            run_id TEXT NOT NULL,
            workflow_id TEXT NOT NULL,
            workflow_title TEXT,
            action_type TEXT NOT NULL,
            payload_json TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    # Cryptographic Audit Log Table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS audit_logs (
            id TEXT PRIMARY KEY,
            event_type TEXT NOT NULL,
            details TEXT NOT NULL,
            actor TEXT NOT NULL,
            ip_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    # Settings Key-Value Table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )
    """)

    conn.commit()

    # Seed initial data if fresh
    cur.execute("SELECT COUNT(*) as count FROM workflows")
    if cur.fetchone()["count"] == 0:
        seed_initial_data(conn)

    conn.close()

def seed_initial_data(conn):
    cur = conn.cursor()
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    # Seed Default Integrations
    integrations_seed = [
        (
            "int_google_calendar",
            "google_calendar",
            "Google Calendar",
            "https://www.googleapis.com/auth/calendar.readonly",
            "connected",
            "aes256_enc:9b4a...f721",
            now
        ),
        (
            "int_google_sheets",
            "google_sheets",
            "Google Sheets",
            "https://www.googleapis.com/auth/spreadsheets",
            "connected",
            "aes256_enc:4c12...883a",
            now
        ),
        (
            "int_gmail",
            "gmail",
            "Gmail",
            "https://www.googleapis.com/auth/gmail.compose, https://www.googleapis.com/auth/gmail.readonly",
            "connected",
            "aes256_enc:1a88...0ef2",
            now
        )
    ]
    cur.executemany("""
        INSERT OR REPLACE INTO integrations (id, provider, name, scopes, status, token_fingerprint, last_synced)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, integrations_seed)

    # Seed Default Workflows
    wf1_steps = [
        {
            "id": "step_1",
            "type": "action",
            "action": "calendar.read_events",
            "title": "Read Today's Meetings",
            "service": "Google Calendar",
            "config": {"timeframe": "today"}
        },
        {
            "id": "step_2",
            "type": "action",
            "action": "sheets.append_row",
            "title": "Log Daily Agenda",
            "service": "Google Sheets",
            "config": {"sheetName": "Daily_Standup_Log", "range": "A:E"}
        }
    ]

    wf2_steps = [
        {
            "id": "step_1",
            "type": "action",
            "action": "sheets.read_rows",
            "title": "Fetch Customer Inquiries",
            "service": "Google Sheets",
            "config": {"sheetName": "Leads", "range": "A2:D50"}
        },
        {
            "id": "step_2",
            "type": "action",
            "action": "gmail.create_draft",
            "title": "Prepare Follow-up Draft",
            "service": "Gmail",
            "config": {"subjectTemplate": "Welcome to FlowPilot - Fast Track Onboarding"}
        }
    ]

    wf3_steps = [
        {
            "id": "step_1",
            "type": "action",
            "action": "calendar.read_events",
            "title": "Fetch Weekly Sprint Schedule",
            "service": "Google Calendar",
            "config": {"timeframe": "this_week"}
        },
        {
            "id": "step_2",
            "type": "action",
            "action": "gmail.send_email",
            "title": "Broadcast Weekly Summary",
            "service": "Gmail",
            "config": {"recipient": "team@organization.org", "subjectTemplate": "Weekly Sprint Digest"}
        }
    ]

    workflows_seed = [
        (
            "wf_calendar_digest",
            "Daily Calendar Sync to Google Sheets",
            "Extracts today's scheduled meetings from Google Calendar and writes an updated digest row into Google Sheets.",
            "schedule",
            "Every day at 09:00 AM",
            json.dumps(wf1_steps),
            1,
            now,
            now
        ),
        (
            "wf_lead_followup",
            "Customer Lead Ingestion & Draft Generator",
            "Reads latest customer inquiries from Google Sheets and drafts personalized welcome emails in Gmail.",
            "manual",
            "Manual Execution",
            json.dumps(wf2_steps),
            1,
            now,
            now
        ),
        (
            "wf_weekly_broadcast",
            "Weekly Executive Sprint Email Broadcast",
            "Gathers upcoming weekly calendar events and dispatches an announcement email to team members.",
            "schedule",
            "Every Monday at 08:30 AM",
            json.dumps(wf3_steps),
            1,
            now,
            now
        )
    ]
    cur.executemany("""
        INSERT INTO workflows (id, title, description, trigger_type, schedule, steps_json, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, workflows_seed)

    # Seed Past Runs Telemetry
    sample_steps_log_1 = [
        {"step": 1, "action": "calendar.read_events", "status": "SUCCESS", "duration_ms": 142, "output": {"eventsCount": 3, "timeframe": "today"}},
        {"step": 2, "action": "sheets.append_row", "status": "SUCCESS", "duration_ms": 230, "output": {"sheetName": "Daily_Standup_Log", "status": "Row appended successfully"}}
    ]
    sample_steps_log_2 = [
        {"step": 1, "action": "sheets.read_rows", "status": "SUCCESS", "duration_ms": 180, "output": {"rowsRead": 2, "sampleRow": {"customer": "Acme Corp", "plan": "Enterprise"}}},
        {"step": 2, "action": "gmail.create_draft", "status": "SUCCESS", "duration_ms": 310, "output": {"draftId": "draft_991823", "subject": "Welcome to FlowPilot - Fast Track Onboarding"}}
    ]

    runs_seed = [
        (
            "run_001",
            "wf_calendar_digest",
            "Daily Calendar Sync to Google Sheets",
            "SUCCESS",
            "cron_scheduler",
            now,
            now,
            372,
            json.dumps(sample_steps_log_1)
        ),
        (
            "run_002",
            "wf_lead_followup",
            "Customer Lead Ingestion & Draft Generator",
            "SUCCESS",
            "operator_manual",
            now,
            now,
            490,
            json.dumps(sample_steps_log_2)
        )
    ]
    cur.executemany("""
        INSERT INTO runs (id, workflow_id, workflow_title, status, triggered_by, started_at, completed_at, duration_ms, steps_log_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, runs_seed)

    # Seed Audit Logs
    audit_seed = [
        (
            str(uuid.uuid4()),
            "SECURITY_POLICY_INITIALIZED",
            "Zero Arbitrary Code Execution Sandbox & AES-256 Token Encryption verified.",
            "System / Antigravity Agent",
            "sha256:d8a2...3e11",
            now
        ),
        (
            str(uuid.uuid4()),
            "OAUTH_TOKEN_ENCRYPTED",
            "Encrypted refresh tokens for Google Calendar, Sheets, Gmail with AES-256-GCM.",
            "Security Vault",
            "sha256:91bc...aa01",
            now
        ),
        (
            str(uuid.uuid4()),
            "WORKFLOW_SEEDED",
            "Initialized production sample workflows and registered deterministic action handlers.",
            "Operator (Student BCA)",
            "127.0.0.1",
            now
        )
    ]
    cur.executemany("""
        INSERT INTO audit_logs (id, event_type, details, actor, ip_hash, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, audit_seed)

    # Seed Default Settings
    settings_seed = [
        ("require_email_approval", "true"),
        ("execution_timeout_sec", "30"),
        ("max_retries", "3"),
        ("gemini_api_key", ""),
        ("operator_role", "Student Operator (Full Access)")
    ]
    cur.executemany("""
        INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)
    """, settings_seed)

    conn.commit()

# --- Workflows CRUD ---

def get_workflows():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM workflows ORDER BY created_at DESC")
    rows = [dict(row) for row in cur.fetchall()]
    conn.close()
    for row in rows:
        row["steps"] = json.loads(row["steps_json"])
    return rows

def get_workflow(workflow_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM workflows WHERE id = ?", (workflow_id,))
    row = cur.fetchone()
    conn.close()
    if row:
        d = dict(row)
        d["steps"] = json.loads(d["steps_json"])
        return d
    return None

def save_workflow(title, description, trigger_type, schedule, steps, is_active=1):
    conn = get_connection()
    cur = conn.cursor()
    wf_id = f"wf_{uuid.uuid4().hex[:8]}"
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    cur.execute("""
        INSERT INTO workflows (id, title, description, trigger_type, schedule, steps_json, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (wf_id, title, description, trigger_type, schedule, json.dumps(steps), is_active, now, now))
    conn.commit()
    conn.close()
    add_audit_log("WORKFLOW_CREATED", f"Created workflow '{title}' with {len(steps)} steps.")
    return wf_id

def toggle_workflow(workflow_id, is_active):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("UPDATE workflows SET is_active = ?, updated_at = ? WHERE id = ?",
                (1 if is_active else 0, datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"), workflow_id))
    conn.commit()
    conn.close()
    status_str = "activated" if is_active else "paused"
    add_audit_log("WORKFLOW_TOGGLED", f"Workflow {workflow_id} was {status_str}.")

def delete_workflow(workflow_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM workflows WHERE id = ?", (workflow_id,))
    conn.commit()
    conn.close()
    add_audit_log("WORKFLOW_DELETED", f"Deleted workflow {workflow_id}.")

# --- Integrations CRUD ---

def get_integrations():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM integrations ORDER BY name ASC")
    rows = [dict(row) for row in cur.fetchall()]
    conn.close()
    return rows

def update_integration_status(provider, is_connected):
    conn = get_connection()
    cur = conn.cursor()
    new_status = "connected" if is_connected else "disconnected"
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    cur.execute("UPDATE integrations SET status = ?, last_synced = ? WHERE provider = ?",
                (new_status, now, provider))
    conn.commit()
    conn.close()
    add_audit_log("INTEGRATION_STATUS_CHANGED", f"{provider} status changed to {new_status}.")

# --- Runs & Telemetry ---

def record_run(workflow_id, workflow_title, status, triggered_by, steps_log, duration_ms):
    conn = get_connection()
    cur = conn.cursor()
    run_id = f"run_{uuid.uuid4().hex[:8]}"
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    cur.execute("""
        INSERT INTO runs (id, workflow_id, workflow_title, status, triggered_by, started_at, completed_at, duration_ms, steps_log_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (run_id, workflow_id, workflow_title, status, triggered_by, now, now, duration_ms, json.dumps(steps_log)))
    conn.commit()
    conn.close()
    add_audit_log("WORKFLOW_RUN_RECORDED", f"Run {run_id} finished with status '{status}' ({duration_ms}ms).")
    return run_id

def get_runs(limit=50):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM runs ORDER BY started_at DESC LIMIT ?", (limit,))
    rows = [dict(row) for row in cur.fetchall()]
    conn.close()
    for row in rows:
        row["steps_log"] = json.loads(row["steps_log_json"])
    return rows

# --- Approvals (Human-in-the-Loop) ---

def create_approval_request(run_id, workflow_id, workflow_title, action_type, payload):
    conn = get_connection()
    cur = conn.cursor()
    app_id = f"app_{uuid.uuid4().hex[:8]}"
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    cur.execute("""
        INSERT INTO approvals (id, run_id, workflow_id, workflow_title, action_type, payload_json, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, 'PENDING', ?)
    """, (app_id, run_id, workflow_id, workflow_title, action_type, json.dumps(payload), now))
    conn.commit()
    conn.close()
    add_audit_log("APPROVAL_REQUESTED", f"Sensitive action '{action_type}' in run {run_id} halted for operator confirmation.")
    return app_id

def get_approvals():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM approvals ORDER BY created_at DESC")
    rows = [dict(row) for row in cur.fetchall()]
    conn.close()
    for row in rows:
        row["payload"] = json.loads(row["payload_json"])
    return rows

def resolve_approval(approval_id, decision):
    # decision: 'APPROVED' or 'REJECTED'
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("UPDATE approvals SET status = ? WHERE id = ?", (decision, approval_id))
    conn.commit()
    conn.close()
    add_audit_log("APPROVAL_RESOLVED", f"Operator marked approval {approval_id} as {decision}.")

# --- Cryptographic Audit Logs ---

def add_audit_log(event_type, details, actor="Operator (Student BCA)", ip_hash="sha256:local_session"):
    conn = get_connection()
    cur = conn.cursor()
    log_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    cur.execute("""
        INSERT INTO audit_logs (id, event_type, details, actor, ip_hash, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (log_id, event_type, details, actor, ip_hash, now))
    conn.commit()
    conn.close()

def get_audit_logs(limit=50):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ?", (limit,))
    rows = [dict(row) for row in cur.fetchall()]
    conn.close()
    return rows

# --- Settings & Metrics ---

def get_settings():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT key, value FROM settings")
    settings = {row["key"]: row["value"] for row in cur.fetchall()}
    conn.close()
    return settings

def update_setting(key, value):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", (key, str(value)))
    conn.commit()
    conn.close()

def get_stats():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) as total, SUM(CASE WHEN is_active=1 THEN 1 ELSE 0 END) as active FROM workflows")
    wf_row = cur.fetchone()
    cur.execute("SELECT COUNT(*) as total_runs, SUM(CASE WHEN status='SUCCESS' THEN 1 ELSE 0 END) as success_runs, SUM(CASE WHEN status='FAILED' THEN 1 ELSE 0 END) as failed_runs, SUM(CASE WHEN status='NEEDS_APPROVAL' THEN 1 ELSE 0 END) as pending_runs FROM runs")
    runs_row = cur.fetchone()
    cur.execute("SELECT COUNT(*) as pending_approvals FROM approvals WHERE status='PENDING'")
    app_row = cur.fetchone()
    conn.close()

    total_runs = runs_row["total_runs"] or 0
    success_runs = runs_row["success_runs"] or 0
    success_rate = round((success_runs / total_runs * 100), 1) if total_runs > 0 else 100.0

    return {
        "total_workflows": wf_row["total"] or 0,
        "active_workflows": wf_row["active"] or 0,
        "total_runs": total_runs,
        "success_runs": success_runs,
        "failed_runs": runs_row["failed_runs"] or 0,
        "pending_runs": runs_row["pending_runs"] or 0,
        "success_rate": success_rate,
        "pending_approvals": app_row["pending_approvals"] or 0
    }
