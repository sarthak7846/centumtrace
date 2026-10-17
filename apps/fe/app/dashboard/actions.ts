import { apiFetch } from "@/lib/api";
import {
  AnalyticsOverview,
  AnalyticsVolume,
  Project,
  TraceDetails,
  TraceResponse,
} from "./types";

export async function getCurrentUser() {
  const res = await apiFetch(`/user/me`);
  if (res.error) {
    throw new Error(res.message);
  }
  return res;
}

export async function getProjects(organizationId: string): Promise<Project[]> {
  const res = await apiFetch(`/organization/${organizationId}/projects`);
  if (res.error) {
    throw new Error(res.message);
  }
  return res;
}

export const getAnalyticsOverview = async (
  projectId: string,
): Promise<AnalyticsOverview> => {
  return apiFetch(`/analytics/overview?projectId=${projectId}`);
};

export const getAnalyticsVolume = async (
  projectId: string,
  range: string = "24h",
): Promise<AnalyticsVolume> => {
  return apiFetch(`/analytics/volume?projectId=${projectId}&range=${range}`);
};

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
  return apiFetch(
    `/project/${projectId}/trace/${encodeURIComponent(traceId)}`,
  );
};
