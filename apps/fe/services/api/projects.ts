import { Project } from "@/app/(signed)/dashboard/types";
import { apiFetch } from "@/lib/api";
import { getCurrentUser } from "./user";
import { cache } from "react";

export const getSignedInProjects = cache(async () => {
  const user = await getCurrentUser();

  const organization = user.memberships[0]?.organization;

  if (!organization) {
    throw new Error("No organization found");
  }

  const projects = await getProjects(organization.id);

  return projects;
});

export async function resolveSelectedProject(projectId?: string) {
  const projects = await getSignedInProjects();

  if (projects.length === 0) {
    return { projects, selectedProject: null };
  }

  const selectedProject =
    projects.find((project) => project.id === projectId) ?? projects[0];

  return { projects, selectedProject };
}

export async function getProjects(organizationId: string): Promise<Project[]> {
  const res = await apiFetch(`/organization/${organizationId}/projects`);
  if (res.error) {
    throw new Error(res.message);
  }
  return res;
}
