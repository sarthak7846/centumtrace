"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (projectId: string) => {
    console.log('pathname', pathname)
    const params = new URLSearchParams(searchParams.toString());
    params.set("projectId", projectId);
    router.replace(`${pathname}?${params.toString()}`);
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
