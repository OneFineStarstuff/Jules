# Section 7: AI Governance Directive - Project Nexus

## 7.1 Scope
This directive mandates the deterministic governance of the Nexus Underwriting Engine to ensure compliance with the **Global Decentralized Identity Infrastructure (GDII)** and the **EU AI Act**.

## 7.2 Quantified Performance & Safety Invariants
| Metric | Threshold | Reporting Frequency |
| :--- | :--- | :--- |
| **Semantic Drift** | < 5% variance | Daily |
| **Bias (AIR)** | > 0.92 | Per batch (Kafka stream) |
| **Explainability (SHAP/LIME)** | > 95% fidelity | Per decision |
| **Deception Index** | < 0.10 | Real-time (IRMI monitor) |

## 7.3 RACI Matrix
| Activity | Responsible | Accountable | Consulted | Informed |
| :--- | :--- | :--- | :--- | :--- |
| GDL Rule Authoring | AI Lead | Governance Lead | Ethics Board | CISO |
| Hardware Kill-Switch Maint | DevOps | CTO | SecOps | Board |
| Bias Remediation | Data Sci | Governance Lead | Legal | CRO |

## 7.4 Governance of Governance
All changes to the Nexus Directive must be audited by a secondary **Auditor-Agent** swarm and signed with an **X.509 SVID** from the SPIRE controller.
