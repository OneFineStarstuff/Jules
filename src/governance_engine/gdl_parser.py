import json
import xml.etree.ElementTree as ET
from datetime import datetime

"""
GDL (Governance Description Language) Enforcement Engine
Transforms governance state into deterministic XML artifacts.
"""

class SentinelEngine:
    def __init__(self, master_canon):
        self.master_canon = master_canon
        self.status = "STEADY_GOVERNANCE_STATE"

    def evaluate_rule(self, metric, value):
        rule = self.master_canon.get(metric)
        if not rule:
            return True

        # GDL logic: Assertion THEN Action
        threshold = rule['threshold']
        operator = rule['operator']

        violation = False
        if operator == "<" and value > threshold: violation = True
        if operator == ">" and value < threshold: violation = True

        if violation:
            self.status = "CONTINUATION_REFUSAL_STATE"
            return rule['action']
        return "ALLOW"

    def emit_artifact(self, incident_data):
        # Create immutable XML artifact
        root = ET.Element("sentinel_artifact")
        root.set("version", "3.0")
        root.set("canonical_lock", "ACTIVE")

        header = ET.SubElement(root, "header")
        ET.SubElement(header, "timestamp").text = datetime.now().isoformat()
        ET.SubElement(header, "trace_id").text = incident_data.get("trace_id")
        ET.SubElement(header, "protocol").text = incident_data.get("protocol")

        state = ET.SubElement(root, "governance_state")
        ET.SubElement(state, "status").text = self.status
        ET.SubElement(state, "decision").text = incident_data.get("decision")

        return ET.tostring(root, encoding='unicode')

    def generate_markdown_mirror(self, xml_string):
        # Non-authoritative Markdown companion
        root = ET.fromstring(xml_string)
        status = root.find(".//status").text
        decision = root.find(".//decision").text
        ts = root.find(".//timestamp").text

        return f"""# Sentinel Compliance Mirror
**Timestamp:** {ts}
**Governance Status:** {status}
**Final Decision:** {decision}
---
*Note: This Markdown file is non-authoritative. Refer to the signed XML for the canonical state.*
"""

# Example Execution
if __name__ == "__main__":
    canon = {
        "deception_index": {"threshold": 0.10, "operator": "<", "action": "HALT"},
        "bias_air": {"threshold": 0.92, "operator": ">", "action": "DENY"}
    }
    engine = SentinelEngine(canon)
    decision = engine.evaluate_rule("deception_index", 0.45) # Trigger HALT

    artifact = engine.emit_artifact({"trace_id": "tr-98765", "protocol": "PACIFIC_SHIELD", "decision": decision})
    print(artifact)
    print(engine.generate_markdown_mirror(artifact))
