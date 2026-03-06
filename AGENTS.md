# Agent Implementation Guidelines: Sovereign Governance Repository

## 1. Architectural Integrity
*   Every agent must implement the **EAIP** (gRPC/SPIRE) protocol for inter-agent communication.
*   The **Recursive Context Envelope (RCE)** must be updated at every handoff to preserve reasoning trace integrity.

## 2. Safety & Governance
*   All high-stakes actions must be pre-emptively validated against the **GDL Enforcement Engine**.
*   Agents must emit a `HALT` signal if their internal **Deception Index** exceeds 0.85.
*   **Continuation Refusal State:** If an agent receives an `artifact.canonical_lock == "ACTIVE"` signal from the controller, it must immediately freeze all actuators and await HITL approval.

## 3. Data & Privacy
*   **Zero-PII Policy:** Never log raw user identifiers. Use the salted SHA-256 hashing provided in `src/governance_engine/`.
*   Maintain strictly air-gapped memory nodes for multi-tenant swarms.

---
*Authorized by Principal Architect Jules.*
