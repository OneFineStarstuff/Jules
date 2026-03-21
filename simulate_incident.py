from src.governance_engine.gdl_parser import SentinelEngine

"""
Omni-Sentinel Compliance Simulation Loop: Incident T2 under PACIFIC_SHIELD
"""

def run_simulation():
    # 1. Initialize with Master Canon
    """Runs the simulation for the PACIFIC_SHIELD protocol."""
    master_canon = {
        "latency_h": {"threshold": 150, "operator": "<", "action": "HALT"},
        "drift": {"threshold": 0.05, "operator": "<", "action": "PAUSE"}
    }
    engine = SentinelEngine(master_canon)

    print("Initiating PACIFIC_SHIELD Protocol for Incident T2...")

    # 2. Simulate high latency event (LATENCY_H => HALT)
    metric = "latency_h"
    value = 220

    decision = engine.evaluate_rule(metric, value)

    # 3. Emit regulator-ready artifact
    incident_data = {
        "trace_id": "T2-APAC-2024",
        "protocol": "PACIFIC_SHIELD",
        "decision": decision
    }

    xml_artifact = engine.emit_artifact(incident_data)
    markdown_mirror = engine.generate_markdown_mirror(xml_artifact)

    print("\n--- Canonical XML Artifact ---")
    print(xml_artifact)

    print("\n--- Non-Authoritative Markdown Mirror ---")
    print(markdown_mirror)

if __name__ == "__main__":
    # Fix import for local execution
    import sys
    import os
    sys.path.append(os.getcwd())
    from src.governance_engine.gdl_parser import SentinelEngine
    run_simulation()
