<title>Pharma-Guard: French Pharmaceutical Marketing Compliance Reviewer</title>
<abstract>Technical specification for an AI-driven marketing review system compliant with French National Agency for Medicines and Health Products Safety (ANSM) and GDPR regulations. Features deterministic bias detection and regulatory grounding.</abstract>
<content>
# 1. Regulatory Alignment (ANSM)
*   **Mandate:** Automated screening for prohibited therapeutic claims.
*   **Grounding:** Veridical RAG using the official ANSM therapeutic index.

# 2. Technical Control
*   **Compliance Score:** Every asset is assigned an 'Ethics-Dynamic' score from 0 to 1.
*   **Continuation Refusal:** Assets with scores < 0.95 are automatically blocked from publication.

# 3. Privacy (GDPR)
Strict Zero-PII logging for all reviewer interactions.
</content>
