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
export const validRanges: TraceVolumeRange[] = ["24h", "7d", "30d"];

export type Trace = {
  traceId: string;
  provider: string;
  model: string;
  status: string;
  latencyMs: number | null;
  totalTokens: number | null;
  totalCost: string | number | null;
  createdAt: string;
  errorType: string | null;
};

export type TraceResponse = {
  data: Trace[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
};

export type SearchParams = Promise<{
  projectId?: string;
  page?: string;
  limit?: string;
  status?: string;
  provider?: string;
  model?: string;
  traceId?: string;
  apiKeyId?: string;
  range?: string;
  sortBy?: string;
  sortOrder?: string;
  minLatency?: string;
  maxLatency?: string;
  minCost?: string;
  maxCost?: string;
  minTokens?: string;
  maxTokens?: string;
}>;

export type TraceDetails = {
  id: string;
  projectId: string;
  apiKeyId: string | null;
  traceId: string;
  provider: string;
  model: string;
  status: "SUCCESS" | "ERROR";
  latencyMs: number | null;
  startedAt: string | null;
  endedAt: string | null;
  inputTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
  inputCost: number | string | null;
  outputCost: number | string | null;
  totalCost: number | string | null;
  input: any | null;
  output: any | null;
  errorType: string | null;
  errorMessage: string | null;
  metadata: any | null;
  createdAt: string;
};
