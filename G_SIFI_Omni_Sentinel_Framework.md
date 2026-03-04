# Omni-Sentinel AI Compliance & Governance Framework (G-SIFI)
**Status:** Board-Approved Baseline
**Regulators:** PRA, FCA, MAS, HKMA, EU AI Act

## 1. Compliance Mandate
The G-SIFI operates under a "Zero-Trust Reasoning" model. No AI output is accepted for financial execution unless verified by the Omni-Sentinel safety pipeline.

## 2. Human Oversight (EU AI Act Article 14)
*   **Verification:** All high-delta credit and trading decisions require a dual-sig human-in-the-loop (HITL) gate.
*   **Intervention:** GDL logic permits immediate human override via the IRMI "Emergency Stop" dashboard.

## 3. Operational Risk (Basel III)
*   **Resilience:** Agents are deployed in isolated Kubernetes pods with strict NetworkPolicies.
*   **Auditability:** Every decision trace is hashed and written to the Immutable Audit Sink (Log Analytics).

## 4. Global Governance (HKMA/MAS alignment)
Omni-Sentinel synchronizes multi-jurisdictional rules. HKMA fair lending rules are enforced concurrently with MAS explainability requirements using GDL context-tags.
