
### 8. Deep Dive: The Recursive Context Envelope (RCE) Wire Format

To ensure high-performance deserialization across different language runtimes (Python, Rust, Go), the RCE is strictly typed. The following Protobuf definition represents the EAIP v1.0 standard for context propagation.

```protobuf
message RecursiveContextEnvelope {
  // Global context
  string trace_id = 1;      // W3C Trace Context compatible
  string correlation_id = 2; // Business-logic correlation

  // State Management (Merkle-DAG)
  message StateNode {
    string node_id = 1;
    string parent_hash = 2;
    bytes payload_summary = 3; // Compressed summary for the LLM
    string vector_store_ref = 4; // URI to full embedding/data
  }
  repeated StateNode reasoning_history = 3;

  // Delegation and Security
  message Delegation {
    string agent_spiffe_id = 1;
    int64 timestamp = 2;
    string action_intended = 3;
    bytes signature = 4; // Signed by the agent's SVID
  }
  repeated Delegation call_stack = 4;

  // Guardrails and Constraints
  message Constraints {
    double max_financial_cost = 1;
    string currency = 2;
    int32 max_recursion_depth = 3;
    int32 max_compute_units = 4;
    repeated string restricted_tools = 5;
  }
  Constraints task_constraints = 5;
}
```

### 9. Governance-as-Code: OPA Rego Policy Examples

EAIP agents do not trust each other by default. They verify. The following Rego policy is a reference for an `Executor Agent` validating a delegation from a `Dispatcher Agent`.

```rego
package eaip.authz

import input.rce
import input.peer_certificate

default allow = false

# Allow if the calling agent is in the 'Trusted Orchestrator' group
# AND the financial request is under the remaining budget in the RCE.
allow {
    is_trusted_orchestrator(peer_certificate.spiffe_id)
    rce.task_constraints.max_financial_cost <= 500
    not is_blacklisted_tool(rce.task_constraints.restricted_tools)
}

# Helper to verify SPIFFE ID namespace
is_trusted_orchestrator(id) {
    startswith(id, "spiffe://enterprise.com/ns/core/agent/orchestrator/")
}

# Prevent use of dangerous tools if specified in RCE
is_blacklisted_tool(tools) {
    tools[_] == "system_shell_access"
}
```

### 10. Implementation Pattern: The Sidecar Proxy

For legacy systems or agents not natively supporting gRPC, EAIP recommends the **Agent-Proxy (Sidecar)** pattern.

1.  **Ingress Proxy**: Intercepts inbound gRPC traffic, validates the mTLS SVID against SPIRE, and performs OPA authorization before forwarding the request to the local agent over a Unix Domain Socket (UDS).
2.  **Egress Proxy**: Automatically injects the RCE and SVID into outbound calls, ensuring the agent developer does not need to handle cryptographic signatures manually.
3.  **Observability Bridge**: Scrapes the reasoning history from the RCE and pushes it to an asynchronous event bus (Kafka) for the Governance Engine to analyze.

### 11. Security Hardening: Multi-Modal Attestation

To prevent "Agent Spoofing," where a rogue process tries to assume an agent's identity, SPIRE must be configured with Multi-Modal Attestation:

- **TPM Attestation**: Verifying the hardware's integrity.
- **K8s Attestation**: Verifying the Pod's namespace, service account, and container image digest.
- **Runtime Attestation**: Periodically checking the memory map of the agent process to detect code injection or unauthorized shell spawns.

### 12. Conclusion: Standardizing the Future of Autonomous Systems

The Enterprise AI Agent Interoperability Protocol (EAIP) is the missing link between powerful foundation models and reliable enterprise operations. By enforcing gRPC for performance, SPIFFE for identity, and RCE for state, we create a substrate where autonomy is not a risk to be feared, but a capability to be harnessed.
