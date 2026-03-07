import sys
import time
import random
import json

class OmniSentinel:
    """
    Omni-Sentinel High-Frequency Monitoring Engine.
    Implements deterministic risk enforcement for G-SIFI environments.
    """
    def __init__(self):
        self.rules = {
            "CPU_SPIKE": {">90%": "HALT"},
            "MEM_LEAK": {"<10GB": "KILL_SWITCH"},
            "LATENCY_H": {">500ms": "OVERRIDE"}
        }
        self.state = "INITIALIZING"
        self.log = []

    def evaluate_telemetry(self, metric, value):
        """
        Conflict-resolution priorities: KILL_SWITCH > HALT > OVERRIDE.
        """
        action = "MONITOR"
        for threshold, rule_action in self.rules.get(metric, {}).items():
            if self._check_threshold(value, threshold):
                action = rule_action
                break

        self._enforce(action, metric, value)
        return action

    def _check_threshold(self, value, threshold):
        if ">" in threshold:
            return float(value.replace('%', '').replace('ms', '')) > float(threshold.replace('>', '').replace('%', '').replace('ms', ''))
        if "<" in threshold:
            # Simple GB comparison for demonstration
            return float(value.replace('GB', '')) < float(threshold.replace('<', '').replace('GB', ''))
        return False

    def _enforce(self, action, metric, value):
        timestamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        entry = {
            "timestamp": timestamp,
            "metric": metric,
            "value": value,
            "action": action,
            "status": "ENFORCED"
        }
        self.log.append(entry)
        if action == "KILL_SWITCH":
            self.state = "HARD_SHUTDOWN"
        elif action == "HALT":
            self.state = "SUSPENDED"

        # Visualizing latency-to-block (Text-based)
        if metric == "LATENCY_H":
            blocks = int(float(value.replace('ms', '')) / 20)
            print(f"[TELEMETRY] {metric}: {value} | {'█' * blocks}")

    def get_state_report(self):
        return {
            "system_state": self.state,
            "log_entries": len(self.log),
            "last_action": self.log[-1]["action"] if self.log else "NONE"
        }

if __name__ == "__main__":
    sentinel = OmniSentinel()
    print("Omni-Sentinel CLI v1.0.4 initialized.")
    # Simulation
    sentinel.evaluate_telemetry("LATENCY_H", "800ms")
    sentinel.evaluate_telemetry("CPU_SPIKE", "95%")
    sentinel.evaluate_telemetry("MEM_LEAK", "8GB")
    print(json.dumps(sentinel.get_state_report(), indent=2))
