export type AnalyticsOverview = {
  totalTraces: number;
  successfulTraces: number;
  errorTraces: number;
  errorRate: number;
  averageLatencyMs: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  totalTokens: number;
  totalCost: number;
};
