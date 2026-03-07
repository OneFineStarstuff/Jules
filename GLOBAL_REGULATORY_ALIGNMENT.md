# Phase 3: Global Regulatory Alignment & Compliance

## 1. Jurisdictional Mapping (G-SIFI Context)
| Region | Authority | Key Focus | Alignment Protocol |
| :--- | :--- | :--- | :--- |
| **EU** | AI Act | High-Risk Categorization | Art 15: Robustness & Accuracy |
| **UK** | PRA / FCA | Operational Resilience | SMCR (Individual Accountability) |
| **APAC** | MAS / HKMA | Ethical AI (FEAT) | Consumer Duty & Fair Outcome |
| **US** | NIST / EO 14110 | Safety Standards | Red-Teaming & Compute Limits |

## 2. Governance Description Language (GDL)
GDL is a domain-specific formal grammar used to encode safety policies into machine-executable logic gates.

### 2.1 EBNF Grammar
```ebnf
Policy      ::= Statement { ";" Statement }
Statement   ::= Trigger " " Threshold " " Action
Trigger     ::= "CPU_SPIKE" | "MEM_LEAK" | "LATENCY_H" | "GOAL_DRIFT"
Threshold   ::= Operator Value
Operator    ::= ">" | "<" | "="
Value       ::= Number Unit
Unit        ::= "%" | "ms" | "GB" | "bits"
Action      ::= "HALT" | "OVERRIDE" | "KILL_SWITCH"
```

### 2.2 Formal Derivation
A valid GDL policy string: `CPU_SPIKE >90% KILL_SWITCH; LATENCY_H >500ms HALT`
- **Derivation:** `Statement -> Trigger Threshold Action -> CPU_SPIKE >90% KILL_SWITCH`

## 3. Secure Audit Schema (JSON)
Audit logs are stored in a WORM (Write Once Read Many) substrate to prevent tampering.
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Sentinel Audit Log",
  "type": "object",
  "properties": {
    "timestamp": { "type": "string", "format": "date-time" },
    "auditor_id": { "type": "string" },
    "event_type": { "enum": ["ENFORCEMENT", "HANDOFF", "GOAL_VALIDATION"] },
    "payload": {
      "type": "object",
      "properties": {
        "metric": { "type": "string" },
        "action_taken": { "type": "string" }
      }
    },
    "signature": { "type": "string", "description": "ED25519 hash of the log entry" }
  },
  "required": ["timestamp", "event_type", "signature"]
}
```

## 4. Consumer Duty & Supervisory Alignment
The FCA Consumer Duty (v2023) is mapped to EU AI Act High-Risk principles to ensure that agentic "dark patterns" are prevented at the kernel level.
- **Outcome 1:** Monitoring for "Differential Pricing" via agentic profiling.
- **Outcome 2:** Mandatory human-override for all retail lending decisions.
