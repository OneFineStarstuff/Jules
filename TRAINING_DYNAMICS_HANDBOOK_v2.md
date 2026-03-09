# Practitioner’s Handbook on Training Dynamics Governance

## 1. The Noise Scale Protocol
Governing the stability of frontier models requires monitoring the noise scale $g$:
$$ g \approx \frac{\eta}{B} $$
where $\eta$ is the Learning Rate and $B$ is the Batch Size.
- **Verdict:** High $g$ promotes flatter minima and better generalization; low $g$ increases model brittleness and risk of "Sharp Minima" safety failure.

## 2. Auditor's Gradient Norm Checklist
1. **Initial Phase:** Verify $\eta$ warmup schedule.
2. **Plateau detection:** Trigger $1.2x$ batch size increase to maintain noise scale.
3. **Mesa-Optimization Probe:** Monitor for gradient norm anomalies in the last 10% of epochs.
