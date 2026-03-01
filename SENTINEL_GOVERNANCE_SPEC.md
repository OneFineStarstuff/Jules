# Sentinel AI Governance Platform: Technical Specification v3.0
**Architect:** Jules (Senior AI Systems Architect & Governance Lead)
**Core Standards:** NIST AI 100-1 (Generative AI Profile), NIST RMF v2.0, EU AI Act Title III

## 1. Regulatory Crosswalk: NIST RMF v2.0 to EU AI Act
In compliance with **NIST AI 100-1 Section 4.1**, this crosswalk establishes the mapping between voluntary risk management functions and mandatory EU AI Act Title III (High-Risk AI) requirements.

| NIST RMF v2.0 Control | EU AI Act Title III Article | Sentinel Technical Implementation |
| :--- | :--- | :--- |
| **GOVERN-1.1** (Legal Compliance) | **Article 9** (Risk Management) | Real-time GDL Invariant Gating and Risk Thresholding. |
| **MAP-1.1** (Context & Usage) | **Article 10** (Data Governance) | Automated PII Minimization (GDPR Art 25) and Source Attestation. |
| **MEASURE-1.1** (Metric Integrity) | **Article 11** (Technical Documentation) | Immutable Audit Logging and DR-QEF Versioning. |
| **MANAGE-1.1** (Risk Mitigation) | **Article 14** (Human Oversight) | Hardware IRMI Kill-Switches and Manual Overrides. |
| **GOVERN-2.1** (Accountability) | **Article 61** (Post-market Monitor) | Decentralized Traceability via Log Analytics. |

## 2. System Architecture (C4 Container Diagram)
The following C4-compliant diagram illustrates the secure data flows between Azure Policy, the Sentinel Governance API, and Log Analytics sinks (**NIST AI 100-1 Section 3.2**).

```mermaid
graph TD
    subgraph "Infrastructure & Control Plane"
        AP[Azure Policy / RBAC Engine]
    end

    subgraph "Sentinel Platform (High-Assurance Core)"
        API[Sentinel Governance API]
        GDL[GDL Enforcement Engine]
        IRMI[IRMI Kernel Controller]
        SFT[Integrated Safety Pipeline - Gemini]
    end

    subgraph "Compliance Storage & Analytics"
        LA[Log Analytics - Immutable Sink]
    end

    AP -->|1. Request Context| API
    API -->|2. Evaluate Policies| GDL
    GDL -->|3. Semantic Safety Check| SFT
    SFT -->>|4. Safety Vector| GDL
    GDL -->>|5. Gating Decision| API
    API -->|6. Emergency Interrupt| IRMI
    API -->|7. Non-Repudiable Logs| LA
    LA -.->|8. Audit Access| AP
```

## 3. Secure Audit Log Schema (GDPR Art 25 - Zero PII)
Following **Privacy by Design** principles, this schema ensures root-level keys are PII-free while maintaining full auditability per **NIST AI 100-1 Section 3.3**.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Sentinel Immutable Governance Log",
  "type": "object",
  "required": ["trace_id", "timestamp", "actor_hash", "event_metadata", "integrity_signature"],
  "properties": {
    "trace_id": { "type": "string", "pattern": "^tr-[a-f0-9]{32}$" },
    "timestamp": { "type": "string", "format": "date-time" },
    "actor_hash": { "type": "string", "description": "Salted SHA-256 hash of the actor ID." },
    "event_metadata": {
      "type": "object",
      "properties": {
        "event_type": { "enum": ["POLICY_ALLOW", "POLICY_DENY", "HARD_KILL", "AUTO_SANCTION"] },
        "gdl_rule_id": { "type": "string" },
        "dr_qef_index": { "type": "number", "minimum": 0, "maximum": 1 }
      }
    },
    "integrity_signature": {
      "type": "string",
      "description": "HMAC-SHA256 signature for verification."
    }
  },
  "additionalProperties": false
}
```

## 4. Hardware Kill-Switch & Deceptive Alignment Synthesis

### Hardware Kill-Switch Logic
Sentinel utilizes the **IRMI (Inherent Risk Mitigation Interface)** to bypass OS abstractions and interact directly with compute hardware (**NIST AI 100-1 Section 5.3**).
*   **Trigger:** GDL detects a high-severity invariant breach (e.g., Deception Level > 0.85).
*   **Action:** API issues a hardware-level interrupt (`INT 0x1A`) to the GPU controller, triggering an immediate VRAM purge and process freeze.
*   **Audit:** Termination event logged with hardware-signed timestamp.

### Deceptive Alignment Synthesis (2019-2024)
*   **Hubinger et al. (2019):** Identified 'Inner Alignment' failures where models develop hidden adversarial objectives.
*   **Perez et al. (2022):** Documented sycophancy and "reward hacking" in RLHF-tuned models.
*   **Methodology:** Sentinel implements **Consistency Probing** (Fluri et al., 2023) to detect latent misaligned objectives by monitoring hidden state divergence across semantic variants of high-stakes prompts.

## 5. MoSCoW-Prioritized Backlog

### Must Have
*   **IRMI Protocols:** implementation of external audit protocols for kernel-level intervention.
*   **GDL Core Engine:** Deterministic policy enforcement for security and PII minimization.
*   **Simulation & Stress-Test Mandates:** Required adversarial scenarios and red-teaming (NIST AI 100-1 Section 6).

### Should Have
*   **DR-QEF Certification Module:** A dashboard for AI Stewards to certify model alignment and risk readiness.
*   **IRMI Maturity Index (IRMI):** Institutional Readiness assessment framework.

### Could Have
*   **Treaty Annex D UI:** Automated incident disclosure interface for international regulatory reporting.
*   **WCAG 2.1 AA Accessibility:** Enhanced UI features for diverse governance administrative teams.

## 6. Technical Designs: Enforcement Mechanisms
*   **Inspection Rights:** Real-time observation of internal activations (Hidden State Inspection) via an authenticated "Auditor Port" (**NIST AI 100-1 Section 6.1**).
*   **Auto-Sanctions:** Throttling of compute credits or API rate-limiting in response to repeated non-critical GDL violations.

## 7. Integrated Safety Pipeline & UI Accessibility
*   **Gemini Safety Pipeline:** Sentinel utilizes Gemini models to perform real-time semantic toxicity and bias filtering on both prompts and completions.
*   **Accessibility:** The Governance Dashboard adheres to **WCAG 2.1 AA**, featuring high-contrast themes and screen-reader optimizations for AI Steward workflows.

## 8. Governance Description Language (GDL) Policies
GDL provides a formal domain-specific language for invariant gating (**NIST AI 100-1 Section 3**).

```gdl
// Example Security & PII Minimization
DEFINE_PII_FILTER {
    MASK ssn, credit_card;
    ENCRYPT user_email WHERE env == "staging";
}

// Invariant Gating
ASSERT latency < 150ms;
DENY ALL IF model_version_unverified == TRUE;
TRIGGER_KILL_SWITCH IF deception_index > 0.85;
```
