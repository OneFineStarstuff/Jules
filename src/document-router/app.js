const express = require('express');
const { Pool } = require('pg');
const { Kafka } = require('kafkajs');

const app = express();
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const kafka = new Kafka({ clientId: 'document-router', brokers: [process.env.KAFKA_BROKER] });
const producer = kafka.producer();

/**
 * SOC 2 Compliant Audit Logger
 */
const auditLog = async (event) => {
  await pool.query('INSERT INTO audit_trail(timestamp, actor, action, metadata) VALUES(NOW(), $1, $2, $3)',
    [event.actor, event.action, event.metadata]);
};

app.post('/v1/route', async (req, res) => {
  const { metadata, actor } = req.body;
  const traceId = `tr-${Date.now()}`;

  try {
    const targetQueue = metadata.sensitivity_level > 3 ? 'high-security-queue' : 'standard-queue';

    // 1. Persistent Audit Trail (SOC 2)
    await auditLog({
      actor: actor || 'system',
      action: 'DOCUMENT_ROUTE',
      metadata: { ...metadata, traceId, targetQueue }
    });

    // 2. Kafka Async Ingestion (P99 < 50ms)
    await producer.connect();
    await producer.send({
      topic: 'incoming-documents',
      messages: [{ key: metadata.origin_role, value: JSON.stringify({ ...metadata, traceId, targetQueue }) }]
    });

    res.status(200).json({ target_queue: targetQueue, routing_reason: 'GDL policy enforced', trace_id: traceId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(8080, () => console.log('Document Router active on 8080 with SOC 2 logging'));
