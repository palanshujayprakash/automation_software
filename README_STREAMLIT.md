# FlowPilot — AI Automation Dashboard SaaS (Streamlit Edition)

A full-featured AI Automation Dashboard SaaS engineered in Python & Streamlit, ready for instant local execution and **100% Free 1-Click Deployment on Streamlit Community Cloud** (zero credit card, zero cloud bills).

---

## 🚀 Live Local URL
When running locally:
```
http://localhost:8501
```

---

## 🏛️ Architecture & Features

| Module | Feature | Implementation |
|---|---|---|
| **📊 Dashboard** | Executive Metrics & Pipeline Status | Live KPI counters (Total Workflows, Active Pipelines, Total Executions, Success Rate, Pending Approvals). |
| **🤖 AI Workflow Builder** | Plain English to Automation DAG | Translates natural language prompts into registered, structured action pipelines. Supports both free offline neural synthesis and Gemini LLM API keys. |
| **🧩 Manual Node Builder** | Visual DAG Canvas & Reordering | Assemble pipelines step-by-step using modular nodes (Calendar, Sheets, Gmail), move nodes up/down, configure parameters, and live-test on canvas. |
| **⚡ Workflows Catalog** | Pipeline Lifecycle Management | Toggle active/paused state, real-time manual trigger with live status logs, pipeline deletion. |
| **🔌 Google Integrations** | OAuth 2.0 Integration Manager | Google Calendar, Google Sheets, and Gmail integration cards with encrypted token fingerprints (`AES-256-GCM`). |
| **📜 Execution Telemetry** | Step-by-Step Telemetry | Detailed execution records, sanitized error redactors (strips API keys and tokens), duration benchmarks in milliseconds. |
| **🛡️ Security Center** | Human-in-the-Loop & Audit Trail | Pending approval queue for sensitive actions (e.g. direct email sending), verified security controls matrix, immutable audit log. |
| **⚙️ Cloud Deploy Guide** | Streamlit Community Cloud Helper | Step-by-step instructions and exportable database backups. |

---

## 💻 How to Run Locally

1. **Activate Python environment & install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Launch Streamlit:**
   ```bash
   streamlit run app.py
   ```
   Open `http://localhost:8501` in your browser.

---

## ☁️ How to Deploy on Streamlit Community Cloud (100% Free)

Streamlit Community Cloud hosts Python Streamlit apps directly from GitHub for free with automated CI/CD and free HTTPS domain (`*.streamlit.app`).

1. **Initialize Git & Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Deploy FlowPilot AI Automation Dashboard SaaS"
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/flowpilot-saas.git
   git push -u origin main
   ```

2. **Deploy on Streamlit Community Cloud:**
   - Go to [share.streamlit.io](https://share.streamlit.io) and sign in with GitHub.
   - Click **"New app"**.
   - Select your repository: `<YOUR_GITHUB_USERNAME>/flowpilot-saas`.
   - Set Branch to `main` and Main file path to `app.py`.
   - Click **"Deploy!"**.

3. **Optional Secret Keys (`.streamlit/secrets.toml`):**
   In the Streamlit Cloud dashboard under App Settings -> Secrets, you can optionally supply:
   ```toml
   gemini_api_key = "AIzaSy..."
   ```
   *(If omitted, FlowPilot seamlessly uses its built-in free Deterministic Neural Synthesizer).*

---

## 🛡️ Security Guardrails
- **No Arbitrary Code Execution:** The runner executes only pre-registered safe action handlers (`calendar.read_events`, `sheets.read_rows`, `sheets.append_row`, `gmail.create_draft`, `gmail.send_email`). Arbitrary shell scripts, raw SQL, or Python `eval()` are strictly forbidden.
- **Human-In-The-Loop Approval:** Destructive actions (like sending outbound emails) halt execution and wait for explicit operator authorization in the Security Center.
- **Credential Redaction:** Automatic regex sanitization prevents credentials or tokens from being saved in execution logs.
