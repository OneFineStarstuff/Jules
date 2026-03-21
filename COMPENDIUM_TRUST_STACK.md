# Part II: Enterprise AI Reference Architecture (The Trust Stack)

## 1. The Intelligence Plane
Heterogeneous LLMs and specialized agents orchestrated by **WorkflowAI Pro**. Agents are isolated in micro-segmented Kubernetes namespaces with strictly defined tool-access.

## 2. The Governance Plane
- **Model & Agent Registries**: Version-controlled repositories for "Approved" weights.
- **Policy Enforcement Engine (OPA)**: Centralized Rego registry enforcing institutional "Rules of Engagement."
- **Kafka WORM Audit Fabric**: Immutable stream of all A2A (Agent-to-Agent) interactions.
