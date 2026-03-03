# Enterprise AI Agent Interoperability Protocol (EAIP)

## 1. API Architecture
*   **Transport:** gRPC (HTTP/2) for bidirectional, persistent reasoning streams.
*   **Serialization:** Protobuf (Binary) for minimal latency in high-concurrency meshes.
*   **Service Definition:**
    ```protobuf
    service AgentMesh {
      rpc Handoff (ContextEnvelope) returns (ContextEnvelope);
      rpc StreamReasoning (ReasoningNode) returns (stream FeedbackNode);
    }
    ```

## 2. IAM for Agents (SPIFFE/SPIRE)
*   **Identity:** Agents are assigned unique **SPIFFE IDs** (e.g., `spiffe://acme.com/agent/document-router`).
*   **Attestation:** SPIRE server performs workload attestation by verifying binary hashes and container metadata before issuing an **X.509 SVID**.
*   **Auth:** Mutual TLS (mTLS) is mandatory for all agent-to-agent gRPC connections.

## 3. State Management (Recursive Context Envelope)
The **RCE** ensures trace integrity across distributed agents.
*   **Trace Context:** W3C Traceparent compliant headers.
*   **Memory Stack:** Compressed reasoning history using sliding-window summarization.
*   **Safe Boundary Manifest:** Immutable list of permitted tools and resource constraints (e.g., `MAX_RECURSION=5`).

## 4. Reference Implementation (Node.js)
```javascript
const { createAgentClient } = require('@eaip/mesh-sdk');

const agent = createAgentClient({
  identity: process.env.SPIRE_SVID_PATH,
  peers: ['legal-agent:50051']
});

async function triggerHandoff(context) {
  const response = await agent.handoff(context);
  console.log('Reasoning trace:', response.memory_stack);
}
```
