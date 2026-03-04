# Security Audit Blueprints: High-Confidentiality Banking

### 1. Node.js (Gateway & API)
*   **Audit Scope:** JWT token validation, mTLS enforcement.
*   **Vulnerability:** Insecure deserialization.
*   **Requirement:** Mandatory use of `SPIFFE` for machine identity.

### 2. Python (Kafka & Data Science)
*   **Audit Scope:** Offset commit logic, PII masking.
*   **Requirement:** Kafka streams must be encrypted with TLS 1.3.

### 3. Docker Swarm & Bash
*   **Audit Scope:** Container breakout risk.
*   **Requirement:** Rootless mode; restricted syscalls via `seccomp`.

---
*Mapped to NIST 800-53 Rev. 5 & GDPR.*
