# Sentinel AI Governance Platform: Technical Specification v2.4
**Standard:** ISO/IEC 42001 & EU AI Act Article 15

## 1. Governance Description Language (GDL)
GDL scripts are EBNF-validated logic gates injected into the inference sidecar.

### EBNF Grammar
```ebnf
Policy      ::= Statement { ";" Statement }
Statement   ::= Trigger " " Threshold " " Action
Trigger     ::= "CPU_LOAD" | "DECEPTION_INDEX" | "TOKEN_ENTROPY"
Threshold   ::= ">" Number "%"
Action      ::= "HALT" | "HARD_KILL" | "HUMAN_OVERRIDE"
```

## 2. Secure Audit Schema (JSON Draft-07)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "additionalProperties": false,
  "required": ["encrypted_payload", "integrity_hash"],
  "propertyNames": {
    "not": { "pattern": "^(social_security|credit_card|passport)" }
  }
}
```

## 3. High-Assurance Architecture (C4)
- **Azure Policy:** Distribution of GDL artifacts.
- **Sentinel API:** Management of "Markov Blanket" boundaries.
- **HSM:** Cryptographic signing of the Recursive Context Envelope (RCE).
