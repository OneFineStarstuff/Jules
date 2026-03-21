/**
 * Cognitive Load Measurement for Real-time UI Adjustments.
 * Metrics: Interaction latency, click-error rate, scroll velocity.
 */
class CognitiveLoadMonitor {
  calculateLoad(userMetrics) {
    const { latency, errorRate } = userMetrics;
    const loadIndex = (latency * 0.4) + (errorRate * 0.6);

    // If load exceeds 0.8, trigger UI simplification
    return loadIndex > 0.8 ? 'SIMPLIFIED' : 'DETAILED';
  }
}

module.exports = new CognitiveLoadMonitor();
