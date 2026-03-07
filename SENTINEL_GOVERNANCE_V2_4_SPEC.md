<title>Sentinel AI Governance Platform v2.4: Core Specification</title>
<abstract>Comprehensive technical specification for the Sentinel platform, designed for high-assurance AI governance. Includes GDL grammar, IRMI hardware kill-switch protocols, and immutable audit logging schemas.</abstract>
<content>
# 1. Enforcement Substrate
Sentinel integrates directly with the **IRMI (Inherent Risk Mitigation Interface)** to issue hardware interrupts upon safety breach.

# 2. Governance Description Language (GDL)
A formal grammar for defining non-bypassable safety invariants (e.g., `ASSERT bias < 0.05`).

# 3. Auditability
All GDL evaluations are logged to an immutable sink with SHA-256 integrity chaining.
</content>
