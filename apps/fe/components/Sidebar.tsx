"use client";

import { Project } from "@/app/(signed)/dashboard/types";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import ProjectSelector from "./dashboard/ProjectSelector";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: "grid_view",
  },
  {
    href: "/traces",
    label: "LLM Traces",
    icon: "reorder",
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: "analytics",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: "tune",
  },
  // {
  //   href: "/status-page",
  //   label: "Status Pages",
  //   icon: (
  //     <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
  //       <path
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //         strokeWidth={2}
  //         d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
  //       />
  //     </svg>
  //   ),
  // },
  // {
  //   href: "/notifications",
  //   label: "Notifications",
  //   icon: (
  //     <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
  //       <path
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //         strokeWidth={2}
  //         d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
  //       />
  //     </svg>
  //   ),
  // },
] as const;

const Sidebar = ({ projects }: { projects: Project[] }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const selectedProject =
    projects.find((project) => project.id === projectId) ?? projects[0];

  return (
    <aside className="anim-sidebar fixed left-0 top-0 h-full w-64 bg-surface-container-low/95 backdrop-blur-xl z-50 flex flex-col justify-between border-r border-surface-container-high/40 shadow-[0_1px_16px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col">
        {/* <!-- Brand Header --> */}
        <div className="h-16 px-space-md flex items-center justify-between border-b border-surface-container-high/30">
          <div className="flex items-center gap-space-sm group cursor-pointer">
            <span className="material-symbols-outlined text-emerald-400 text-[20px]">
            legend_toggle
          </span>
            <Link
              href="/"
              className="font-title-md text-title-md font-bold tracking-tight text-on-surface transition-colors duration-200 group-hover:text-primary"
            >
              Centum Trace
            </Link>
          </div>
          {/* <span className="font-caption text-caption px-space-xs py-0.5 rounded bg-surface-container-high text-primary border border-primary/20 shadow-xs">
            v2.4
          </span> */}
        </div>
        {/* <!-- Project Selector Dropdown Button --> */}
        <ProjectSelector
          projects={projects}
          selectedProjectId={selectedProject.id}
        />
        {/* <!-- Navigation links with smooth hover pill transitions --> */}
        <nav
          className="flex flex-col gap-1 px-space-md py-space-xs"
          id="sidebar-nav"
        >
          {navItems.map(({ href, label, icon }) => {
            const isActive =
              pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                href={href}
                key={href}
                className={`nav-item flex items-center gap-space-sm px-3 py-2 rounded-lg transition-all duration-200 group ${isActive ? "bg-primary-container text-on-primary-container font-semibold shadow-sm shadow-primary-container/30 relative overflow-hidden" : "text-on-surface-variant hover:bg-surface-container-high/80 hover:text-on-surface font-label-md text-label-md"}`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${!isActive && "group-hover:text-primary transition-colors"}`}
                >
                  {icon}
                </span>
                <span>{label}</span>
              </Link>
            );
          })}
          {/* <a
            className="nav-item flex items-center gap-space-sm px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high/80 hover:text-on-surface transition-all duration-200 font-label-md text-label-md group"
            data-path="llm-traces"
            href="#"
          >
            <span className="material-symbols-outlined text-[20px] text-outline group-hover:text-primary transition-colors">
              reorder
            </span>
            <span>LLM Traces</span>
          </a>
          <a
            className="nav-item flex items-center gap-space-sm px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high/80 hover:text-on-surface transition-all duration-200 font-label-md text-label-md group"
            data-path="evaluations"
            href="#"
          >
            <span className="material-symbols-outlined text-[20px] text-outline group-hover:text-primary transition-colors">
              fact_check
            </span>
            <span>Evaluations</span>
          </a>
          <a
            className="nav-item flex items-center gap-space-sm px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high/80 hover:text-on-surface transition-all duration-200 font-label-md text-label-md group"
            data-path="latency-and-cost"
            href="#"
          >
            <span className="material-symbols-outlined text-[20px] text-outline group-hover:text-primary transition-colors">
              payments
            </span>
            <span>Latency &amp; Cost</span>
          </a>
          <a
            className="nav-item flex items-center gap-space-sm px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high/80 hover:text-on-surface transition-all duration-200 font-label-md text-label-md group"
            data-path="guardrails"
            href="#"
          >
            <span className="material-symbols-outlined text-[20px] text-outline group-hover:text-primary transition-colors">
              shield_lock
            </span>
            <span>Guardrails</span>
          </a>
          <a
            className="nav-item flex items-center gap-space-sm px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high/80 hover:text-on-surface transition-all duration-200 font-label-md text-label-md group"
            data-path="settings"
            href="#"
          >
            <span className="material-symbols-outlined text-[20px] text-outline group-hover:text-primary transition-colors">
              tune
            </span>
            <span>Settings</span>
          </a> */}
        </nav>
      </div>
      {/* <!-- Bottom Telemetry Card: Quota with shimmer --> */}
      <div className="px-space-md pb-space-lg flex flex-col gap-space-sm">
        {/* <div className="p-3.5 rounded-xl bg-surface-container/60 border border-outline-variant/30 flex flex-col gap-2 relative overflow-hidden group hover:border-tertiary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-caption text-caption text-outline font-medium tracking-wide">
              Observability Quota
            </span>
            <span className="font-caption text-caption text-tertiary font-bold px-1.5 py-0.5 rounded bg-tertiary/10">
              78%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
            <div
              className="h-full rounded-full w-[78%] shimmer-progress transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(76,215,246,0.5)]"
              id="quota-fill-bar"
            ></div>
          </div>
          <div className="flex items-center justify-between font-caption text-caption text-on-surface-variant">
            <span>782k / 1M token calls</span>
            <span className="text-tertiary font-mono text-[10px]">Active</span>
          </div>
        </div> */}
        <a
          className="flex items-center justify-between px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 font-label-sm text-label-sm group border border-transparent hover:border-outline-variant/30"
          data-path="documentation"
          href="#"
        >
          <span className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[18px] group-hover:text-primary transition-colors">
              menu_book
            </span>
            Documentation
          </span>
          <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
            north_east
          </span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
