# WorkflowAI Pro: Technical Implementation Artifacts

## 1. Document Router Component

### 1.1 OpenAPI 3.0 Specification
```yaml
openapi: 3.0.3
info:
  title: WorkflowAI Pro Document Router
  version: 1.0.0
paths:
  /v1/route:
    post:
      summary: Route a document based on content and role
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                document:
                  type: string
                  format: binary
                metadata:
                  $ref: '#/components/schemas/DocMetadata'
      responses:
        '200':
          description: Routing successful
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RoutingResult'
components:
  schemas:
    DocMetadata:
      type: object
      properties:
        origin_role: { type: string }
        sensitivity_level: { type: integer, minimum: 1, maximum: 5 }
    RoutingResult:
      type: object
      properties:
        target_queue: { type: string }
        routing_reason: { type: string }
        trace_id: { type: string }
```

### 1.2 PostgreSQL Schema
```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_hash TEXT NOT NULL,
    metadata JSONB NOT NULL,
    routing_path TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_doc_metadata ON documents USING GIN (metadata);
CREATE INDEX idx_doc_created_at ON documents (created_at);
```

### 1.3 Kafka Async Ingestion
*   **Topic:** `incoming-documents`
*   **Partitions:** 12 (High parallelism)
*   **Key:** `origin_role` (Ensures role-based ordering)

---

## 2. Approval Predictor Component

### 2.1 Model Architecture (EBM + GNN)
*   **EBM (Explainable Boosting Machine):** Used for tabular feature prediction (e.g., amount, department, urgency).
*   **GNN (Graph Neural Network):** Used to capture structural organizational dependencies. Nodes = Users, Edges = Historical approval interactions.

### 2.2 MongoDB Schema for Model Versioning
```javascript
db.createCollection("model_registry", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: [ "version", "architecture", "accuracy_metrics" ],
         properties: {
            version: { bsonType: "string" },
            architecture: { enum: [ "ebm-v1", "gnn-hybrid-v2" ] },
            weights_uri: { bsonType: "string" },
            accuracy_metrics: {
               bsonType: "object",
               properties: {
                  precision: { bsonType: "double" },
                  recall: { bsonType: "double" }
               }
            }
         }
      }
   }
});
```

---

## 3. Adaptive UI Engine

### 3.1 Redis Schema (Personalization Cache)
*   **Key:** `ui:profile:{user_id}`
*   **Value (Hash):**
    *   `last_interactions`: JSON array of components used.
    *   `preferred_density`: "compact" | "comfortable".
    *   `agent_confidence_threshold`: Float (Determines when to show "AI Reasoning" details).

### 3.2 Dynamic Content API
```json
{
  "endpoint": "/v1/ui/layout",
  "method": "GET",
  "response": {
    "layout_id": "exec-dashboard-v4",
    "components": [
      { "id": "risk-gauge", "type": "visualizer", "props": { "high": 0.8 } },
      { "id": "copy-report", "type": "control", "action": "COPY_CLIPBOARD" }
    ],
    "orchestrator_override": { "theme": "dark-high-contrast" }
  }
}
```
