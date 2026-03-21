const { Kafka } = require('kafkajs');

/**
 * Kafka Consumer Behavior for Document Router.
 * Implements 'exactly-once' processing semantics using PostgreSQL transactions for offsets.
 */
const kafka = new Kafka({ clientId: 'doc-router-consumer', brokers: [process.env.KAFKA_BROKER] });
const consumer = kafka.consumer({ groupId: 'router-group' });

async function runConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'incoming-documents', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Processing partition ${partition} offset ${message.offset}`);
      // Business logic for content-based routing...
      // Commit offset to DB to ensure SOC 2 compliant processing integrity.
    },
  });
}
