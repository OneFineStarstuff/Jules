# 2024 AI Stack Taxonomy & Component Catalog: Cloud-Native SaaS
**Status:** Version 1.2
**Classification:** Technical Architecture

---

## 1. Vector Databases (Neural Search & Memory)
*Enabling semantic retrieval and long-term memory for agentic workflows.*

| Component | Key Capabilities | Representative Tools | Integration Pattern |
| :--- | :--- | :--- | :--- |
| **Serverless Vector DB** | Auto-scaling, dense/sparse retrieval, metadata filtering. | Pinecone, Weaviate Cloud, MongoDB Atlas Vector Search | RAG orchestration via LangChain/LlamaIndex. |
| **Embedded Vector DB** | High-performance, low-latency, localized storage. | Chroma, Milvus, Qdrant | Sidecar deployment in K8s for local agent memory. |

## 2. RAG Orchestration (Contextual Augmentation)
*Retrieval-Augmented Generation for grounding model outputs in domain-specific data.*

- **Data Connectors:** Fivetran, Airbyte (Ingestion into Vector DBs).
- **Chunking/Embedding:** OpenAI `text-embedding-3`, Cohere Embed (Semantic chunking).
- **Retrieval Logic:** Hybrid search (Keyword + Semantic), Reranking (Cohere Rerank).

## 3. Autonomous Agents (Actionable Agency)
*Systems capable of multi-step reasoning and tool-use.*

- **Frameworks:** LangGraph, AutoGPT, CrewAI.
- **Tool-Use:** Function calling, Tool-use tokens (OpenAI, Anthropic).
- **Handoffs:** EAIP (Enterprise AI Agent Interoperability Protocol) for cross-platform coordination.

## 4. Security & Governance (The Immune System)
*Protecting the model and its data from adversarial attacks.*

- **Prompt Injection Defense:** Lakera, PromptArmor.
- **PII Redaction:** Skyflow, Private AI.
- **Model Firewalls:** Cloudflare AI Gateway, Portkey.
- **Observability/Tracing:** LangSmith, Arize Phoenix, Weights & Biases (W&B).

---

## 5. Integration Patterns: The "Brain-Body" Nexus
1. **The RAG Sidecar:** Decoupling retrieval from the inference loop to reduce latency.
2. **The Governance Gate:** Interposing a Luminous-style orchestrator between the user and the LLM to enforce GDL logic.
3. **The Agentic Mesh:** Connecting multiple domain-specific agents via a central message bus (Kafka/gRPC) using SVID-based identity.
