const express = require('express');
const { Pool } = require('pg');
const { Kafka } = require('kafkajs');

const app = express();
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const kafka = new Kafka({ clientId: 'document-router', brokers: [process.env.KAFKA_BROKER] });
const producer = kafka.producer();

/**
 * @openapi
 * /v1/route:
 *   post:
 *     summary: Route document based on content- and role-based logic.
 */
app.post('/v1/route', async (req, res) => {
  const { metadata } = req.body;
  const traceId = `tr-${Date.now()}`;

  try {
    // 1. Content-based logic (simplified)
    const targetQueue = metadata.sensitivity_level > 3 ? 'high-security-queue' : 'standard-queue';

    // 2. Persistence
    await pool.query('INSERT INTO documents(metadata, trace_id) VALUES($1, $2)', [metadata, traceId]);

    // 3. Kafka Async Ingestion
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

app.listen(8080, () => console.log('Document Router active on 8080'));
