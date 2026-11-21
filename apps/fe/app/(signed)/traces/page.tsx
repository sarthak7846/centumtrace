import { SearchParams } from "../dashboard/types";
import { resolveSelectedProject } from "@/services/api/projects";
import { getAllTraces } from "@/services/api/traces";
import TracesFilterCard from "@/components/traces/TracesFilterCard";
import TracesList from "@/components/traces/TracesList";
import SummaryMetricCard from "@/components/traces/SummaryMetricCard";

export default async function TracesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const { selectedProject } = await resolveSelectedProject(params.projectId);

  if (!selectedProject) {
    return <p>Create a project to view analytics.</p>;
  }

  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.limit) || 20));

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy: params.sortBy || "createdAt",
    sortOrder: params.sortOrder || "desc",
  });

  const allowedRanges = ["24h", "7d", "30d"];
  const allowedStatuses = ["SUCCESS", "ERROR"];
  const allowedSorts = ["createdAt", "latencyMs", "totalCost"];

  if (params.range && allowedRanges.includes(params.range)) {
    query.set("range", params.range);
  }

  if (params.status && allowedStatuses.includes(params.status)) {
    query.set("status", params.status);
  }

  if (params.sortBy && allowedSorts.includes(params.sortBy)) {
    query.set("sortBy", params.sortBy);
  }

  if (params.sortOrder === "asc" || params.sortOrder === "desc") {
    query.set("sortOrder", params.sortOrder);
  }

  for (const key of [
    "provider",
    "model",
    "traceId",
    "apiKeyId",
    "range",
    "minLatency",
    "maxLatency",
    "minCost",
    "maxCost",
    "minTokens",
    "maxTokens",
  ] as const) {
    const value = params[key]?.trim();
    if (value) query.set(key, value);
  }

  const result = await getAllTraces(selectedProject.id, query);

  function pageUrl(nextPage: number, selectedProjectId: string) {
    const next = new URLSearchParams(query);
    next.set("page", String(nextPage));
    next.set("projectId", selectedProjectId);
    return `/traces?${next.toString()}`;
  }

  return (
    <main className="relative pt-10 bg-[#080b12] min-h-screen w-full px-8 selection:bg-indigo-500/30 selection:text-white">
      <div className="flex flex-col w-full pb-16">
        {/* <!-- Page Header with entrance animation --> */}
        <div className="anim-header flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg pt-4">
          <div className="flex items-start gap-space-md">
            <div className="w-11 h-11 rounded-xl bg-surface-container-high border border-indigo-500/20 flex items-center justify-center shadow-md shadow-indigo-500/10 group cursor-default transition-all duration-300 hover:scale-105 hover:border-indigo-500/40 hover:bg-surface-container-highest">
              <span className="material-symbols-outlined text-primary text-2xl transition-transform duration-300 group-hover:rotate-12">
                troubleshoot
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-sm">
                <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">
                  Trace Explorer
                </h1>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Inspect, filter, and debug your multi-step LLM executions, tool
                calls, and model latency.
              </p>
            </div>
          </div>
          {/* <div className="flex items-center gap-space-sm self-start md:self-auto">
            <button className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-variant hover:border-slate-600/40 border border-transparent transition-all duration-200 text-label-md font-label-md shadow-sm active:scale-95 group">
              <span className="material-symbols-outlined text-base group-hover:-translate-y-0.5 transition-transform">
                file_download
              </span>
              <span>Export CSV</span>
            </button>
            <button className="flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 text-label-md font-label-md shadow-md shadow-primary/20 active:scale-95 group">
              <span className="material-symbols-outlined text-base group-hover:rotate-45 transition-transform">
                tune
              </span>
              <span>Configure Spans</span>
            </button>
          </div> */}
        </div>
        {/* <!-- Top Summary Metric Cards (Interactive Lift & Glow Effects) --> */}
        <SummaryMetricCard result={result} />
        {/* <!-- Quick Filter Tag Pills --> */}
        {/* <div className="flex flex-wrap items-center gap-space-xs mb-space-md">
<span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider pr-1">Quick Filters:</span>
<button className="quick-pill px-3 py-1 rounded-full text-caption font-medium border border-[#23293d] bg-[#101524] text-slate-300 hover:border-error/40 hover:text-red-300 hover:bg-error/10 transition-all duration-200 active:scale-95 flex items-center gap-1" onClick="quickToggleTag(this, 'status', 'ERROR')" type="button">
<span className="w-1.5 h-1.5 rounded-full bg-error"></span> Errors only
  </button>
<button className="quick-pill px-3 py-1 rounded-full text-caption font-medium border border-[#23293d] bg-[#101524] text-slate-300 hover:border-primary/40 hover:text-indigo-300 hover:bg-primary/10 transition-all duration-200 active:scale-95 flex items-center gap-1" onClick="quickToggleTag(this, 'model', 'gpt-4')" type="button">
<span className="material-symbols-outlined text-xs">memory</span> GPT-4
  </button>
<button className="quick-pill px-3 py-1 rounded-full text-caption font-medium border border-[#23293d] bg-[#101524] text-slate-300 hover:border-purple-400/40 hover:text-purple-300 hover:bg-purple-500/10 transition-all duration-200 active:scale-95 flex items-center gap-1" onClick="quickToggleTag(this, 'provider', 'anthropic')" type="button">
<span className="material-symbols-outlined text-xs">cloud</span> Anthropic
  </button>
<button className="quick-pill px-3 py-1 rounded-full text-caption font-medium border border-[#23293d] bg-[#101524] text-slate-300 hover:border-amber-400/40 hover:text-amber-300 hover:bg-amber-500/10 transition-all duration-200 active:scale-95 flex items-center gap-1" onClick="quickFilterLatency()" type="button">
<span className="material-symbols-outlined text-xs">timer</span> High Latency (&gt;1s)
  </button>
</div> */}
        {/* <!-- Trace Filters Card --> */}
        <TracesFilterCard projectId={selectedProject.id} />
        {/* <!-- Traces Table Card with Entrance --> */}
        <TracesList
          result={result}
          pageUrl={pageUrl}
          selectedProjectId={selectedProject.id}
        />
      </div>
    </main>
  );
}
