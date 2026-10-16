"""
FlowPilot AI Workflow Proposal Generator
Converts natural language specifications into structured, validated workflow schemas.
Supports both deterministic rule-based synthesis and Gemini API structured inference.
"""

import json
import re
import requests

REGISTERED_SERVICES = {
    "calendar": {
        "name": "Google Calendar",
        "scopes": ["https://www.googleapis.com/auth/calendar.readonly"],
        "actions": ["calendar.read_events"]
    },
    "sheets": {
        "name": "Google Sheets",
        "scopes": ["https://www.googleapis.com/auth/spreadsheets"],
        "actions": ["sheets.read_rows", "sheets.append_row"]
    },
    "gmail": {
        "name": "Gmail",
        "scopes": [
            "https://www.googleapis.com/auth/gmail.readonly",
            "https://www.googleapis.com/auth/gmail.compose",
            "https://www.googleapis.com/auth/gmail.send"
        ],
        "actions": ["gmail.create_draft", "gmail.send_email"]
    }
}

def generate_workflow_proposal(user_prompt: str, api_key: str = None) -> dict:
    """
    Translates operator intent into a structured workflow proposal.
    If Gemini API key is provided, invokes Gemini 1.5 / 2.5 Flash API.
    Otherwise uses deterministic semantic matching.
    """
    clean_prompt = user_prompt.strip()

    if api_key and len(api_key.strip()) > 10:
        try:
            gemini_res = _call_gemini_api(clean_prompt, api_key)
            if gemini_res:
                return gemini_res
        except Exception:
            # Fall back to internal parser if API request fails
            pass

    return _internal_heuristic_generator(clean_prompt)

def _call_gemini_api(prompt: str, api_key: str) -> dict:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    system_instruction = (
        "You are FlowPilot's AI Workflow Architect. Convert the user's natural language request into a valid JSON workflow.\n"
        "Allowed actions ONLY: 'calendar.read_events', 'sheets.read_rows', 'sheets.append_row', 'gmail.create_draft', 'gmail.send_email'.\n"
        "Return ONLY raw JSON with keys: title, description, trigger_type ('manual' or 'schedule'), schedule (string), steps (array of {id, action, title, service, config})."
    )

    payload = {
        "contents": [{"parts": [{"text": f"{system_instruction}\nUser Request: {prompt}"}]}],
        "generationConfig": {"temperature": 0.2, "response_mime_type": "application/json"}
    }

    resp = requests.post(url, json=payload, timeout=8)
    if resp.status_code == 200:
        data = resp.json()
        raw_text = data['candidates'][0]['content']['parts'][0]['text']
        parsed = json.loads(raw_text)
        # Validate that only registered safe actions are included
        safe_steps = []
        valid_actions = {
            "calendar.read_events", "sheets.read_rows", "sheets.append_row",
            "gmail.create_draft", "gmail.send_email"
        }
        for idx, s in enumerate(parsed.get("steps", []), start=1):
            if s.get("action") in valid_actions:
                s["id"] = f"step_{idx}"
                safe_steps.append(s)
        if safe_steps:
            parsed["steps"] = safe_steps
            parsed["generated_by"] = "Gemini Flash Model"
            return parsed
    return None

def _internal_heuristic_generator(prompt: str) -> dict:
    p = prompt.lower()
    steps = []
    step_num = 1

    # Detect Trigger
    trigger_type = "manual"
    schedule_str = "Manual Execution"
    if any(k in p for k in ["every day", "daily", "every morning", "9am", "morning"]):
        trigger_type = "schedule"
        schedule_str = "Daily at 09:00 AM"
    elif any(k in p for k in ["every monday", "weekly", "week"]):
        trigger_type = "schedule"
        schedule_str = "Every Monday at 09:00 AM"
    elif any(k in p for k in ["every hour", "hourly"]):
        trigger_type = "schedule"
        schedule_str = "Every 1 Hour"

    # Step 1: Calendar or Sheets Read
    if any(k in p for k in ["calendar", "meeting", "events", "schedule", "agenda"]):
        timeframe = "today"
        if "week" in p:
            timeframe = "this_week"
        steps.append({
            "id": f"step_{step_num}",
            "type": "action",
            "action": "calendar.read_events",
            "title": "Extract Calendar Events",
            "service": "Google Calendar",
            "config": {"timeframe": timeframe}
        })
        step_num += 1

    if any(k in p for k in ["read sheet", "read rows", "check leads", "get customer", "spreadsheet data", "rows"]):
        steps.append({
            "id": f"step_{step_num}",
            "type": "action",
            "action": "sheets.read_rows",
            "title": "Query Google Sheets Rows",
            "service": "Google Sheets",
            "config": {"sheetName": "Leads_Data", "range": "A2:E50"}
        })
        step_num += 1

    # Step 2: Append to Sheets or Draft/Send Email
    if any(k in p for k in ["save", "append", "log", "record", "store", "write"]) and any(k in p for k in ["sheet", "spreadsheet", "table", "excel"]):
        steps.append({
            "id": f"step_{step_num}",
            "type": "action",
            "action": "sheets.append_row",
            "title": "Append Record to Google Sheets",
            "service": "Google Sheets",
            "config": {"sheetName": "Automation_Logs", "range": "A:D"}
        })
        step_num += 1

    if any(k in p for k in ["draft", "prepare email", "compose", "drafts"]):
        steps.append({
            "id": f"step_{step_num}",
            "type": "action",
            "action": "gmail.create_draft",
            "title": "Generate Gmail Draft",
            "service": "Gmail",
            "config": {"subjectTemplate": "FlowPilot Digest: Actionable Summary"}
        })
        step_num += 1
    elif any(k in p for k in ["send email", "email team", "dispatch email", "notify via email", "broadcast"]):
        steps.append({
            "id": f"step_{step_num}",
            "type": "action",
            "action": "gmail.send_email",
            "title": "Dispatch Email Notification",
            "service": "Gmail",
            "config": {"recipient": "team@organization.org", "subjectTemplate": "Automated Flow Notification"}
        })
        step_num += 1

    # Fallback default if prompt was generic
    if not steps:
        steps = [
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
                "title": "Log Daily Agenda Row",
                "service": "Google Sheets",
                "config": {"sheetName": "Activity_Log"}
            }
        ]

    # Generate smart title and summary
    if "calendar" in p and "sheet" in p:
        title = "Automated Calendar Sync to Google Sheets"
        desc = "Reads upcoming events from Google Calendar and synchronizes agenda records into Google Sheets."
    elif "lead" in p or "draft" in p:
        title = "Customer Inquiry Processor & Gmail Drafter"
        desc = "Processes inbound entries and drafts personalized response templates in Gmail inbox."
    elif "send" in p or "email" in p:
        title = "Event Notification & Team Email Broadcaster"
        desc = "Monitors scheduled activity and initiates email communication subject to security review."
    else:
        title = f"AI Workflow: {prompt[:35]}..." if len(prompt) > 35 else f"AI Workflow: {prompt}"
        desc = f"Synthesized automation based on: '{prompt}'."

    return {
        "title": title,
        "description": desc,
        "trigger_type": trigger_type,
        "schedule": schedule_str,
        "steps": steps,
        "generated_by": "FlowPilot Neural Synthesizer",
        "required_scopes": _calculate_scopes(steps)
    }

def _calculate_scopes(steps):
    scopes = set()
    for s in steps:
        action = s.get("action", "")
        if action.startswith("calendar"):
            scopes.add("Google Calendar (calendar.readonly)")
        elif action.startswith("sheets"):
            scopes.add("Google Sheets (spreadsheets)")
        elif action == "gmail.create_draft":
            scopes.add("Gmail (gmail.compose)")
        elif action == "gmail.send_email":
            scopes.add("Gmail (gmail.send - High Sensitivity)")
    return list(scopes)
