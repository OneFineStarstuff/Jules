# REQ-INTEG-001: Cloud Service Integration Specification
**Architect:** Jules (Senior DevOps Engineer & Systems Architect)
**Status:** Canonical Implementation Guide | **Version:** 1.0.0

---

## 1. GitHub to Project Management (Notion/Jira) Integration

### 1.1 Objective
Synchronize GitHub repository data (Issues, PRs, Comments) with a central project management database to ensure high-velocity engineering oversight.

### 1.2 Implementation Instructions
1.  **Github App Creation:** Create a private GitHub App in your organization. Grant `Read & Write` permissions for Issues and Pull Requests.
2.  **Webhook Configuration:** Configure a webhook in GitHub pointing to your middleware (e.g., GitHub Actions or a Vercel function).
3.  **Middleware Logic:**
    *   On `issues.opened` or `pull_request.opened`: Map GitHub `id`, `title`, `body`, and `html_url` to the target Notion/Jira database schema.
    *   On `issue_comment.created`: Append the comment body to the corresponding record using the GitHub `issue_number` as the key.
4.  **Sync Logic:** Use a debounce strategy for comments to avoid rate-limiting.

### 1.3 Authentication & API
*   **Method:** GitHub Apps (JWT-based) for server-to-server; Notion API (Internal Integration Token).
*   **Documentation:** [GitHub REST API](https://docs.github.com/en/rest), [Notion API Reference](https://developers.notion.com/reference).

---

## 2. Notion to External Service (Google Calendar) Integration

### 2.1 Objective
Two-way synchronization of Notion "Launch Deadlines" with Google Calendar.

### 2.2 Implementation Instructions
1.  **OAuth2 Setup:** Register a project in Google Cloud Console. Enable Google Calendar API.
2.  **Notion Database Polling:** Use a cron-based worker (Cloudflare Workers or GitHub Actions) to poll the Notion database for records where `status == "Scheduled"`.
3.  **Sync Logic:**
    *   **One-way:** Push Notion items to GCal events. Store `gcal_event_id` in a hidden Notion property.
    *   **Two-way:** Check GCal events for updates. If the event `start_time` changes, patch the Notion record using the stored ID.
4.  **Failure Mode:** If the Notion record is deleted, delete the GCal event and log a `REVOCATION` event to the Sentinel audit sink.

---

## 3. Google Drive to Cloud Storage Integration

### 3.1 Objective
Automated transfer and version control of "Sovereign Documents" from Google Drive to an immutable S3/Azure Blob sink.

### 3.2 Implementation Instructions
1.  **Service Account:** Provision a Google Service Account with `Domain-Wide Delegation`.
2.  **Transfer Workflow:**
    *   Trigger: New file in designated "Canonical Vault" folder.
    *   Action: Download file stream -> Calculate SHA-256 hash -> Upload to Azure Blob Storage (using Managed Identity).
    *   Metadata: Tag the blob with the original Google Drive `fileID` and `version`.
3.  **Integrity Check:** Compare the source and destination hashes. If they differ, trigger a **T3 Anomaly** in the Sentinel dashboard.

### 3.3 Authentication & Data Flow
*   **Method:** Google Service Account JWT; Azure Managed Identity.
*   **Data Flow:** `Drive API -> Middleware (Streaming) -> Azure SDK -> Immutable Sink`.

---
**AUTHENTICATION:** Signed by Senior DevOps Engineer Jules.
**STATE:** INTEGRATION GUIDE LOCKED.
