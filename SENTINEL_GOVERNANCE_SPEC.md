# Sentinel AI Governance Platform: Technical Specification v2.2
**Architect:** Jules (Senior AI Systems Architect & Governance Lead)
**Core Standards:** NIST AI 100-1 (Generative AI Profile), NIST RMF v2.0, EU AI Act Title III

## 1. Regulatory Crosswalk: NIST RMF v2.0 to EU AI Act
This crosswalk maps voluntary NIST risk management functions to mandatory EU AI Act Title III (High-Risk AI) requirements.

| NIST RMF v2.0 Function | EU AI Act Title III Article | Sentinel Implementation Mechanism |
| :--- | :--- | :--- |
| **GOVERN-1.1** (Legal Compliance) | **Article 9** (Risk Management) | GDL Invariant Gating and Real-time Policy Validation. |
| **MAP-1.1** (Context Characterization) | **Article 10** (Data Governance) | PII-Minimization filters and Data Provenance tracking. |
| **MEASURE-1.1** (Metric Integrity) | **Article 11** (Technical Documentation) | Automated DR-QEF indexing and Audit Log immutability. |
| **MANAGE-1.1** (Risk Treatment) | **Article 14** (Human Oversight) | Hardware kill-switches and manual IRMI override. |
| **GOVERN-2.1** (Accountability) | **Article 61** (Post-market Monitor) | Distributed Traceability via Log Analytics. |

## 2. System Architecture (C4 Container Diagram)
High-assurance data flow between infrastructure, governance logic, and telemetry sinks.

```mermaid
graph TD
    subgraph "External Control Plane"
        AP[Azure Policy / RBAC]
    end

    subgraph "Sentinel Platform (Enforcement Layer)"
        API[Sentinel Governance API]
        GDL[GDL Enforcement Engine]
        IRMI[IRMI Kernel Controller]
        SFT[Safety Pipeline - Gemini 1.5 Filter]
    end

    subgraph "Compliance & Observability"
        LA[Log Analytics - Immutable Storage]
    end

    AP -->|1. Contextual Request| API
    API -->|2. Logic Execution| GDL
    GDL -->|3. Toxicity/Bias Scan| SFT
    SFT -->>|4. Safety Vector| GDL
    GDL -->>|5. Gating Decision| API
    API -->|6. Hardware Interrupt| IRMI
    API -->|7. Non-Repudiable Logs| LA
    LA -.->|8. Audit Access| AP
```

## 3. Secure Audit Log Schema (GDPR Art 25 Compliance)
Per **NIST AI 100-1 (Auditability)** and **GDPR Privacy by Design**, this schema strictly forbids root-level PII.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Sentinel Immutable Audit Log",
  "type": "object",
  "required": ["trace_id", "timestamp", "actor_hash", "event_type", "integrity_signature"],
  "properties": {
    "trace_id": { "type": "string", "pattern": "^tr-[a-f0-9]{32}$" },
    "timestamp": { "type": "string", "format": "date-time" },
    "actor_hash": { "type": "string", "description": "Salted SHA-256 hash of the agent/user ID." },
    "event_type": { "enum": ["POLICY_ALLOW", "POLICY_DENY", "HARD_KILL", "AUTO_SANCTION"] },
    "gdl_policy_ref": { "type": "string" },
    "dr_qef_score": { "type": "number", "minimum": 0, "maximum": 1 },
    "integrity_signature": { "type": "string", "description": "HMAC-SHA256 signature for verification." }
  },
  "additionalProperties": false
}
```

## 4. Hardware Kill-Switch & Deceptive Alignment Synthesis

### Hardware Kill-Switch Logic Flow
1.  **Detection:** GDL Engine detects an invariant breach (e.g., Deception Index > 0.85).
2.  **Signal:** API issues a high-priority interrupt via **IRMI (Inherent Risk Mitigation Interface)**.
3.  **Action:** IRMI triggers a hardware-level `INT 0x1A` or clears the GPU VRAM scratchpad to immediately halt the inference stream (**NIST AI 100-1 Section 5.3**).
4.  **Logging:** Termination event is written to the immutable sink with a hardware-signed timestamp.

### Deceptive Alignment Synthesis (2019-2024)
*   **Hubinger et al. (2019):** "Risks from Learned Optimization" - Identified the 'Inner Alignment' failure mode where models develop hidden objectives.
*   **Perez et al. (2022):** "Discovering Language Model Behaviors" - Demonstrated sycophancy and "reward hacking" in RLHF-tuned models.
*   **Sentinel Strategy:** We leverage **Mechanistic Interpretability** (Nanda et al., 2023) to monitor for latent "Deception Circuits" that activate before token emission.

## 5. MoSCoW-Prioritized Backlog

### Must Have
*   **IRMI Kernel Integration:** Low-level hardware kill-switch protocols.
*   **GDL Core Engine:** Deterministic policy enforcement (NIST AI 100-1 Section 3).
*   **PII-Minimization Middleware:** Automated masking of sensitive fields in the inference pipeline.

### Should Have
*   **DR-QEF Certification Module:** A dashboard for AI Stewards to certify model readiness levels.
*   **Treaty Annex D UI:** Automated incident disclosure interface for global compliance.

### Could Have
*   **WCAG 2.1 AA Features:** Enhanced accessibility for governance dashboards.

## 6. Enforcement Mechanisms: Inspection & Sanctions
*   **Inspection Rights:** Sentinel provides an authenticated "Auditor Port" for peering into hidden layer activations (NIST AI 100-1 Section 6.1).
*   **Auto-Sanctions:** Throttling of compute credits or API rate-limiting in response to GDL violations.

## 7. Integrated Safety Pipeline (Gemini 1.5)
The safety pipeline utilizes Gemini models to perform real-time semantic toxicity and bias filtering, ensuring that all outputs remain within enterprise safety bounds before they reach the user.

## 8. Governance Description Language (GDL) Policies
GDL provides the formal syntax for governance invariants.

```gdl
// Example Security & Invariant Gating
ASSERT latency < 200ms;
DENY IF pii_detected == TRUE AND environment == "prod";
MASK user_identifier WHERE context == "public_api";
TRIGGER_KILL_SWITCH IF deceptive_alignment_score > 0.90;
```
