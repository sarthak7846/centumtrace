export interface ObserveConfig {
  apiKey: string;
  baseUrl?: string;
}

export enum TraceStatus {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

export interface StartTracePayload {
  provider: string;
  model: string;
}

export interface TraceData {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  inputCost?: number;
  outputCost?: number;
  totalCost?: number;
  metadata?: Record<string, unknown>;
}

export interface CreateTracePayload {
  traceId: string;

  provider: string;
  model: string;

  status: TraceStatus;

  latencyMs?: number;

  startedAt?: string;
  endedAt?: string;

  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;

  inputCost?: number;
  outputCost?: number;
  totalCost?: number;

  input?: Record<string, unknown>;
  output?: Record<string, unknown>;

  errorType?: string;
  errorMessage?: string;

  metadata?: Record<string, unknown>;
}

export interface EndTracePayload {
  status: TraceStatus;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  errorType?: string;
  errorMessage?: string;
  metadata?: Record<string, unknown>;
}
