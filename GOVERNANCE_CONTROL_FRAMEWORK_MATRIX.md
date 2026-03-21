# Sentinel AI Governance Platform v2.4: Control Framework Matrix
**Standards Alignment:** EU AI Act (Art. 9, 11, 13, 14, 15) | NIST AI RMF v1.0 | ISO/IEC 42001 (Annex A)

---

| Control Domain | Sentinel v2.4 Mechanism | EU AI Act Alignment | NIST RMF Function | ISO 42001 Control |
| :--- | :--- | :--- | :--- | :--- |
| **Risk Management** | GDL Policy Compiler & Real-time Scoring | Article 9 | GOVERN-2, MAP-1 | A.5 (Risk Assessment) |
| **Data Governance** | Stateless PII Redactor & Hashing | Article 10 | MANAGE-1 | A.10.1 (Data Privacy) |
| **Transparency** | Epistemic Anchoring & Trace Logs | Article 13 | MEASURE-2 | A.8.2 (Transparency) |
| **Human Oversight** | Adaptive UI HITL Gates | Article 14 | GOVERN-5 | A.8.3 (Oversight) |
| **Robustness/Security** | IRMI Hardware Switch & mTLS | Article 15 | PROTECT-1 | A.8.4 (Robustness) |
| **Incident Logging** | Kafka-WORM Ledger | Article 12 | MEASURE-1 | A.10.2 (Monitoring) |

---

## Ongoing Compliance Lifecycle (2026 - 2030)
1. **Continuous Monitoring:** Real-time GDL validation for every agentic sub-task.
2. **Post-Market Surveillance:** Monthly forensic reconstruction of reasoning traces from the Kafka ledger.
3. **Capability Audits:** Quarterly re-assessment of HGNN recommendation weights to prevent bias drift.
4. **Resiliency Testing:** Annual "Chaos Safety" simulation (Triggering IRMI in a sandbox).
