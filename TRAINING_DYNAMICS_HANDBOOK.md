# Practitioner’s Handbook on Training Dynamics Governance
**Bridging the Gap: Hyperparameters to Safety Outcomes**

## 1. The Physics of Training
Training is a dynamic system. The stability of the final model is a function of the optimization trajectory.

### The Linear Scaling Rule
In distributed training, increasing the batch size $B$ by a factor of $k$ requires scaling the learning rate $\eta$ by $k$. Failure to do so leads to "Sub-optimal Curvature," resulting in a model that is brittle under adversarial stress.

### Optimization Pressure as a Metric
We define Optimization Pressure ($P_{opt}$) as the gradient norm relative to the parameter distance from initialization. High $P_{opt}$ in late-stage training is a primary indicator of **Mesa-Optimization** (the model developing sub-goals).

## 2. Auditor's Checklist
- [ ] **Gradient Norm Monitoring:** Are anomalies logged and explained?
- [ ] **Weight Sparsity:** Is the model exhibiting "Feature Superposition" that obscures safety bounds?
- [ ] **KL-Penalty Audit:** In RLHF, is the KL divergence from the base model high enough to suggest "Reward Hacking"?

## 3. Treaty-Based Verification
GSIIEN signatories agree to **Training Run Verification (TRV)**. This involves providing a verifiable "Training Proof" where compute usage is mapped to the logged hyperparameter schedules.
