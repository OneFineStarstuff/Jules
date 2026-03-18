# GSIFI Production-Grade AI Governance Implementation

## 1. Kafka ACL Governance & Data Bus Security
For GSIFIs, the data bus is the primary conduit for autonomous agent interaction.
- **Micro-segmented ACLs**: Leveraging Kafka's `AclAuthorizer` to enforce least-privilege at the topic level.
- **Identity Integration**: Kafka Principal mapping to **SPIFFE SVIDs**. Agents attested by SPIRE receive short-lived certificates used for SASL/SSL authentication.
- **Topic Namespacing**: High-assurance topics (e.g., `gsifi.prod.credit.reasoning`) require dual-key authorization for consumer group joining.

## 2. Continuous Compliance Engine (CCE) & OPA
The CCE acts as the "Governed Nervous System."
- **OPA-as-a-Sidecar**: Every agent pod runs an OPA instance. Intents are validated against Rego policies before execution.
- **Policy-as-Code (PaC)**: Policies for **ISO/IEC 42001** and **SR 11-7** are version-controlled in the same repository as the models.
- **Evidence Bundles**: Every gRPC `ExecuteTask` call results in a signed JSON blob containing:
  - `trace_id`: W3C compatible.
  - `model_provenance`: Weights hash.
  - `policy_decision`: OPA result + reasoning trace.
  - `input_redaction_signature`: Proof that PII was removed according to GDPR rules.

## 3. Storage & Auditability (WORM & Evidence Signing)
- **WORM Storage**: Evidence bundles are stored in Amazon S3 buckets with **Object Lock** in compliance mode.
- **Cryptographic Signing**: The **Chief AI Governance Officer (CAIGO)** root key signs the daily aggregate audit log.
- **Verification CLI**: Internal auditors use the `gsifi-verify` tool to check for drift between the intended policy and the executed decisions by re-playing reasoning traces against the current policy engine.

## 4. Terraform & CI/CD Governance
- **Repository Structure**:
  - `governance/opa/`: Rego rules.
  - `governance/terraform/`: Kafka ACLs, S3 WORM config.
- **GitHub Actions Gates**: Mandatory "Policy Approval" from the Risk team for any change to the `governance/` directory.
