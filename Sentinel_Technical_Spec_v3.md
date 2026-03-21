# Sentinel AI Governance Platform: Technical Specification v3.0

## 1. GDL Grammar (EBNF - 10 Rules)
```ebnf
1.  <policy>     ::= <statement> { AND <statement> }
2.  <statement>  ::= <assertion> | <action>
3.  <assertion>  ::= <metric> <operator> <value>
4.  <action>     ::= "ALLOW" | "DENY" | "LOG" | "HALT"
5.  <metric>     ::= "latency" | "bias" | "deception" | "drift"
6.  <operator>   ::= ">" | "<" | "=" | "!="
7.  <value>      ::= <number> | <string> | <boolean>
8.  <number>     ::= [ "-" ] digit { digit } [ "." digit { digit } ]
9.  <string>     ::= "\"" { character } "\""
10. <boolean>    ::= "TRUE" | "FALSE"
```

## 2. Immutable Audit Log (JSON Schema Draft-07)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Sentinel Immutable Log",
  "type": "object",
  "required": ["timestamp", "trace_id", "integrity_hash"],
  "properties": {
    "timestamp": { "type": "string", "format": "date-time" },
    "trace_id": { "type": "string" },
    "event": { "type": "object" },
    "integrity_hash": { "type": "string" }
  },
  "additionalProperties": false
}
```

## 3. Mathematical Appendix: KPI Formulas
*   **Safety ROI:** $ROI_S = \frac{\Delta \text{TailRiskLoss}}{\text{Cost of Sentinel Deployment}}$
*   **Governance Velocity:** $V_G = \frac{\text{Rules Enforced}}{\text{Inference Pass Latency (ms)}}$
