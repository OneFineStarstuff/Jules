### 3. Identity and Access Management (IAM) for Autonomous Agents

Traditional IAM models (Usernames/Passwords, API Keys, OAuth Flows) are optimized for human-to-machine interaction. In a swarm architecture where agents are spawned dynamically and interact at millisecond intervals, these models fail due to the overhead of secret rotation and the lack of workload attestation.

#### 3.1 SPIFFE/SPIRE Architecture
EAIP implements **Machine Identity** using the **Secure Production Identity Framework for Everyone (SPIFFE)**. This ensures that every agent has a cryptographically verifiable identity that is independent of its IP address or host.

- **SPIFFE ID Namespace**: EAIP IDs are structured hierarchically: `spiffe://trust.domain/ns/{namespace}/agent/{class}/{id}`. This allows security teams to define granular policies based on agent classes (e.g., "Allow all `reconciler` agents to access the Finance DB").
- **Workload Attestation**: Before an agent is issued an identity, the **SPIRE (SPIFFE Runtime Environment)** agent on the host performs "Multi-Modal Attestation." It inspects the agent's binary hash, container image digest, and Kubernetes namespace. Only if these measurements match the "Trusted Registry" is the agent issued a **SPIFFE Verifiable Identity Document (SVID)** in X.509 format.
- **Mutual TLS (mTLS)**: All EAIP gRPC calls utilize these SVIDs for mTLS termination. This guarantees that:
    1.  **Identity is Non-Repudiable**: We know exactly which agent instance made a call.
    2.  **Traffic is Encrypted**: Data in transit is protected by industry-standard TLS 1.3.
    3.  **Secrets are Short-Lived**: SPIRE automatically rotates SVIDs every 60 minutes, eliminating the risk of long-lived credential theft.

#### 3.2 Authorization via OPA (Open Policy Agent)
Identity is only half the battle; the other half is **Policy**. EAIP agents utilize an **OPA Sidecar** for context-aware authorization. When an `Executor Agent` receives a request, it passes the requester's SPIFFE ID and the task's metadata to OPA. The policy engine evaluates whether the interaction is permitted based on "Governance-as-Code" (Rego) definitions. This allows for dynamic constraints like: "Only allow Agent A to delegate to Agent B if the transaction amount is less than the remaining daily budget."
