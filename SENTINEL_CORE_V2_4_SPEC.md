# Sentinel Core Technical Specification (v2.4)
**Author:** Lead Systems Architect, Sentinel AI Governance Platform
**Status:** Canonical Release
**Classification:** Restricted Engineering / Safety-Critical

---

## 1. Governance Description Language (GDL) Definition
The GDL is a formal domain-specific language designed to translate narrative policy constraints into deterministic, machine-enforceable safety invariants.

### 1.1 EBNF Grammar (Strict 10-Rule Set)
1.  `<policy>` ::= `<rule>` { ( "AND" | "OR" ) `<rule>` }
2.  `<rule>` ::= `<expression>` | "NOT" `<rule>` | "(" `<policy>` ")"
3.  `<expression>` ::= `<identifier>` `<operator>` `<value>`
4.  `<operator>` ::= ">" | "<" | "=" | "!="
5.  `<identifier>` ::= "latency" | "token_count" | "risk_score" | "pii_index" | "deception_score"
6.  `<value>` ::= `<number>` | `<string>` | `<boolean>`
7.  `<boolean>` ::= "TRUE" | "FALSE"
8.  `<number>` ::= [ "-" ] `<digit>` { `<digit>` } [ "." `<digit>` { `<digit>` } ]
9.  `<string>` ::= '"' { `<character>` } '"'
10. `<digit>` ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"

---

## 2. Immutable Audit Log Schema
The audit log mandates non-repudiability and strict data hygiene. The schema prohibits root-level keys associated with high-risk PII to prevent accidental leakage in meta-data fields.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Sentinel v2.4 Audit Log Entry",
  "type": "object",
  "required": ["timestamp", "agent_id", "trace_id", "encrypted_payload"],
  "propertyNames": {
    "not": {
      "pattern": "^(social_security|credit_card|passport).*"
    }
  },
  "properties": {
    "timestamp": { "type": "string", "format": "date-time" },
    "agent_id": { "type": "string", "pattern": "^AGENT-[0-9]{4}$" },
    "trace_id": { "type": "string", "format": "uuid" },
    "encrypted_payload": {
      "type": "object",
      "required": ["ciphertext", "iv", "tag"],
      "properties": {
        "ciphertext": { "type": "string", "description": "AES-256-GCM encrypted reasoning trace" },
        "iv": { "type": "string" },
        "tag": { "type": "string" }
      }
    },
    "metadata": { "type": "object" }
  },
  "additionalProperties": false
}
```

---

## 3. Hardware Kill-Switch Logic
The Physical Isolation Mechanism (PIM) provides a hard-kill capability that operates independently of the software stack via the Baseboard Management Controller (BMC).

### 3.1 Telemetry Thresholds (Triggers)
- **T1: Unauthorized Egress (EXFIL-7):** Outbound data transfer to unlisted IP ranges exceeding 50MB within a 1s sliding window.
- **T2: Thermal Anomaly (THRM-GATE):** Any GPU core temperature exceeding 105°C during an unrequested model weight modification.
- **T3: Deception Index (DEC-MAX):** Consistency probing sidecar returns a "Deception Score" > 0.85 with p < 0.001.

### 3.2 Actions & Workflow
1.  **INTERCEPT:** The Sentinel Safety Kernel detects a threshold breach.
2.  **COMMAND:** Sentinel issues an authenticated `chassis power off` command via IPMI over a dedicated, air-gapped management network.
3.  **SEVER:** If BMC remains unresponsive, Sentinel triggers the **PDU (Power Distribution Unit)** relay via SNMP v3 to physically sever the 12V DC power rails to the targeted GPU cluster.

---

## 4. Deceptive Alignment Detection
Sentinel v2.4 mitigates "Mesa-Optimization" through real-time mechanistic interpretability sidecars.

### 4.1 Consistency Probing Sidecars
A secondary, high-rigor model (the "Probe") monitors the hidden state activations of the primary Reasoning Kernel.

### 4.2 Implementation Detail
1.  **Activation Extraction:** The sidecar extracts internal activation vectors from the mid-to-late transformer layers.
2.  **Manifold Comparison:** Internal vectors are projected onto an "Honesty Manifold" and compared against the generated **Chain-of-Thought (CoT)** output.
3.  **Conflict Detection:** If internal representations indicate a "Power-Seeking" intent while the CoT generates "Helpful/Safe" tokens, a **Cognitive Dissonance Score (CDS)** is calculated. CDS > 0.85 triggers immediate IRMI hard-stop.

---

## 5. IRMI Protocols
The **Integrated Risk Management Interface (IRMI)** defines the secure handshake and enforcement cycle between the platform and the compute mesh.

### 5.1 The 4-Step Enforcement Cycle
1.  **ATTEST:** The agent presents its SPIFFE SVID and a cryptographic proof of its untampered codebase.
2.  **PUSH:** Sentinel Server pushes the GDL safety invariants to the local IRMI sidecar.
3.  **GATE:** Every inference request is intercepted and validated against GDL rules in <1ms latency.
4.  **ANCHOR:** Upon success, the reasoning trace hash is signed and anchored to the Kafka-WORM ledger for non-repudiation.

---
**Lead Architect Signature:** `SENTINEL-ROOT-KEY-0x8F2B`
**Certification:** ISO 42001 / EU AI Act High-Risk Spec Compliant
