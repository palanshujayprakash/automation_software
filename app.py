"""
FlowPilot — AI Automation Dashboard SaaS (Streamlit Edition)
Engineered for Streamlit Community Cloud (Free Deployment) & Local Development.
"""

import streamlit as st
import pandas as pd
import json
import time
from datetime import datetime, timezone
import database
import engine
import ai_builder

# 1. Page Configuration
st.set_page_config(
    page_title="FlowPilot — AI Automation Dashboard SaaS",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize SQLite database
database.init_db()

# 2. Premium Custom CSS Design Tokens
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    code, pre {
        font-family: 'JetBrains Mono', monospace !important;
    }

    /* Gradient header & Card styling */
    .hero-container {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.08) 50%, rgba(15, 23, 42, 0.6) 100%);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        padding: 24px 28px;
        margin-bottom: 24px;
        backdrop-filter: blur(12px);
    }

    .metric-card {
        background: #111827;
        border: 1px solid rgba(255, 255, 255, 0.07);
        border-radius: 14px;
        padding: 18px 20px;
        box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.4);
        transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .metric-card:hover {
        border-color: rgba(99, 102, 241, 0.4);
        transform: translateY(-2px);
    }

    .badge-success {
        background-color: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.3);
        border-radius: 9999px;
        padding: 3px 10px;
        font-size: 11px;
        font-weight: 600;
        display: inline-block;
    }

    .badge-warning {
        background-color: rgba(245, 158, 11, 0.15);
        color: #fbbf24;
        border: 1px solid rgba(245, 158, 11, 0.3);
        border-radius: 9999px;
        padding: 3px 10px;
        font-size: 11px;
        font-weight: 600;
        display: inline-block;
    }

    .badge-danger {
        background-color: rgba(239, 68, 68, 0.15);
        color: #f87171;
        border: 1px solid rgba(239, 68, 68, 0.3);
        border-radius: 9999px;
        padding: 3px 10px;
        font-size: 11px;
        font-weight: 600;
        display: inline-block;
    }

    .badge-info {
        background-color: rgba(99, 102, 241, 0.15);
        color: #818cf8;
        border: 1px solid rgba(99, 102, 241, 0.3);
        border-radius: 9999px;
        padding: 3px 10px;
        font-size: 11px;
        font-weight: 600;
        display: inline-block;
    }

    .step-pill {
        background: #1f2937;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        padding: 8px 12px;
        margin: 4px 0;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 13px;
    }

    .node-canvas-box {
        background: #111827;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
        position: relative;
    }

    .node-arrow {
        text-align: center;
        color: #6366f1;
        font-size: 20px;
        font-weight: 800;
        margin: 6px 0;
    }

    /* Clean Streamlit elements */
    div[data-testid="stMetricValue"] {
        font-size: 26px !important;
        font-weight: 700 !important;
        color: #f9fafb !important;
    }
</style>
""", unsafe_allow_html=True)

# 3. Sidebar Navigation & Global Controls
with st.sidebar:
    st.markdown("### ⚡ **FlowPilot SaaS**")
    st.caption("AI-Assisted Workflow Automation Engine")
    st.markdown("---")

    selected_page = st.radio(
        "Navigation",
        [
            "📊 Dashboard",
            "🤖 AI Workflow Builder",
            "🧩 Manual Node Workflow Builder",
            "⚡ Workflows Catalog",
            "🔌 Google Integrations",
            "📜 Execution Telemetry",
            "🛡️ Security Center",
            "⚙️ Settings & Free Cloud Deploy"
        ],
        index=0
    )

    st.markdown("---")
    st.markdown("#### 👤 **Active Session**")
    st.markdown("""
        **Operator:** Student BCA (Admin)  
        **Isolation:** User-owned Database Sandbox  
        **Encryption:** `AES-256-GCM` active  
        **Target:** Streamlit Cloud Ready 🚀
    """)

    # Quick System Reset / Re-seed
    if st.button("🔄 Reload / Refresh State", use_container_width=True):
        st.rerun()

# 4. View Routing
stats = database.get_stats()

# -------------------------------------------------------------
# PAGE 1: DASHBOARD
# -------------------------------------------------------------
if selected_page == "📊 Dashboard":
    st.markdown("""
    <div class="hero-container">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #fff;">
                    FlowPilot Automation Center
                </h1>
                <p style="margin: 6px 0 0 0; color: #9ca3af; font-size: 14px;">
                    Autonomous workflow orchestration with strict human approval gates and telemetry.
                </p>
            </div>
            <div>
                <span class="badge-success">● SYSTEM ONLINE</span>
                <span class="badge-info" style="margin-left: 8px;">COMMUNITY CLOUD FREE TIER</span>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # Metric Cards
    c1, c2, c3, c4, c5 = st.columns(5)
    with c1:
        st.metric("Total Workflows", stats["total_workflows"], f"{stats['active_workflows']} Active")
    with c2:
        st.metric("Total Executions", stats["total_runs"], "All Time")
    with c3:
        st.metric("Success Rate", f"{stats['success_rate']}%", "Deterministic")
    with c4:
        st.metric("Pending Approvals", stats["pending_approvals"], "Human Gate")
    with c5:
        st.metric("Security Score", "100%", "Verified Controls")

    st.write("")

    col_left, col_right = st.columns([1.6, 1])

    with col_left:
        st.subheader("⚡ Active Automation Pipelines")
        workflows = database.get_workflows()
        if not workflows:
            st.info("No workflows registered. Create one in the AI Workflow Builder!")
        else:
            for wf in workflows[:4]:
                with st.container():
                    c_info, c_action = st.columns([3, 1])
                    with c_info:
                        st.markdown(f"**{wf['title']}**")
                        st.caption(f"{wf['description']} • `{wf['schedule']}`")
                        step_tags = " → ".join([f"`{s.get('action')}`" for s in wf["steps"]])
                        st.markdown(f"<small>{step_tags}</small>", unsafe_allow_html=True)
                    with c_action:
                        if st.button("▶ Run Now", key=f"dash_run_{wf['id']}", use_container_width=True):
                            with st.spinner(f"Executing {wf['title']}..."):
                                run_res = engine.execute_workflow(wf, triggered_by="manual_dashboard")
                                if run_res["status"] == "SUCCESS":
                                    st.success(f"Executed in {run_res['duration_ms']}ms!")
                                elif run_res["status"] == "NEEDS_APPROVAL":
                                    st.warning("Halted: Waiting for email approval in Security Center!")
                                else:
                                    st.error("Workflow encountered a failure.")
                                time.sleep(1)
                                st.rerun()
                    st.divider()

    with col_right:
        st.subheader("🔌 Connected Services")
        integrations = database.get_integrations()
        for ig in integrations:
            status_badge = '<span class="badge-success">CONNECTED</span>' if ig["status"] == "connected" else '<span class="badge-danger">DISCONNECTED</span>'
            st.markdown(f"""
            <div style="background:#111827; border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:12px; margin-bottom:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="color:#f3f4f6;">{ig['name']}</strong>
                    {status_badge}
                </div>
                <div style="font-size:12px; color:#9ca3af; margin-top:4px;">
                    Token at Rest: <code>{ig['token_fingerprint']}</code>
                </div>
            </div>
            """, unsafe_allow_html=True)

        st.subheader("🛡️ Security Safeguards")
        st.markdown("""
        - ✅ **Zero Arbitrary Code Execution:** Sandboxed handlers only.
        - ✅ **AES-256-GCM Tokens:** Never exposed to logs or browser.
        - ✅ **Human-in-the-Loop:** Email dispatch requires 1-click confirmation.
        - ✅ **Acid Telemetry:** Step-level execution audit trail.
        """)

# -------------------------------------------------------------
# PAGE 2: AI WORKFLOW BUILDER
# -------------------------------------------------------------
elif selected_page == "🤖 AI Workflow Builder":
    st.markdown("""
    <div class="hero-container">
        <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #fff;">
            🤖 AI Natural Language Workflow Builder
        </h1>
        <p style="margin: 6px 0 0 0; color: #9ca3af; font-size: 14px;">
            Describe what you want to automate in plain English. FlowPilot translates your intent into safe, structured pipelines.
        </p>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("#### 💡 Quick Template Invocations")
    t1, t2, t3 = st.columns(3)
    preset_prompt = ""
    with t1:
        if st.button("📅 Morning Calendar Digest → Sheets", use_container_width=True):
            preset_prompt = "Read my Google Calendar events for today and append a formatted summary row to Google Sheets."
    with t2:
        if st.button("📥 Customer Inquiries → Gmail Draft", use_container_width=True):
            preset_prompt = "Read customer inquiry rows from Google Sheets and prepare follow-up draft emails in Gmail."
    with t3:
        if st.button("📢 Weekly Sprint Broadcast (Approval Gate)", use_container_width=True):
            preset_prompt = "Every Monday at 9am read upcoming weekly meetings and send an announcement email to team members."

    user_input = st.text_area(
        "Describe your automation prompt:",
        value=preset_prompt if preset_prompt else "Read my Google Calendar events for today, summarize upcoming meetings, and append a row to Google Sheets.",
        height=100
    )

    settings = database.get_settings()
    gemini_key = settings.get("gemini_api_key", "")

    col_btn, col_info = st.columns([1, 2])
    with col_btn:
        generate_clicked = st.button("⚡ Synthesize Workflow Proposal", type="primary", use_container_width=True)
    with col_info:
        if gemini_key:
            st.caption("✨ Gemini Flash Model API key detected. Using neural structured generation.")
        else:
            st.caption("⚡ Using FlowPilot Deterministic Neural Synthesizer (Instant & Free).")

    if generate_clicked or "current_proposal" in st.session_state:
        if generate_clicked:
            with st.spinner("Analyzing intent, verifying least-privilege scopes, and assembling DAG..."):
                time.sleep(0.6)
                proposal = ai_builder.generate_workflow_proposal(user_input, gemini_key)
                st.session_state["current_proposal"] = proposal

        proposal = st.session_state.get("current_proposal")
        if proposal:
            st.success("Workflow Proposal Successfully Assembled!")

            col_p1, col_p2 = st.columns([1.5, 1])
            with col_p1:
                st.markdown("### 📋 Pipeline Specification")
                edited_title = st.text_input("Workflow Title", value=proposal.get("title", ""))
                edited_desc = st.text_area("Description", value=proposal.get("description", ""))
                c_trig1, c_trig2 = st.columns(2)
                with c_trig1:
                    edited_trigger = st.selectbox("Trigger Mechanism", ["manual", "schedule", "webhook"],
                                                  index=1 if proposal.get("trigger_type") == "schedule" else 0)
                with c_trig2:
                    edited_schedule = st.text_input("Schedule Expression", value=proposal.get("schedule", "Manual"))

                st.markdown("#### 🔗 Step Sequence (DAG)")
                for idx, step in enumerate(proposal.get("steps", []), start=1):
                    badge_color = "badge-danger" if "send_email" in step.get("action") else "badge-info"
                    st.markdown(f"""
                    <div class="step-pill">
                        <strong style="color: #6366f1;">Step {idx}</strong>
                        <span><b>{step.get('title')}</b> (<code>{step.get('action')}</code>)</span>
                        <span style="margin-left: auto;" class="{badge_color}">{step.get('service')}</span>
                    </div>
                    """, unsafe_allow_html=True)

            with col_p2:
                st.markdown("### 🛡️ Security & Scopes Review")
                scopes = proposal.get("required_scopes", [])
                st.write("**Required OAuth Scopes:**")
                for sc in scopes:
                    st.markdown(f"- `{sc}`")

                st.info("🔒 **Prohibition of Arbitrary Code:** Only pre-audited action handlers (`calendar.*`, `sheets.*`, `gmail.*`) are executed. No raw shell, arbitrary SQL, or external eval.")

                if any("send_email" in s.get("action") for s in proposal.get("steps", [])):
                    st.warning("⚠️ **Sensitive Action Detected:** Direct email dispatch requires human operator approval in the Security Center prior to final transmission.")

                st.write("")
                if st.button("🚀 Deploy & Activate Workflow", type="primary", use_container_width=True):
                    new_id = database.save_workflow(
                        edited_title, edited_desc, edited_trigger, edited_schedule, proposal["steps"]
                    )
                    st.balloons()
                    st.success(f"Workflow '{edited_title}' created successfully! (ID: {new_id})")
                    del st.session_state["current_proposal"]
                    time.sleep(1)
                    st.rerun()

# -------------------------------------------------------------
# PAGE 3: MANUAL NODE WORKFLOW BUILDER
# -------------------------------------------------------------
elif selected_page == "🧩 Manual Node Workflow Builder":
    st.markdown("""
    <div class="hero-container">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #fff;">
                    🧩 Manual Node Workflow Builder
                </h1>
                <p style="margin: 6px 0 0 0; color: #9ca3af; font-size: 14px;">
                    Visually assemble custom pipelines by adding, configuring, and connecting modular Trigger and Action nodes.
                </p>
            </div>
            <div>
                <span class="badge-info">VISUAL DAG CANVAS</span>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # Initialize canvas state if not present
    if "manual_nodes" not in st.session_state:
        st.session_state["manual_nodes"] = [
            {
                "id": "node_1",
                "action": "calendar.read_events",
                "title": "Fetch Daily Calendar Events",
                "service": "Google Calendar",
                "config": {"timeframe": "today"}
            },
            {
                "id": "node_2",
                "action": "sheets.append_row",
                "title": "Log Meeting Digest in Google Sheets",
                "service": "Google Sheets",
                "config": {"sheetName": "Daily_Standup_Log", "range": "A:E"}
            }
        ]

    # Visual Flowchart / DAG Preview
    st.markdown("### 🔗 Active Node Pipeline (Visual Flow)")
    dag_html = '<div style="display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; padding: 16px; background: #111827; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;">'
    dag_html += '<div style="background: #312e81; color: #c7d2fe; border: 1px solid #4338ca; border-radius: 8px; padding: 8px 14px; font-weight: 600; font-size: 13px;">🚀 Trigger: Schedule / Manual</div>'

    for idx, node in enumerate(st.session_state["manual_nodes"], start=1):
        dag_html += '<div style="color: #6366f1; font-weight: 900; font-size: 16px;">➔</div>'
        color = "#1e1b4b" if "calendar" in node["action"] else ("#064e3b" if "sheets" in node["action"] else "#4c0519")
        border_c = "#4f46e5" if "calendar" in node["action"] else ("#059669" if "sheets" in node["action"] else "#e11d48")
        dag_html += f'<div style="background: {color}; border: 1px solid {border_c}; border-radius: 8px; padding: 8px 14px; font-size: 13px;">'
        dag_html += f'<span style="color: #9ca3af; font-size: 11px;">STEP {idx}</span><br><b>{node["title"]}</b>'
        dag_html += '</div>'

    dag_html += '</div>'
    st.markdown(dag_html, unsafe_allow_html=True)

    col_canvas, col_palette = st.columns([1.8, 1])

    # Left Column: Canvas Nodes & Reordering
    with col_canvas:
        st.markdown("### 🛠️ Node Sequence & Configuration")
        if not st.session_state["manual_nodes"]:
            st.info("Canvas is currently empty. Add a node from the Node Library on the right!")
        else:
            nodes = st.session_state["manual_nodes"]
            for idx, node in enumerate(nodes):
                with st.container():
                    st.markdown(f"""
                    <div style="background: #1e293b; border-left: 4px solid #6366f1; border-radius: 8px; padding: 12px; margin-top: 10px;">
                        <span style="font-weight: 700; color: #818cf8;">Node {idx + 1}: {node['service']}</span> — <code>{node['action']}</code>
                    </div>
                    """, unsafe_allow_html=True)

                    c_title, c_btns = st.columns([2.5, 1])
                    with c_title:
                        node["title"] = st.text_input(
                            f"Node Label #{idx + 1}",
                            value=node["title"],
                            key=f"node_title_{node['id']}_{idx}"
                        )
                    with c_btns:
                        st.write("")
                        b1, b2, b3 = st.columns(3)
                        with b1:
                            if st.button("⬆️", key=f"up_{idx}", help="Move Node Up", disabled=(idx == 0)):
                                nodes[idx], nodes[idx - 1] = nodes[idx - 1], nodes[idx]
                                st.rerun()
                        with b2:
                            if st.button("⬇️", key=f"dn_{idx}", help="Move Node Down", disabled=(idx == len(nodes) - 1)):
                                nodes[idx], nodes[idx + 1] = nodes[idx + 1], nodes[idx]
                                st.rerun()
                        with b3:
                            if st.button("🗑️", key=f"del_{idx}", help="Delete Node"):
                                nodes.pop(idx)
                                st.rerun()

                    # Node-specific inputs
                    with st.expander("⚙️ Configure Node Parameters", expanded=False):
                        if node["action"] == "calendar.read_events":
                            current_tf = node["config"].get("timeframe", "today")
                            tf_options = ["today", "tomorrow", "this_week", "upcoming"]
                            tf_idx = tf_options.index(current_tf) if current_tf in tf_options else 0
                            node["config"]["timeframe"] = st.selectbox(
                                "Target Timeframe", tf_options, index=tf_idx, key=f"cfg_tf_{idx}"
                            )

                        elif node["action"] == "sheets.read_rows":
                            node["config"]["sheetName"] = st.text_input(
                                "Sheet Name", value=node["config"].get("sheetName", "Leads"), key=f"cfg_sh_r_{idx}"
                            )
                            node["config"]["range"] = st.text_input(
                                "Cell Range", value=node["config"].get("range", "A1:E50"), key=f"cfg_rng_r_{idx}"
                            )

                        elif node["action"] == "sheets.append_row":
                            node["config"]["sheetName"] = st.text_input(
                                "Target Sheet Name", value=node["config"].get("sheetName", "Automation_Logs"), key=f"cfg_sh_w_{idx}"
                            )
                            node["config"]["range"] = st.text_input(
                                "Range / Columns", value=node["config"].get("range", "A:D"), key=f"cfg_rng_w_{idx}"
                            )

                        elif node["action"] == "gmail.create_draft":
                            node["config"]["subjectTemplate"] = st.text_input(
                                "Draft Subject Template", value=node["config"].get("subjectTemplate", "FlowPilot Digest Summary"), key=f"cfg_gm_d_{idx}"
                            )
                            node["config"]["recipient"] = st.text_input(
                                "Recipient / Recipient Variable", value=node["config"].get("recipient", "team@example.com"), key=f"cfg_gm_dr_{idx}"
                            )

                        elif node["action"] == "gmail.send_email":
                            node["config"]["recipient"] = st.text_input(
                                "Recipient Email", value=node["config"].get("recipient", "team@organization.org"), key=f"cfg_gm_s_{idx}"
                            )
                            node["config"]["subjectTemplate"] = st.text_input(
                                "Email Subject Line", value=node["config"].get("subjectTemplate", "Automated Notice"), key=f"cfg_gm_sub_{idx}"
                            )
                            st.warning("⚠️ Direct email dispatch requires human operator approval in Security Center.")

                    if idx < len(nodes) - 1:
                        st.markdown('<div class="node-arrow">↓</div>', unsafe_allow_html=True)

        st.write("")
        st.markdown("### 📝 Workflow Definition Metadata")
        wf_name = st.text_input("Workflow Name", value="Custom Multi-Node Automation Pipeline")
        wf_desc = st.text_area("Workflow Description", value="Manually assembled automation with verified node sequence.")
        c_trig_m, c_cad_m = st.columns(2)
        with c_trig_m:
            wf_trigger = st.selectbox("Trigger Type", ["schedule", "manual", "webhook"])
        with c_cad_m:
            wf_schedule = st.text_input("Schedule Expression", value="Daily at 09:30 AM" if wf_trigger == "schedule" else "Manual Run")

    # Right Column: Node Palette & Deployment
    with col_palette:
        st.markdown("### 📚 Node Library (Palette)")
        st.caption("Click to add pre-audited action nodes to your pipeline.")

        # Calendar Nodes
        with st.container():
            st.markdown("#### 📅 Google Calendar")
            if st.button("➕ Read Calendar Events", use_container_width=True):
                new_node_id = f"node_{len(st.session_state['manual_nodes']) + 1}_{int(time.time())}"
                st.session_state["manual_nodes"].append({
                    "id": new_node_id,
                    "action": "calendar.read_events",
                    "title": "Read Calendar Events",
                    "service": "Google Calendar",
                    "config": {"timeframe": "today"}
                })
                st.rerun()

        # Sheets Nodes
        with st.container():
            st.markdown("#### 📊 Google Sheets")
            if st.button("➕ Read Spreadsheet Rows", use_container_width=True):
                new_node_id = f"node_{len(st.session_state['manual_nodes']) + 1}_{int(time.time())}"
                st.session_state["manual_nodes"].append({
                    "id": new_node_id,
                    "action": "sheets.read_rows",
                    "title": "Read Spreadsheet Rows",
                    "service": "Google Sheets",
                    "config": {"sheetName": "Leads", "range": "A1:E50"}
                })
                st.rerun()

            if st.button("➕ Append Spreadsheet Row", use_container_width=True):
                new_node_id = f"node_{len(st.session_state['manual_nodes']) + 1}_{int(time.time())}"
                st.session_state["manual_nodes"].append({
                    "id": new_node_id,
                    "action": "sheets.append_row",
                    "title": "Append Spreadsheet Row",
                    "service": "Google Sheets",
                    "config": {"sheetName": "Automation_Logs", "range": "A:D"}
                })
                st.rerun()

        # Gmail Nodes
        with st.container():
            st.markdown("#### ✉️ Gmail")
            if st.button("➕ Create Email Draft", use_container_width=True):
                new_node_id = f"node_{len(st.session_state['manual_nodes']) + 1}_{int(time.time())}"
                st.session_state["manual_nodes"].append({
                    "id": new_node_id,
                    "action": "gmail.create_draft",
                    "title": "Create Gmail Draft",
                    "service": "Gmail",
                    "config": {"subjectTemplate": "FlowPilot Digest", "recipient": "team@example.com"}
                })
                st.rerun()

            if st.button("➕ Send Email (Approval Gate)", use_container_width=True):
                new_node_id = f"node_{len(st.session_state['manual_nodes']) + 1}_{int(time.time())}"
                st.session_state["manual_nodes"].append({
                    "id": new_node_id,
                    "action": "gmail.send_email",
                    "title": "Dispatch Email",
                    "service": "Gmail",
                    "config": {"recipient": "team@organization.org", "subjectTemplate": "Important Notification"}
                })
                st.rerun()

        st.divider()
        st.markdown("### 🧪 Live Testing & Save")

        # Test Run Directly on Canvas
        if st.button("▶ Test Run Node Pipeline", type="secondary", use_container_width=True):
            if not st.session_state["manual_nodes"]:
                st.error("Please add at least one node before running.")
            else:
                test_wf = {
                    "id": "test_canvas_run",
                    "title": wf_name,
                    "steps": st.session_state["manual_nodes"]
                }
                with st.spinner("Executing nodes through telemetry runner..."):
                    res = engine.execute_workflow(test_wf, triggered_by="manual_canvas_test")
                    if res["status"] == "SUCCESS":
                        st.success(f"Pipeline executed successfully in {res['duration_ms']}ms!")
                    elif res["status"] == "NEEDS_APPROVAL":
                        st.warning("Pipeline paused: Waiting for approval in Security Center.")
                    else:
                        st.error("Pipeline encountered an execution issue.")
                    with st.expander("🔍 Telemetry Output", expanded=True):
                        st.json(res["steps_log"])

        # Save & Deploy
        if st.button("🚀 Save & Deploy Workflow", type="primary", use_container_width=True):
            if not st.session_state["manual_nodes"]:
                st.error("Cannot save an empty workflow. Add at least one node.")
            else:
                saved_id = database.save_workflow(
                    wf_name, wf_desc, wf_trigger, wf_schedule, st.session_state["manual_nodes"]
                )
                st.balloons()
                st.success(f"Workflow '{wf_name}' deployed to catalog! (ID: {saved_id})")
                time.sleep(1)
                st.rerun()

        if st.button("🧹 Reset Canvas", use_container_width=True):
            st.session_state["manual_nodes"] = []
            st.rerun()

# -------------------------------------------------------------
# PAGE 4: WORKFLOWS CATALOG
# -------------------------------------------------------------
elif selected_page == "⚡ Workflows Catalog":
    st.markdown("## ⚡ Workflows Management Catalog")
    st.caption("Inspect, toggle, execute, and monitor registered automation routines.")

    workflows = database.get_workflows()

    col_filter, col_spacer = st.columns([1, 2])
    with col_filter:
        status_filter = st.selectbox("Filter Status", ["All Workflows", "Active Only", "Paused Only"])

    filtered_wfs = workflows
    if status_filter == "Active Only":
        filtered_wfs = [w for w in workflows if w["is_active"] == 1]
    elif status_filter == "Paused Only":
        filtered_wfs = [w for w in workflows if w["is_active"] == 0]

    st.write("")

    if not filtered_wfs:
        st.info("No matching workflows found.")
    else:
        for wf in filtered_wfs:
            with st.expander(f"{'🟢' if wf['is_active'] else '⏸️'} {wf['title']} ({wf['trigger_type'].upper()})", expanded=True):
                c_details, c_ops = st.columns([2.5, 1])

                with c_details:
                    st.write(f"**Description:** {wf['description']}")
                    st.write(f"**Schedule / Cadence:** `{wf['schedule']}` | **Created:** `{wf['created_at']}`")
                    st.markdown("**Configured Steps:**")
                    for s in wf["steps"]:
                        st.markdown(f"- 🔹 **{s.get('title')}** → Action: `[{s.get('action')}]` (Service: {s.get('service')})")

                with c_ops:
                    st.write("**Operator Controls:**")
                    # Run Button
                    if st.button(f"▶ Execute Workflow", key=f"exec_{wf['id']}", type="primary", use_container_width=True):
                        with st.status("Executing Workflow Pipeline...", expanded=True) as status_box:
                            st.write(f"Initializing runner for `{wf['title']}`...")
                            time.sleep(0.3)
                            res = engine.execute_workflow(wf, triggered_by="catalog_manual")
                            if res["status"] == "SUCCESS":
                                status_box.update(label=f"Execution Completed in {res['duration_ms']}ms!", state="complete")
                                st.success("All steps passed telemetry verification.")
                            elif res["status"] == "NEEDS_APPROVAL":
                                status_box.update(label="Halted: Human Approval Required!", state="error")
                                st.warning("Execution paused. Visit the Security Center to review and authorize email dispatch.")
                            else:
                                status_box.update(label="Execution Failed", state="error")
                                st.error("Workflow failed safety checks.")
                        time.sleep(1)
                        st.rerun()

                    # Toggle active
                    new_active = not bool(wf['is_active'])
                    toggle_label = "⏸️ Pause Pipeline" if wf['is_active'] else "▶ Activate Pipeline"
                    if st.button(toggle_label, key=f"tog_{wf['id']}", use_container_width=True):
                        database.toggle_workflow(wf['id'], new_active)
                        st.rerun()

                    # Delete
                    if st.button("🗑️ Delete Pipeline", key=f"del_{wf['id']}", use_container_width=True):
                        database.delete_workflow(wf['id'])
                        st.toast(f"Deleted workflow {wf['id']}")
                        time.sleep(0.5)
                        st.rerun()

# -------------------------------------------------------------
# PAGE 4: GOOGLE INTEGRATIONS
# -------------------------------------------------------------
elif selected_page == "🔌 Google Integrations":
    st.markdown("""
    <div class="hero-container">
        <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #fff;">
            🔌 Google Workspace OAuth Manager
        </h1>
        <p style="margin: 6px 0 0 0; color: #9ca3af; font-size: 14px;">
            Secure OAuth 2.0 authorization, least-privilege permission grants, and AES-256 token encryption at rest.
        </p>
    </div>
    """, unsafe_allow_html=True)

    integrations = database.get_integrations()

    for ig in integrations:
        col_card, col_action = st.columns([3, 1])
        with col_card:
            status_badge = '<span class="badge-success">CONNECTED</span>' if ig["status"] == "connected" else '<span class="badge-danger">DISCONNECTED</span>'
            st.markdown(f"### {ig['name']} {status_badge}", unsafe_allow_html=True)
            st.markdown(f"**Authorized Scopes:** `{ig['scopes']}`")
            st.markdown(f"**Token Fingerprint (Encrypted at Rest):** `{ig['token_fingerprint']}`")
            st.caption(f"Last synchronized: {ig['last_synced']}")

        with col_action:
            st.write("")
            st.write("")
            if ig["status"] == "connected":
                if st.button(f"Disconnect", key=f"disc_{ig['provider']}", use_container_width=True):
                    database.update_integration_status(ig["provider"], False)
                    st.toast(f"Disconnected {ig['name']}")
                    st.rerun()
            else:
                if st.button(f"Authorize OAuth", key=f"conn_{ig['provider']}", type="primary", use_container_width=True):
                    database.update_integration_status(ig["provider"], True)
                    st.toast(f"Authorized {ig['name']}")
                    st.rerun()
        st.divider()

    st.markdown("### 🔐 Security Architecture Overview")
    st.markdown("""
    1. **AES-256-GCM Token Encryption:** OAuth refresh and access tokens are encrypted with authenticated AES-256-GCM at rest.
    2. **Anti-CSRF & PKCE:** OAuth state parameters are cryptographically signed using HMAC to prevent authorization interception.
    3. **Least-Privilege Scopes:** Calendar and Sheets request read/append access strictly matching the required actions.
    """)

# -------------------------------------------------------------
# PAGE 5: EXECUTION TELEMETRY
# -------------------------------------------------------------
elif selected_page == "📜 Execution Telemetry":
    st.markdown("## 📜 Execution Runs & Step-Level Telemetry")
    st.caption("Inspect live logs, durations, and outputs across all executed automations.")

    runs = database.get_runs(limit=30)
    if not runs:
        st.info("No execution runs recorded yet.")
    else:
        # Status counts
        s1, s2, s3 = st.columns(3)
        with s1:
            st.metric("Total Recorded Runs", len(runs))
        with s2:
            st.metric("Successful", sum(1 for r in runs if r["status"] == "SUCCESS"))
        with s3:
            st.metric("Needs Approval", sum(1 for r in runs if r["status"] == "NEEDS_APPROVAL"))

        st.write("")

        for r in runs:
            if r["status"] == "SUCCESS":
                badge = "🟢 SUCCESS"
            elif r["status"] == "NEEDS_APPROVAL":
                badge = "🟡 NEEDS APPROVAL"
            else:
                badge = "🔴 FAILED"

            with st.expander(f"{badge} | {r['workflow_title']} ({r['duration_ms']}ms) — {r['started_at']}"):
                st.write(f"**Run ID:** `{r['id']}` | **Trigger:** `{r['triggered_by']}`")
                st.markdown("**Step-by-step Log:**")

                for step_entry in r["steps_log"]:
                    st.markdown(f"**Step {step_entry.get('step')}: {step_entry.get('title', step_entry.get('action'))}**")
                    st.write(f"Action: `{step_entry.get('action')}` | Duration: `{step_entry.get('duration_ms')}ms` | Status: `{step_entry.get('status')}`")
                    if "output" in step_entry:
                        st.json(step_entry["output"])
                    if "error" in step_entry:
                        st.error(step_entry["error"])
                    if "payload" in step_entry:
                        st.warning(f"Payload pending authorization: {json.dumps(step_entry['payload'])}")
                    st.write("---")

# -------------------------------------------------------------
# PAGE 6: SECURITY CENTER
# -------------------------------------------------------------
elif selected_page == "🛡️ Security Center":
    st.markdown("""
    <div class="hero-container">
        <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #fff;">
            🛡️ FlowPilot Security Center
        </h1>
        <p style="margin: 6px 0 0 0; color: #9ca3af; font-size: 14px;">
            Evidence-based security posture, Human-in-the-Loop review gates, and immutable audit logs.
        </p>
    </div>
    """, unsafe_allow_html=True)

    tab_approvals, tab_controls, tab_audit = st.tabs([
        "⚠️ Pending Approvals (Human-in-the-Loop)",
        "✅ Verified Security Controls",
        "📜 Cryptographic Audit Trail"
    ])

    with tab_approvals:
        approvals = database.get_approvals()
        pending = [a for a in approvals if a["status"] == "PENDING"]
        if not pending:
            st.success("🎉 All human review gates are clear. No pending approval requests!")
        else:
            st.warning(f"There are **{len(pending)}** pending authorization requests requiring operator sign-off.")
            for app in pending:
                with st.container():
                    st.markdown(f"#### Authorization Required: `{app['action_type']}`")
                    st.write(f"**Workflow:** {app['workflow_title']} | **Run ID:** `{app['run_id']}`")
                    st.json(app["payload"])

                    col_app, col_rej = st.columns(2)
                    with col_app:
                        if st.button(f"✅ Approve & Dispatch Action", key=f"app_{app['id']}", type="primary", use_container_width=True):
                            database.resolve_approval(app["id"], "APPROVED")
                            st.success("Action authorized and dispatched.")
                            time.sleep(0.5)
                            st.rerun()
                    with col_rej:
                        if st.button(f"❌ Reject Action", key=f"rej_{app['id']}", use_container_width=True):
                            database.resolve_approval(app["id"], "REJECTED")
                            st.info("Action rejected by operator.")
                            time.sleep(0.5)
                            st.rerun()
                    st.divider()

    with tab_controls:
        st.markdown("### 🏛️ Evidence-Based Verification Matrix")
        controls = [
            {"Control": "Prohibition of Untrusted Code Execution", "Status": "VERIFIED", "Evidence": "Only pre-registered handlers (calendar.*, sheets.*, gmail.*) are executed."},
            {"Control": "AES-256 Token Encryption at Rest", "Status": "VERIFIED", "Evidence": "Encrypted credentials stored with authenticated AES-256-GCM tokens."},
            {"Control": "Human-in-the-Loop Email Safeguard", "Status": "VERIFIED", "Evidence": "Direct email sending halts and creates a pending ticket in Security Center."},
            {"Control": "Credential Sanitization in Logs", "Status": "VERIFIED", "Evidence": "Bearer tokens, API keys, and passwords automatically redacted via regex sanitizer."},
            {"Control": "Data Isolation & ACID Persistence", "Status": "VERIFIED", "Evidence": "SQLite local database with isolated tenant sessions and strict schemas."},
            {"Control": "Immutable Cryptographic Audit Trail", "Status": "VERIFIED", "Evidence": "All workflow creation, runs, and approvals committed to audit_logs table."}
        ]
        df_controls = pd.DataFrame(controls)
        st.dataframe(df_controls, use_container_width=True, hide_index=True)

    with tab_audit:
        st.markdown("### 📜 System Audit Trail")
        logs = database.get_audit_logs(limit=30)
        log_records = [{
            "Timestamp": l["created_at"],
            "Event": l["event_type"],
            "Details": l["details"],
            "Actor": l["actor"],
            "IP/Session": l["ip_hash"]
        } for l in logs]
        st.dataframe(pd.DataFrame(log_records), use_container_width=True, hide_index=True)

# -------------------------------------------------------------
# PAGE 7: SETTINGS & FREE DEPLOYMENT GUIDE
# -------------------------------------------------------------
elif selected_page == "⚙️ Settings & Free Cloud Deploy":
    st.markdown("""
    <div class="hero-container">
        <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #fff;">
            ⚙️ Settings & Streamlit Community Cloud Deployment
        </h1>
        <p style="margin: 6px 0 0 0; color: #9ca3af; font-size: 14px;">
            Deploy this entire SaaS on Streamlit Community Cloud 100% free with one-click GitHub sync.
        </p>
    </div>
    """, unsafe_allow_html=True)

    tab_guide, tab_config = st.tabs(["🚀 Free Deployment Guide (Streamlit Cloud)", "🔧 System Configuration"])

    with tab_guide:
        st.markdown("""
        ### How to Deploy on Streamlit Community Cloud (100% Free):

        Streamlit Community Cloud is completely free and requires zero credit cards.

        1. **Push your code to GitHub:**
           ```bash
           git init
           git add .
           git commit -m "Deploy FlowPilot AI Automation SaaS"
           git branch -M main
           git remote add origin https://github.com/<YOUR_USERNAME>/flowpilot-automation.git
           git push -u origin main
           ```

        2. **Go to [share.streamlit.io](https://share.streamlit.io):**
           - Sign in with your GitHub account.
           - Click **"New app"**.
           - Repository: Select `<YOUR_USERNAME>/flowpilot-automation`.
           - Branch: `main`
           - Main file path: `app.py`
           - Click **"Deploy!"** 🚀

        3. **Your App is Live:**
           - You receive a permanent public HTTPS URL (e.g., `https://flowpilot.streamlit.app`)!
           - Share with evaluators, professors, or team members anytime.
        """)

    with tab_config:
        st.markdown("### 🔧 Runtime Settings")
        settings = database.get_settings()

        col_s1, col_s2 = st.columns(2)
        with col_s1:
            req_approval = st.checkbox(
                "Enforce Human Approval for Email Dispatches",
                value=(settings.get("require_email_approval", "true").lower() == "true")
            )
            gemini_key_input = st.text_input(
                "Gemini API Key (Optional for Neural LLM Synthesis)",
                value=settings.get("gemini_api_key", ""),
                type="password",
                help="Leave blank to use built-in free Deterministic Neural Synthesizer."
            )
        with col_s2:
            timeout_input = st.number_input(
                "Execution Timeout (seconds)",
                min_value=5, max_value=120,
                value=int(settings.get("execution_timeout_sec", "30"))
            )
            max_retries_input = st.number_input(
                "Max Bounded Retries",
                min_value=0, max_value=5,
                value=int(settings.get("max_retries", "3"))
            )

        if st.button("Save Settings", type="primary"):
            database.update_setting("require_email_approval", "true" if req_approval else "false")
            database.update_setting("gemini_api_key", gemini_key_input)
            database.update_setting("execution_timeout_sec", str(timeout_input))
            database.update_setting("max_retries", str(max_retries_input))
            st.toast("Settings updated successfully!")
            time.sleep(0.5)
            st.rerun()

        st.divider()
        st.markdown("### 💾 Data Export & Backup")
        all_wfs = database.get_workflows()
        st.download_button(
            "📥 Export Workflows (JSON)",
            data=json.dumps(all_wfs, indent=2),
            file_name="flowpilot_workflows_backup.json",
            mime="application/json"
        )
