"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Project = {
  id: string;
  name: string;
};

type ProjectSelectorProps = {
  projects: Project[];
  selectedProjectId: string;
};

const ProjectSelector = ({
  projects,
  selectedProjectId,
}: ProjectSelectorProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId,
  );

  const handleChange = (projectId: string) => {
    if (projectId === selectedProjectId) {
      setIsOpen(false);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    params.set("projectId", projectId);
    setIsOpen(false);
    window.dispatchEvent(new Event("navigation-start"));
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="px-space-md py-space-sm relative" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="w-full flex items-center justify-between cursor-pointer px-3 py-2 rounded-lg bg-surface-container/70 hover:bg-surface-container-high text-on-surface transition-all duration-200 border border-outline-variant/30 hover:border-outline-variant/60 focus:outline-none focus:ring-1 focus:ring-primary/50 group"
      >
        <div className="flex items-center gap-2 truncate">
          <span className="material-symbols-outlined text-primary text-[18px] transition-transform group-hover:rotate-12 duration-300">
            neurology
          </span>

          <span className="font-label-sm text-label-sm truncate font-medium">
            {selectedProject?.name ?? "Select Project"}
          </span>
        </div>

        <span
          className={`material-symbols-outlined text-outline text-[16px] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          unfold_more
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Select project"
          className="absolute left-4 right-4 mt-2 rounded-xl bg-surface-container-high/95 backdrop-blur-xl shadow-2xl p-1.5 z-50 flex flex-col gap-1 border border-outline-variant/40"
        >
          <div className="px-space-sm py-1 font-caption text-caption text-outline uppercase tracking-wider">
            Select LLM Service
          </div>

          {projects.map((project) => {
            const isSelected = project.id === selectedProjectId;

            return (
              <button
                key={project.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleChange(project.id)}
                className={`flex items-center justify-between cursor-pointer w-full px-2.5 py-2 rounded-lg text-label-sm font-medium text-left transition-colors ${
                  isSelected
                    ? "bg-surface-container-highest text-on-surface"
                    : "hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isSelected ? "bg-emerald-400" : "bg-tertiary"
                    }`}
                  />

                  <span className="truncate">{project.name}</span>
                </span>

                {isSelected && (
                  <span className="material-symbols-outlined text-primary text-[16px]">
                    check
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectSelector;
