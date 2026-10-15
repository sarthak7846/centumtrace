"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Project = {
  id: string;
  name: string;
};

type ProjectSelectorProps = {
  projects: Project[];
  selectedProjectId: string;
};

export default function ProjectSelector({
  projects,
  selectedProjectId,
}: ProjectSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (projectId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("projectId", projectId);
    router.replace(`/dashboard?${params.toString()}`);
  };

  return (
    <select
      value={selectedProjectId}
      onChange={(event) => handleChange(event.target.value)}
    >
      {projects.map((project) => (
        <option key={project.id} value={project.id}>
          {project.name}
        </option>
      ))}
    </select>
  );
}
