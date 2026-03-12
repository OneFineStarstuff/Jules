# Engineering Directives: Sentinel & AI-OS Development

## Protocol Standards
- **Transport:** All inter-service communication MUST use gRPC with mTLS. SPIFFE IDs are mandatory.
- **Audit Logs:** Never log PII. Use the `hash_pii()` utility (Salted SHA-256) for any sensitive identifiers.
- **Governance:** Every new API endpoint MUST be registered with the Sentinel v2.4 Sidecar for GDL policy enforcement.

## Frontend Directives
- **Performance:** P99 Interaction Latency must be < 100ms.
- **Accessibility:** Adherence to WCAG 2.1 AA is required for all AI-assisted report views.
- **Safety:** Prompts entered into the IDE must be safety-scored *as-you-type* using the OPA-Rego websocket.

## Data Ingestion
- **Resilience:** All document ingestion must follow the Kafka -> DocProcessor -> VectorDB flow. Direct DB writes are forbidden.
- **Schema:** Use the Protobuf definitions in `/schemas` for all Kafka payloads.

## Code Quality
- **Verification:** All core governance kernels (GDL Compiler, IRMI Driver) require 100% unit test coverage and formal verification using TLA+.
