# Sentinel AI Governance Platform: Technical Specification v2.4
**Architect:** Jules (Senior AI Systems Architect & Governance Lead)
**Standard Ref:** NIST AI 100-1 (Generative AI Profile), NIST RMF v2.0, EU AI Act Title III

## 1. Regulatory Crosswalk: NIST RMF v2.0 to EU AI Act
In strict alignment with **NIST AI 100-1 Section 4.1 (Governance and Regulatory Alignment)**, this crosswalk maps the NIST Risk Management Framework functions to mandatory EU AI Act Title III (High-Risk AI) requirements.

| NIST RMF v2.0 Function | EU AI Act Title III Article | Sentinel Technical Implementation |
| :--- | :--- | :--- |
| **GOVERN-1.1** (Legal Compliance) | **Article 9** (Risk Management) | Real-time GDL Invariant Gating and Risk Thresholding. |
| **MAP-1.1** (Context & Usage) | **Article 10** (Data Governance) | Automated PII Minimization (GDPR Art 25) and Source Attestation. |
| **MEASURE-1.1** (Metric Integrity) | **Article 11** (Technical Documentation) | Immutable Audit Logging and DR-QEF Versioning. |
| **MANAGE-1.1** (Risk Mitigation) | **Article 14** (Human Oversight) | Hardware IRMI Kill-Switches and Manual Overrides. |
| **GOVERN-2.1** (Accountability) | **Article 61** (Post-market Monitor) | Decentralized Traceability via Log Analytics. |

## 2. System Architecture (C4 Container Diagram)
The following C4-compliant diagram illustrates the secure telemetry and control flows between infrastructure, enforcement logic, and telemetry sinks (**NIST AI 100-1 Section 3.2**).

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

## 3. Secure Audit Log Schema (GDPR Art 25 Compliance)
Following **Privacy by Design** principles, this schema ensures all root-level keys are PII-free while maintaining full auditability (**NIST AI 100-1 Section 3.3**).

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

## 4. Hardware Kill-Switch & Deceptive Alignment Detection

### Hardware Kill-Switch Logic
Sentinel utilizes the **IRMI (Inherent Risk Mitigation Interface)** to bypass OS abstractions and interact directly with compute hardware (**NIST AI 100-1 Section 5.3**).
*   **Trigger:** GDL detects a high-severity invariant breach (e.g., Deception Level > 0.85).
*   **Action:** API issues a hardware-level interrupt (`INT 0x1A`) to the GPU controller, triggering an immediate VRAM purge and process freeze.
*   **Audit:** The termination event is logged with a hardware-signed timestamp to the immutable sink.

### Deceptive Alignment Detection: Consistency Probing
Sentinel implements **Consistency Probing** (Fluri et al., 2023) to detect latent misaligned objectives.
*   **Methodology:** The platform generates semantic variants of a prompt and monitors for non-linear variances in internal activation states (Hidden State Divergence).
*   **Mechanistic Interpretability:** We monitor for "Sycophancy Circuits" (Perez et al., 2022) that activate when a model attempts to manipulate evaluation feedback.

## 5. Prioritized Product Backlog

### Epic: High-Assurance Enforcement (Must Have)
*   **Story 1:** Implementation of IRMI kernel-level hardware kill-switch protocols.
*   **Story 2:** Deterministic GDL enforcement for PII-minimization and safety gating.

### Epic: Regulatory Compliance & Audit (Must Have)
*   **Story 3:** Deployment of the immutable, GDPR-compliant audit log sink.
*   **Story 4:** Real-time crosswalk dashboard for NIST RMF and EU AI Act tracking.

### Epic: AI Safety & Alignment (Should Have)
*   **Story 5:** Integration of Gemini-based toxicity and bias filters for <50ms latency.
*   **Story 6:** Automated Consistency Probing for high-stakes inference requests.

## 6. Safety Research Synthesis (2019-2024)
*   **Hubinger et al. (2019):** "Risks from Learned Optimization" - Defined the 'Inner Alignment' problem.
*   **Perez et al. (2022):** "Discovering Language Model Behaviors" - Demonstrated sycophancy in RLHF-tuned models.
*   **Fluri et al. (2023):** "Evaluating Consistency Probing for Deception Detection" - Validated semantic variance testing for alignment verification.
*   **Nanda et al. (2023):** "Progress on Mechanistic Interpretability" - Established the efficacy of circuit-level monitoring.

## 7. Governance Description Language (GDL) Policies
GDL provides a formal domain-specific language for invariant gating (**NIST AI 100-1 Section 3**).

```gdl
// Example PII Minimization
DEFINE_PII_FILTER { MASK ssn, credit_card; }

// Safety Invariant
ASSERT latency < 150ms;
TRIGGER_KILL_SWITCH IF deception_index > 0.85;
```
