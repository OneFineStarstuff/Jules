# Enterprise AI Agent Interoperability Protocol (EAIP) v1.0–3.0
**Status:** Advanced Technical Standard
**Version Evolution:** 1.0 (Core) | 2.0 (Orchestration) | 3.0 (Autonomous Swarms)

---

## 1. Identity & Security (mTLS / SPIFFE)
- **EAIP 1.0:** SVID-based identity anchoring. Every agent is a SPIFFE workload.
- **EAIP 2.0:** Multi-tier attestation. Agents must prove not just identity, but "Governance State" (e.g., passing a safety score check).
- **EAIP 3.0:** Federated Trust. Secure handoffs across independent enterprise trust domains (e.g., G-SIB to G-SIB).

## 2. Capability Discovery & Routing
- **Protocol:** gRPC reflection + Capability Manifests.
- **Mechanism:** Agents publish a `Manifest.json` to the **Sentinel Discovery Hub**.
- **Governance Metadata:** Every manifest includes "Risk Constraints" (e.g., "This agent cannot process data with a risk score > 0.4").

## 3. Communication Schemas & Governance Metadata
- **EAIP 1.0 (Protobuf):** High-speed binary transport.
- **EAIP 2.0 (RCE):** **Recursive Context Envelope**. Every message carries the full reasoning trace and signed budget constraints.
- **EAIP 3.0 (Epistemic Anchoring):** Every response includes a Merkle-proof linking back to the "Golden Source" of truth in the RAG substrate.

## 4. Auditability & Non-Repudiation
- **Event Mesh:** All EAIP calls are mirrored to a Kafka-based WORM ledger.
- **Post-Hoc Verification:** The "Auditor Agent" can re-play any agent interaction trace to verify policy compliance.

---

## 5. Integration with WorkflowAI Pro & Sentinel v2.4
1.  **WorkflowAI Pro** uses EAIP to delegate tasks to specialist agents.
2.  **Sentinel v2.4** acts as the "Protocol Guard," intercepting EAIP calls to enforce GDL invariants (e.g., blocking an agent from spawning too many sub-agents).
3.  **Handoff Logic:**
    ```python
    # Example EAIP Handoff with Governance Metadata
    handoff_envelope = {
        "intent": "Treasury_Optimization",
        "rce_trace": "0x8f2b...",
        "safety_score": 0.92,
        "token_budget": 5000,
        "pii_redacted": True
    }
    ```
