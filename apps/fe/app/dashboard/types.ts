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

export type Project = {
  id: string;
  organizationId: string;
  name: string;
  description: string;
};

export type AnalyticsVolume = {
  range: string;
  interval: string;
  data: {
    timestamp: string;
    total: number;
    success: number;
    errors: number;
  }[];
};

export type TraceVolumeRange = "24h" | "7d" | "30d";