
### 13. Advanced Governance: Integration with Governance Description Language (GDL)

EAIP is designed to be the enforcement layer for the **Sentinel AI Governance Platform**. The protocol utilizes **GDL** (Governance Description Language) to define the "Safe Action Space" for each agent.

#### 13.1 GDL-Enforced Guardrails
When a `Dispatcher Agent` initiates a task, the EAIP Egress Proxy attaches a **GDL-Token** to the RCE. This token contains a compiled set of deterministic rules (Datalog/Rego) that the `Executor Agent` must satisfy before performing any side-effect (e.g., database write, external API call).

- **Constraint Propagation**: If Agent A delegates to Agent B, Agent B inherits a subset of Agent A's GDL constraints.
- **Dynamic Scoping**: GDL rules are evaluated at the point of interaction, allowing for context-aware permissions (e.g., "Allow write if the transaction volume is < $10k AND it is within business hours").

#### 13.2 Distributed Proof of Alignment (DPoA)
For high-risk environments (e.g., G-SIFI liquidity management), EAIP requires a **Distributed Proof of Alignment**. The `Executor Agent` must generate a cryptographic proof (using Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge, or zk-SNARKs) that its proposed reasoning path satisfies the GDL constraints provided in the RCE.

### 14. Observability and Distributed Tracing (EAIP-OTEL)

Observability in agentic systems is more complex than traditional microservices because the "logic" is probabilistic. EAIP extends the **OpenTelemetry (OTEL)** specification with agent-specific semantics.

- **Semantic Conventions**:
  - `agent.id`: The SPIFFE ID of the agent.
  - `agent.model`: The specific LLM and version (e.g., `gpt-4o-2024-05-13`).
  - `agent.thought_id`: Correlation ID for a single step in a reasoning chain.
  - `agent.latency.inference`: Time spent in model inference.
  - `agent.latency.tool_call`: Time spent executing external tools.

- **RCE Trace Propagation**: The `trace_id` in the RCE is automatically injected into the `baggage` of the OTEL context, ensuring a single unified trace spans the entire autonomous lifecycle, from initial human prompt to the final multi-agent result.

### 15. Deployment Topologies: Sidecars, Gateways, and Mesh

The implementation of EAIP varies based on the existing infrastructure maturity.

#### 15.1 The Agent Sidecar (Recommended for Kubernetes)
In this topology, every agent pod runs a `spire-agent` and an `eaip-proxy` container. The agent developer focuses solely on the reasoning logic, communicating over a local Unix Domain Socket. The sidecar handles mTLS, SPIFFE attestation, GDL evaluation, and OTEL export.

#### 15.2 The Agent Gateway (Legacy/External Integration)
For agents residing in external vendor clouds or legacy on-premise monoliths, an **EAIP Gateway** acts as a protocol translator. It terminates mTLS and validates incoming tokens before forwarding them via a secure tunnel (e.g., WireGuard) to the target agent.

#### 15.3 The EAIP Service Mesh
By integrating EAIP into a service mesh like **Istio** or **Cilium**, organizations can implement L7 network-level "Kill Switches." If a monitor agent detects a "Runaway Swarm" (exponential agent replication), the mesh can instantly drop all traffic for specific SPIFFE IDs, containing the swarm at the infrastructure layer.

### 16. Error Taxonomy: The EAIP gRPC Status Model

Standard gRPC error codes (OK, CANCELLED, etc.) are augmented with EAIP-specific metadata to facilitate autonomous recovery.

| Code | EAIP Metadata | Description |
| :--- | :--- | :--- |
| `FAILED_PRECONDITION` | `REASONING_DEADLOCK` | The agent has entered a circular reasoning loop. |
| `PERMISSION_DENIED` | `GDL_VIOLATION` | The proposed action violates governance rules. |
| `RESOURCE_EXHAUSTED` | `TOKEN_LIMIT_REACHED` | The context window is full; truncation or summarization required. |
| `UNAVAILABLE` | `CAPABILITY_LEASE_EXPIRED` | The executor agent no longer has the valid lease to perform this tool. |
| `INTERNAL` | `AGENT_HALUCINATION_DETECTED` | The monitor agent has detected a high-confidence semantic drift. |

### 17. Protocol Evolution and Schema Registry

EAIP uses a **Schema-on-Read** model for the `payload` field within the `TaskEnvelope`. To prevent "Contract Drift," all agents must register their capability schemas in a centralized **EAIP Schema Registry**.

- **Compatibility Checks**: The registry performs forward and backward compatibility checks on Protobuf and GDL definitions.
- **Automatic Stub Generation**: Senior Backend teams can utilize the registry to generate client/server stubs in Python, Go, and Rust, ensuring that all agents in the ecosystem are utilizing the latest protocol features.

### 18. Security Hardening: Multi-Modal Attestation Deep Dive

The integrity of the SPIFFE identity is the foundation of EAIP security. We mandate **Multi-Modal Attestation**:

1.  **Platform Attestation**: TPM-based measurement of the BIOS and OS kernel.
2.  **Container Attestation**: Verification of the container image digest against a signed OCI registry.
3.  **Logical Attestation**: Verification of the "Parent-Child" relationship in the agent delegation chain. A child agent cannot exist without a valid RCE delegation from a verified parent.

### 19. Conclusion: Standardizing Autonomous Complexity

The Enterprise AI Agent Interoperability Protocol (EAIP) is not merely a technical interface; it is a governance substrate. By codifying identity (SPIFFE), state (RCE), and transport (gRPC), organizations can transition from fragmented "Agent Silos" to a unified, observable, and secure "Agentic Fabric." This standardization is the prerequisite for the deployment of truly autonomous enterprise systems that can operate at machine speed without sacrificing human control or regulatory compliance.
