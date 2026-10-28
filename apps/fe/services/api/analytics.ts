import {
  AnalyticsOverview,
  AnalyticsVolume,
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
