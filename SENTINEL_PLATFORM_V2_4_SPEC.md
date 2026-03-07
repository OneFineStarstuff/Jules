<title>Sentinel AI Governance Platform v2.4: Technical Specification</title>
<abstract>The core technical specification for the Sentinel platform. It mandates gRPC transport, SPIFFE machine identity, and the Governance Description Language (GDL) for deterministic safety gating of autonomous agent swarms.</abstract>
<content>
# 1. API Architecture: gRPC-Sovereign
Sentinel uses high-concurrency, bidirectional gRPC streams to ensure <10ms governance latency.
*   **Transport:** HTTP/2 with mTLS.
*   **Payload:** Protobuf-encoded Recursive Context Envelopes (RCE).

# 2. GDL Enforcement Engine (10 Rules)
1. <governance_rule> ::= <assertion> "THEN" <action>
... [referencing full EBNF in master canon]
</content>
