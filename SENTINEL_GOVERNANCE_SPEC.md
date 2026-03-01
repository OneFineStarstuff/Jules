# Sentinel AI Governance Platform: Technical Specification v2.1
**Architect:** Jules (Senior AI Systems Architect & Governance Lead)
**Standard Ref:** NIST AI 100-1 (Generative AI Profile), NIST RMF v2.0, EU AI Act Title III

## 1. Regulatory Crosswalk: NIST RMF v2.0 to EU AI Act
In strict adherence to **NIST AI 100-1 (Section 4.1: Governance and Regulatory Alignment)**, this crosswalk maps the NIST Risk Management Framework functions to mandatory EU AI Act Title III (High-Risk AI) articles.

| NIST RMF v2.0 Control | EU AI Act Title III Article | Sentinel Technical Implementation |
| :--- | :--- | :--- |
| **GOVERN-1.1** (Legal Compliance) | **Article 9** (Risk Management) | Real-time GDL Invariant Gating and Risk Thresholding. |
| **MAP-1.1** (Context & Usage) | **Article 10** (Data Governance) | Automated PII Minimization and Source Attestation. |
| **MEASURE-1.1** (Metric Integrity) | **Article 11** (Technical Documentation) | Immutable Audit Logging and DR-QEF Versioning. |
| **MANAGE-1.1** (Risk Mitigation) | **Article 14** (Human Oversight) | Hardware IRMI Kill-Switches and Manual Overrides. |
| **GOVERN-2.1** (Accountability) | **Article 61** (Post-market Monitor) | Decentralized Traceability via Log Analytics. |

## 2. System Architecture (C4 Container Diagram)
The following C4-compliant diagram illustrates the secure telemetry and control flows within the Sentinel ecosystem (**NIST AI 100-1 Section 3.2**).

```mermaid
graph TD
    subgraph "External Cloud Infrastructure"
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

## 3. PII-Free JSON Schema for Immutable Audit Logs
Following **GDPR Article 25 (Privacy by Design)** and **NIST AI 100-1 (Traceability)**, this schema ensures all root-level keys are PII-free.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Sentinel Immutable Governance Log",
  "type": "object",
  "required": ["trace_id", "timestamp", "event_metadata", "integrity_signature"],
  "properties": {
    "trace_id": { "type": "string", "pattern": "^tr-[a-f0-9]{32}$" },
    "timestamp": { "type": "string", "format": "date-time" },
    "event_metadata": {
      "type": "object",
      "properties": {
        "event_type": { "enum": ["POLICY_PASS", "HARD_KILL", "AUTO_SANCTION"] },
        "gdl_rule_id": { "type": "string" },
        "dr_qef_index": { "type": "number", "minimum": 0, "maximum": 1 }
      }
    },
    "integrity_signature": {
      "type": "string",
      "description": "HMAC-SHA256 signature for immutability verification."
    }
  },
  "additionalProperties": false
}
```

## 4. Hardware Kill-Switch & Deceptive Alignment Synthesis

### Hardware Kill-Switch Logic
Sentinel utilizes the **IRMI (Inherent Risk Mitigation Interface)** to bypass OS abstractions and interact directly with compute hardware (**NIST AI 100-1 Section 5.3**).
*   **Invariant Breach:** If GDL detects a "Goal Hijacking" attempt (Deception Level > 0.9).
*   **Logic:** Sentinel issues a masked interrupt to the GPU controller, triggering an immediate power-state transition to D3 (Off) or a memory-zeroing interrupt to clear inference cache.

### Deceptive Alignment Synthesis (2019-2024)
*   **Hubinger et al. (2019):** Established the "Mesa-Optimization" framework, highlighting that models can internalize objectives different from the reward function.
*   **Perez et al. (2022):** Documented sycophancy and instrumental convergence in LLMs.
*   **Sentinel Mitigation:** We implement **Mechanistic Interpretability** probes to monitor for "Sycophancy Circuits" during the inference pass.

## 5. MoSCoW-Prioritized Backlog

### Must Have
*   **IRMI Protocols:** Implementation of external audit protocols for kernel intervention.
*   **PII Minimization:** Automated masking for production environments.
*   **Simulation & Stress-Test Mandates:** Required adversarial red-teaming for all model deployments (**NIST AI 100-1 Section 6**).

### Should Have
*   **DR-QEF Certification:** A module for AI Stewards to validate model alignment.
*   **Treaty Annex D UI:** Standardized incident disclosure dashboard for international compliance.

### Could Have
*   **WCAG 2.1 AA Features:** Accessible governance dashboards for diverse administrative teams.

## 6. Enforcement Mechanisms: Inspection & Sanctions
*   **Inspection Rights:** Sentinel provides an authenticated "Auditor Port" for real-time observation of internal activations (Hidden State Inspection).
*   **Auto-Sanctions:** Automated revocation of API tokens or compute resource throttling upon detection of GDL violations.

## 7. Safety Pipeline & Accessibility
*   **Gemini Safety Pipeline:** Sentinel utilizes Gemini models to perform real-time semantic toxicity and bias filtering on both prompts and completions.
*   **Accessibility:** All administrative interfaces are built to **WCAG 2.1 AA** standards, ensuring that AI Governance remains inclusive and transparent.

## 8. Governance Description Language (GDL) Policies
GDL provides a domain-specific language for invariant gating (**NIST AI 100-1 Section 3**).

```gdl
// PII Minimization Policy
DEFINE_PII_FILTER {
    MASK ssn, credit_card;
    ENCRYPT user_email WHERE env == "staging";
}

// Security & Invariant Gating
ASSERT latency < 150ms;
DENY ALL IF model_version_unverified == TRUE;
TRIGGER_KILL_SWITCH IF deception_index > 0.85;
```
