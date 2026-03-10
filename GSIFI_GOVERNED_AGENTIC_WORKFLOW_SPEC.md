# Technical Specification: Governed Agentic Workflow Architecture
**Function:** Autonomous High-Value Loan Underwriting & Adjudication
**Custodian:** Principal AI Architect & G-SIFI Governance Lead
**Standard:** Basel III Operational Risk; SR 11-7 Model Risk Management
**Status:** Canonical Implementation Spec v1.1

---

## 1. Workflow Topology & State Management

The architecture utilizes a **Directed Acyclic Graph (DAG)** with recursive sub-graphs for tool-use, managed by a central orchestrator that enforces state persistence.

### 1.1 Node & Edge Definition
- **Nodes ($V$):**
    - `DataIngestNode`: Normalizes ERP/Bureau feeds.
    - `RiskScoringAgent`: System 2 reasoning engine calculating Probability of Default (PD).
    - `ComplianceGate`: Deterministic policy verifier (GDL-enforced).
    - `HumanReviewer`: Level 5 Overseer for manual override.
- **Edges ($E$):**
    - `mTLS-secured gRPC` channels passing the **Recursive Context Envelope (RCE)**.
    - **Conditional Edges:** Logic-based routing (e.g., `if risk_score > 0.15 -> route to ComplianceGate`).

### 1.2 State Management
We utilize **Checkpointing** via a persistent Redis store. Every state transition ($\sigma_t \to \sigma_{t+1}$) is serialized and published to a **Kafka WORM Topic** (`underwriting.audit.log`).
- **Rollback:** In the event of an `ERR_ALIGN_BREACH`, the system performs an atomic rollback to $\sigma_{t-1}$ and locks the agent.

---

## 2. Governance Nodes & Gates

### 2.1 The Policy Verifier Node (PVN)
The PVN acts as a "Circuit Breaker" between reasoning and execution.
- **Fairness Constraint:** Scans for proxy variables correlated with protected classes (GDPR Art. 9).
- **Privacy Constraint:** Enforces PII redaction on all outbound tool calls (Sidecar pattern).

### 2.2 Human-on-the-Loop (HOTL) Escalation
Handoff triggers are threshold-based:
- **Low Confidence:** $p(\text{Decision}) < 0.85$.
- **High Value:** Total exposure $E > \$500M$.
- **Anomaly:** Detection of "Gift-giving" or "Sycophantic" reasoning traces.

---

## 3. Technical Implementation (Python / LangGraph)

### 3.1 Graph Implementation Example

```python
from typing import TypedDict, List
from langgraph.graph import StateGraph, END

# 1. Define State
class UnderwritingState(TypedDict):
    loan_id: str
    risk_score: float
    compliance_verdict: str
    action_count: int
    audit_trail: List[str]

# 2. Define Nodes
def risk_agent(state: UnderwritingState):
    # Simulated System 2 Reasoning
    state['risk_score'] = 0.18  # Example output
    state['audit_trail'].append("RiskScoringAgent: PD calculated at 18%")
    return state

def compliance_check(state: UnderwritingState):
    # GDL Logic Gate: if score > 0.15, require human sign-off
    if state['risk_score'] > 0.15:
        state['compliance_verdict'] = "FLAGGED"
    else:
        state['compliance_verdict'] = "PASS"
    return state

# 3. Define Conditional Routing
def route_after_compliance(state: UnderwritingState):
    if state['compliance_verdict'] == "FLAGGED":
        return "human_reviewer"
    return END

# 4. Build Graph
workflow = StateGraph(UnderwritingState)
workflow.add_node("risk_agent", risk_agent)
workflow.add_node("compliance_check", compliance_check)
workflow.add_node("human_reviewer", lambda x: x) # Placeholder for HITL

workflow.set_entry_point("risk_agent")
workflow.add_edge("risk_agent", "compliance_check")
workflow.add_conditional_edges("compliance_check", route_after_compliance)

app = workflow.compile()
```

---

## 4. Risk Controls: Loop Prevention & Rate Limiting

### 4.1 Recursive Depth Limit
To prevent **Tool-Use Loops** or infinite recursion in System 2 reasoning, we implement a `Max_Hop_Count` constraint.
- **Logic:** `if state['action_count'] > 10: trigger_hard_halt(REASON="REC_LIMIT_EXCEEDED")`.

### 4.2 Rate Limiting (Token/Action)
Agentic "Action Velocity" is capped via a **Token Bucket** algorithm in the Sentinel sidecar.
- **Limit:** 5 High-Value Actions per minute per agent instance.
- **Detection Metric:** Action Entropy ($H_a$) — rapid, chaotic action sequences trigger an immediate IRMI hardware interrupt.

---
**Lead Architect:** Principal AI Systems Engineer
**Status:** RATIFIED BY BRC (Board Risk Committee)
