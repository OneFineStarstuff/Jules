const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL);

/**
 * Adaptive UI Engine delivering dynamic content based on AI Orchestrator confidence.
 */
class AdaptiveUIEngine {
  async getLayout(userId, agentConfidence) {
    const profile = await redis.hgetall(`ui:profile:${userId}`);

    // Logic for real-time UI adjustments
    let layoutId = 'standard-view';
    if (agentConfidence < profile.agent_confidence_threshold) {
      layoutId = 'detailed-reasoning-view';
    }

    return {
      layout_id: layoutId,
      components: [
        { id: 'approval-gauge', props: { value: agentConfidence } },
        { id: 'copy-control', type: 'CLIPBOARD_BUTTON' }
      ],
      user_density: profile.preferred_density || 'comfortable'
    };
  }
}

module.exports = new AdaptiveUIEngine();
