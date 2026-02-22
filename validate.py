import xml.etree.ElementTree as ET
import re

def validate_xml(filename):
    try:
        tree = ET.parse(filename)
        root = tree.getroot()
        if root.tag != 'report':
            print("Error: Root tag must be 'report'")
            return False

        expected_tags = ['title', 'abstract', 'content']
        for tag in expected_tags:
            if root.find(tag) is None:
                print(f"Error: Missing tag '{tag}'")
                return False

        content = root.find('content').text
        if not content:
            print("Error: Content is empty")
            return False

        # Check for Mermaid block
        if "```mermaid" not in content or "```" not in content.split("```mermaid")[1]:
            print("Error: Mermaid block not found or unclosed")
            return False

        print("XML and Content Structure validated successfully.")
        return True
    except ET.ParseError as e:
        print(f"XML Parse Error: {e}")
        return False
    except Exception as e:
        print(f"Validation Error: {e}")
        return False

if __name__ == "__main__":
    if validate_xml('final_report.xml'):
        exit(0)
    else:
        exit(1)
