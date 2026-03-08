# Chaos Engineering Strategy: Validating Docker Swarm Resilience
**Author:** Senior SRE, Chaos Engineering Division
**Date:** October 2024
**Target:** Docker Swarm Production Clusters (Manager/Worker Nodes)

## 1. Executive Summary: Addressing the 'Absence of Errors Fallacy'
Our current production environment exhibits an MTBF (Mean Time Between Failure) that is **24% above benchmark**. While superficially positive, this presents a significant risk identified as the 'Absence of Errors Fallacy.' A lack of observed errors often indicates a lack of visibility or a system that has not been sufficiently stressed to reveal latent, catastrophic failure modes. Proactive failure injection is not an elective optimization; it is a mandatory verification of our self-healing primitives. We must move from a reactive posture to a deterministic resilience model by inducing controlled turbulence to ensure our Raft consensus and service orchestration layers behave as documented under duress.

## 2. Resilience Hypotheses
*   **Hypothesis 1 (Leader Election Timing):** *If* a majority of Swarm Manager nodes experience a network partition (>500ms latency), *then* a new leader will be elected within the configured `heartbeat-tick` and `election-tick` windows without interrupting active service discovery.
*   **Hypothesis 2 (State Convergence):** *If* 30% of worker nodes are forcibly terminated (SIGKILL), *then* the Swarm Orchestrator will reschedule the missing task replicas to healthy nodes within 45 seconds to maintain the `desired_state`.
*   **Hypothesis 3 (Ingress Mesh Resilience):** *If* a routing mesh node fails, *then* the Ingress load balancer will redistribute traffic to available replicas without exceeding a 1% 5xx error rate over a 60-second window.

## 3. Fault Injection Scenarios

### 3.1 Scenario: Raft Consensus Loss (Manager Quorum)
**Objective:** Force a re-election by isolating the current leader.
**Command:**
```bash
# Isolate the current leader node (Manager 1) using iptables
docker node inspect self --format '{{.ID}}'
sudo iptables -A INPUT -p tcp --dport 2377 -j DROP
sudo iptables -A OUTPUT -p tcp --dport 2377 -j DROP
```
**Verification:** Monitor `docker node ls` from another manager to confirm status change and subsequent leader shift.

### 3.2 Scenario: Network Latency (The 'Slow' Node)
**Objective:** Induce jitter to test service timeout and retry logic.
**Tool:** `Pumba`
**Command:**
```bash
docker run -it --rm -v /var/run/docker.sock:/var/run/docker.sock \
    gaiaadm/pumba netem --duration 5m \
    --tcimage gaiadnm/netem-mm \
    delay --time 1000 --jitter 500 --distribution normal \
    re2:^my-web-service.*
```

### 3.3 Scenario: Split-Brain Simulation (Network Partition)
**Objective:** Simulate a clean break between two manager groups.
**Logic:** Use `docker network` or host-level `ip link` to drop traffic between specific subnet ranges representing distinct AZs.

## 4. Tooling Evaluation Matrix

| Feature | Pumba | Chaos Mesh | Gremlin |
| :--- | :--- | :--- | :--- |
| **Native Swarm Integration** | High (Container-based) | Low (K8s Focused) | Medium (Agent-based) |
| **Control Granularity** | High (Regex/ID) | Extreme | High |
| **API Support** | CLI Only | Comprehensive | SaaS API |
| **Ease of Rollback** | Immediate (Stop Container) | Auto-cleanup | Manual/SaaS Trigger |
| **Verdict** | **Recommended for Swarm** | Not Recommended | Premium Alternative |

## 5. Safety & Containment Protocols

### 5.1 Blast Radius Definition
Experiments are restricted to a single **Worker Group** or a **Secondary Manager** before moving to the Leader. No experiment shall target more than **10% of total cluster capacity** simultaneously.

### 5.2 Automated Abort Triggers
Experiments will automatically terminate if the following **Error Budget** thresholds are breached:
*   **HTTP 5xx Rate:** > 2% increase over baseline for > 30 seconds.
*   **P99 Latency:** > 2000ms for core API endpoints.
*   **Quorum Health:** Manager count drops below $n/2 + 1$.

### 5.3 Emergency Stop (The 'Big Red Button')
```bash
# Emergency rollback of all iptables changes and termination of chaos containers
sudo iptables -F
docker stop $(docker ps -q --filter ancestor=gaiaadm/pumba)
```

## 6. Observability & Golden Signals

We monitor impact using Prometheus and Grafana. Key metrics must be tracked via the following PromQL snippets:

**Service Availability (Success Rate):**
```promql
sum(rate(http_requests_total{status!~"5.."}[1m]))
/
sum(rate(http_requests_total[1m]))
```

**Task Rescheduling Latency:**
```promql
sum(container_last_seen{container_label_com_docker_swarm_service_name=~".+"})
-
sum(time() - container_start_time_seconds)
```

**Manager Consensus Status:**
```promql
swarm_manager_leader_status == 1
```

---
*End of Strategy Document*
