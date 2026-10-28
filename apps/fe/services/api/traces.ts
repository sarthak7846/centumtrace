import { TraceDetails, TraceResponse } from "@/app/(signed)/dashboard/types";
import { apiFetch } from "@/lib/api";

export const getAllTraces = async (
  projectId: string,
  query: URLSearchParams,
): Promise<TraceResponse> => {
  return apiFetch(`/project/${projectId}/trace?${query.toString()}`);
};

export const getTraceDetails = async (
  projectId: string,
  traceId: string,
): Promise<{ data: TraceDetails }> => {
  console.log("project id", projectId);
  return apiFetch(`/project/${projectId}/trace/${encodeURIComponent(traceId)}`);
};
