'use server'

import {
  AnalyticsOverview,
  AnalyticsVolume,
  CostBreakdown,
  CostTrend,
  ErrorBreakdown,
  LatencyBreakdown,
  LatencyTrend,
} from "@/app/(signed)/dashboard/types";
import { apiFetch } from "@/lib/api";

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

export const getLatencyTrend = async (
  projectId: string,
  range: string = "24h",
): Promise<LatencyTrend> => {
  return apiFetch(
    `/analytics/latency/trend?projectId=${projectId}&range=${range}`,
  );
};

export const getLatencyBreakdown = async (
  projectId: string,
  range: string = "24h",
): Promise<LatencyBreakdown> => {
  return apiFetch(
    `/analytics/latency/breakdown?projectId=${projectId}&range=${range}`,
  );
};

export const getErrorsBreakdown = async (
  projectId: string,
  range: string = "24h",
): Promise<ErrorBreakdown> => {
  return apiFetch(
    `/analytics/errors/breakdown?projectId=${projectId}&range=${range}`,
  );
};

export const getCostTrend = async (
  projectId: string,
  range: string = "24h",
): Promise<CostTrend> => {
  return apiFetch(
    `/analytics/cost/trend?projectId=${projectId}&range=${range}`,
  );
};

export const getCostBreakdown = async (
  projectId: string,
  range: string = "24h",
): Promise<CostBreakdown> => {
  return apiFetch(
    `/analytics/cost/breakdown?projectId=${projectId}&range=${range}`,
  );
};
