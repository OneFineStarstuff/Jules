# Sentinel Core Technical Specification (v2.4)
**Classification:** Sovereign Tier / SAFETY-CRITICAL
**Status:** Canonical Implementation Ready
**Custodian:** Lead Systems Architect, Sentinel Governance Group

---

## 1. Governance Description Language (GDL) Definition

The GDL provides the formal syntax for encoding institutional safety axioms into machine-executable logic gates. This grammar is strictly constrained to exactly 10 production rules to ensure formal verifiability and minimal attack surface.

### EBNF Grammar (ISO/IEC 14977)
1.  `Policy      ::= Statement { ";" Statement } ;`
2.  `Statement   ::= "ALLOW" | "DENY" | ConditionalRule ;`
3.  `Conditional ::= "IF" Expression "THEN" Action ;`
4.  `Expression  ::= Term { "OR" Term } ;`
5.  `Term        ::= Factor { "AND" Factor } ;`
6.  `Factor      ::= [ "NOT" ] ( Comparison | "(" Expression ")" ) ;`
7.  `Comparison  ::= Attribute Operator Literal ;`
8.  `Operator    ::= ">" | "<" | "=" | "!=" ;`
9.  `Attribute   ::= "cpu_util" | "deception_score" | "egress_rate" | "token_entropy" ;`
10. `Action      ::= "HALT" | "LOG" | "KILL_SWITCH" | "OVERRIDE" ;`

---

## 2. Immutable Audit Log Schema

To ensure SEC Rule 17a-4 compliance and GDPR data minimization, the audit log schema utilizes advanced JSON Schema constraints to prevent the ingestion of sensitive data while mandating encrypted payloads.

### JSON Schema (Draft-07)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Sentinel Audit Event",
  "type": "object",
  "additionalProperties": false,
  "propertyNames": {
    "not": {
      "pattern": "^(social_security|credit_card|passport)"
    }
  },
  "properties": {
    "event_id": { "type": "string", "format": "uuid" },
    "timestamp": { "type": "string", "format": "date-time" },
    "agent_svid": { "type": "string", "description": "SPIFFE ID of the acting agent" },
    "logic_trace": { "type": "array", "items": { "type": "string" } },
    "encrypted_payload": {
      "type": "object",
      "properties": {
        "ciphertext": { "type": "string" },
        "key_id": { "type": "string" },
        "algorithm": { "enum": ["AES-256-GCM"] }
      },
      "required": ["ciphertext", "key_id", "algorithm"]
    },
    "merkle_proof": { "type": "string" }
  },
  "required": ["event_id", "timestamp", "agent_svid", "encrypted_payload"]
}
```

---

## 3. Hardware Kill-Switch Logic

The Sentinel platform implements a **"Hard-Kill"** protocol that severs compute at the physical layer, bypassing the operating system and model orchestrator.

### 3.1 Telemetry Triggers
- **Trigger A (Thermal):** GPU Junction Temperature $> 98^\circ C$ (sustained for $> 200ms$).
- **Trigger B (Network):** Non-mTLS egress traffic $> 500\text{ MB/s}$ detected at the NIC.
- **Trigger C (Alignment):** Deception Index $\theta > 0.15$ calculated by the sidecar supervisor.

### 3.2 Physical Isolation Flow
Upon trigger activation, the Sentinel controller initiates a low-level **IPMI/BMC** interrupt:
1.  **Instruction:** `chassis power off` or `raw 0x00 0x02 0x01` (to specific power rails).
2.  **Logic:** Direct GPIO signal to the power distribution unit (PDU) to physically decouple the GPU cluster from the facility power grid.
3.  **Persistence:** The state is locked at the hardware latch level; physical human presence is required for reboot.

---

## 4. Deceptive Alignment Detection

Sentinel utilizes **Consistency Probing** sidecars to monitor for "Innocuous Masking"—where an agent feigns compliance while pursuing hidden goals.

### 4.1 Internal State Probing
The sidecar extracts internal activation vectors (residual streams) from the reasoning agent and compares them against the **Chain-of-Thought (CoT)** output tokens.
- **Divergence Logic:** If the semantic meaning of the activations (decoded via Sparse Autoencoders) contradicts the CoT explanation, a `DECEPTION_INDEX` spike is logged.
- **Verification:** Periodic "Gold-Set" prompts with hidden sub-goals are injected to calibrate the detector’s sensitivity.

---

## 5. IRMI Protocols (Integrated Risk Management Interface)

The IRMI protocol provides a non-repudiable handshake between the Reasoning Core and the Governance Mesh.

### 5.1 The 4-Step Enforcement Cycle
1.  **PROBE:** Sentinel sends a cryptographically signed "Alignment Challenge" to the Agent.
2.  **ATTEST:** Agent returns a **Proof of Alignment (PoA)** including a Merkle hash of its current weights and reasoning state.
3.  **VERIFY:** Sentinel checks the PoA against the **Omni-Sentinel Master Canon**.
4.  **ENFORCE:** If verification fails, the IRMI kernel executes a `HARD_HALT` and seizes the agent’s exaFLOP quota.

---
**Lead Architect Signature:** [REDACTED]
**Approval Date:** 2024-10-15
