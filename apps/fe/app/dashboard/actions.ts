import { apiFetch } from "@/lib/api";

export async function getCurrentUser() {
  const res = await apiFetch(`/user/me`)
  if(res.error) {
    throw new Error(res.message);
  }
  return res;
}

export async function getProjects(organizationId: string) {
  const res = await apiFetch(`/organization/${organizationId}/projects`)
  if(res.error) {
    throw new Error(res.message);
  }
  return res;
}

export const getAnalyticsOverview = async (projectId: string) => {
    return apiFetch('/')
}