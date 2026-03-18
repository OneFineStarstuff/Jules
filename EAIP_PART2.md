
### 3. IAM for Autonomous Agents: SPIFFE/SPIRE Architecture

Traditional human-centric IAM (Usernames/Passwords/OAuth Flows) fails for agents that spawn and die in milliseconds. EAIP implements **Machine Identity** via **SPIFFE (Secure Production Identity Framework for Everyone)**.

#### 3.1 Workload Attestation
Before an agent can participate in the EAIP fabric, it must be attested by the **SPIRE Server**.
1.  **Node Attestation**: The underlying VM or K8s Node proves its identity to the SPIRE server.
2.  **Workload Attestation**: The SPIRE Agent on the node identifies the specific agent process by inspecting its binary hash, Linux cgroups, and K8s labels.
3.  **SVID Issuance**: The agent is issued a **SPIFFE Verifiable Identity Document (SVID)** in X.509 format.

#### 3.2 SPIFFE ID Namespace
EAIP IDs are structured to enable hierarchical policy enforcement:
`spiffe://enterprise.com/ns/{namespace}/agent/{class}/{instance_id}`

Example: `spiffe://acme.org/ns/finance/agent/reconciler/7f83-a912`

#### 3.3 Authorization and Policy Enforcement (mTLS + OPA)
- **Mutual TLS (mTLS)**: All EAIP gRPC calls utilize the SVIDs for mTLS. Encryption is not optional.
- **Policy Engine (OPA/Rego)**: The `Executor Agent` intercepts incoming SVIDs and queries an **Open Policy Agent (OPA)** sidecar. OPA validates if the `Dispatcher Agent` is authorized to call the requested `Tool` based on the task's context (e.g., "Is this reconciler agent allowed to trigger a $1M wire transfer?").

### 4. State Management and Handoff: The Recursive Context Envelope (RCE)

The primary failure mode in distributed AI systems is **Context Fragmentation**. EAIP solves this via the **Recursive Context Envelope (RCE)**.

#### 4.1 RCE Structure
The RCE is a Protobuf metadata object attached to every `TaskEnvelope`. It contains:

- **Global Correlation ID**: A 128-bit TraceID for cross-agent observability.
- **Reasoning Graph (Merkle Tree)**: Instead of passing the full text of previous thoughts, the RCE passes a hash-based graph of the reasoning history. Receiving agents can "hydrate" specific nodes of the graph from a distributed context store if needed.
- **Delegation Chain**: A list of SVIDs that have touched this task, preventing circular delegation and enabling forensic auditing of "Agent Responsibility."
- **Financial/Compute Budget**: A set of "Resource Credits" that the agent is allowed to burn on this specific task.

#### 4.2 Handoff Protocol
1.  **Preparation**: Agent A (Dispatcher) serializes its current state into the RCE.
2.  **Negotiation**: Agent A calls `Discovery` to find an Agent B (Executor) with the required capabilities.
3.  **Transfer**: Agent A invokes `NegotiateTask`, passing the RCE.
4.  **Verification**: Agent B validates the RCE's cryptographic signature and ensures its "Goal Alignment Guardrails" accept the new task.
