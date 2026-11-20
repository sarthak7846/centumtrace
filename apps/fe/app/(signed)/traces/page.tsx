import Link from "next/link";
import { SearchParams } from "../dashboard/types";
import TraceFilters from "@/components/dashboard/TraceFilters";
import { Activity, Layers3, ListFilter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { resolveSelectedProject } from "@/services/api/projects";
import { getAllTraces } from "@/services/api/traces";
import TracesFilterCard from "@/components/traces/TracesFilterCard";
import TracesList from "@/components/traces/TracesList";
import SummaryMetricCard from "@/components/traces/SummaryMetricCard";

function formatLatency(latencyMs: number | null) {
  if (latencyMs == null) return "—";

  if (latencyMs >= 1000) {
    return `${(latencyMs / 1000).toFixed(2)} s`;
  }

  return `${latencyMs} ms`;
}

function formatCost(cost: string | number | null) {
  if (cost == null) return "—";

  return `$${Number(cost).toFixed(6)}`;
}

function formatTimestamp(timestamp: string) {
  return new Date(timestamp).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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
    <main className="relative pt-16 bg-[#080b12] min-h-screen w-full px-8 selection:bg-indigo-500/30 selection:text-white">
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
                <span className="px-space-xs py-0.5 rounded-full bg-primary/10 text-primary font-caption text-caption font-semibold border border-primary/20 shadow-xs">
                  Live v2.4
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Inspect, filter, and debug your multi-step LLM executions, tool
                calls, and model latency.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-sm self-start md:self-auto">
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
          </div>
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
        <TracesList result={result} />
      </div>
    </main>
    // <main className="space-y-6 p-6">
    //   <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    //     <div className="space-y-1">
    //       <div className="flex items-center gap-2">
    //         <Activity className="size-5 text-muted-foreground" />

    //         <h1 className="text-2xl font-semibold tracking-tight">
    //           Trace Explorer
    //         </h1>
    //       </div>

    //       <p className="text-sm text-muted-foreground">
    //         Inspect, filter, and debug your LLM executions.
    //       </p>
    //     </div>
    //   </div>

    //   <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    //     <Card>
    //       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //         <CardTitle className="text-sm font-medium text-muted-foreground">
    //           Matching traces
    //         </CardTitle>

    //         <Layers3 className="size-4 text-muted-foreground" />
    //       </CardHeader>

    //       <CardContent>
    //         <div className="text-2xl font-semibold tracking-tight">
    //           {result.totalCount.toLocaleString()}
    //         </div>

    //         <p className="mt-1 text-xs text-muted-foreground">
    //           Based on your current filters
    //         </p>
    //       </CardContent>
    //     </Card>

    //     <Card>
    //       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //         <CardTitle className="text-sm font-medium text-muted-foreground">
    //           Results on this page
    //         </CardTitle>

    //         <ListFilter className="size-4 text-muted-foreground" />
    //       </CardHeader>

    //       <CardContent>
    //         <div className="text-2xl font-semibold tracking-tight">
    //           {result.data.length}
    //         </div>

    //         <p className="mt-1 text-xs text-muted-foreground">
    //           Out of {result.totalCount.toLocaleString()} matching traces
    //         </p>
    //       </CardContent>
    //     </Card>

    //     <Card>
    //       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //         <CardTitle className="text-sm font-medium text-muted-foreground">
    //           Current page
    //         </CardTitle>

    //         <Activity className="size-4 text-muted-foreground" />
    //       </CardHeader>

    //       <CardContent>
    //         <div className="text-2xl font-semibold tracking-tight">
    //           {result.page}
    //           <span className="text-base font-normal text-muted-foreground">
    //             {" "}
    //             / {Math.max(1, result.totalPages)}
    //           </span>
    //         </div>

    //         <p className="mt-1 text-xs text-muted-foreground">
    //           {result.limit} traces per page
    //         </p>
    //       </CardContent>
    //     </Card>
    //   </div>

    //   <Card>
    //     <CardHeader className="pb-3">
    //       <CardTitle className="text-base">Filter traces</CardTitle>

    //       <p className="text-sm text-muted-foreground">
    //         Narrow down traces by status, provider, model, ID, or time range.
    //       </p>
    //     </CardHeader>

    //     <CardContent>
    //       <TraceFilters projectId={selectedProject.id} />
    //     </CardContent>
    //   </Card>

    //   <Card>
    //     <CardHeader className="flex flex-row items-center justify-between space-y-0">
    //       <div className="space-y-1">
    //         <CardTitle className="text-base">Traces</CardTitle>

    //         <p className="text-sm text-muted-foreground">
    //           {result.totalCount.toLocaleString()} matching records
    //         </p>
    //       </div>

    //       <Badge variant="secondary">Page {result.page}</Badge>
    //     </CardHeader>

    //     <CardContent>
    //       <div className="overflow-x-auto">
    //         <Table>
    //           <TableHeader>
    //             <TableRow>
    //               <TableHead>Trace</TableHead>
    //               <TableHead>Status</TableHead>
    //               <TableHead>Latency</TableHead>
    //               <TableHead>Tokens</TableHead>
    //               <TableHead>Cost</TableHead>
    //               <TableHead>Created</TableHead>
    //             </TableRow>
    //           </TableHeader>

    //           <TableBody>
    //             {result.data.map((trace) => (
    //               <TableRow key={trace.traceId}>
    //                 <TableCell className="min-w-48">
    //                   <Link
    //                     href={`/traces/${encodeURIComponent(trace.traceId)}?projectId=${encodeURIComponent(selectedProject.id)}`}
    //                     className="font-mono text-sm font-medium hover:underline"
    //                   >
    //                     {trace.traceId}
    //                   </Link>

    //                   <p className="mt-1 text-xs text-muted-foreground">
    //                     {trace.provider} · {trace.model}
    //                   </p>
    //                 </TableCell>

    //                 <TableCell>
    //                   <Badge
    //                     variant="outline"
    //                     className={
    //                       trace.status === "ERROR"
    //                         ? "border-red-500/30 bg-red-500/10 text-red-600"
    //                         : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
    //                     }
    //                   >
    //                     <span
    //                       className={`mr-1.5 size-1.5 rounded-full ${
    //                         trace.status === "ERROR"
    //                           ? "bg-red-500"
    //                           : "bg-emerald-500"
    //                       }`}
    //                     />

    //                     {trace.status}
    //                   </Badge>

    //                   {trace.errorType && (
    //                     <p className="mt-1 max-w-36 truncate text-xs text-muted-foreground">
    //                       {trace.errorType}
    //                     </p>
    //                   )}
    //                 </TableCell>

    //                 <TableCell className="whitespace-nowrap tabular-nums">
    //                   {formatLatency(trace.latencyMs)}
    //                 </TableCell>

    //                 <TableCell className="tabular-nums">
    //                   {trace.totalTokens?.toLocaleString() ?? "—"}
    //                 </TableCell>

    //                 <TableCell className="whitespace-nowrap font-mono text-sm tabular-nums">
    //                   {formatCost(trace.totalCost)}
    //                 </TableCell>

    //                 <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
    //                   {formatTimestamp(trace.createdAt)}
    //                 </TableCell>
    //               </TableRow>
    //             ))}

    //             {result.data.length === 0 && (
    //               <TableRow>
    //                 <TableCell colSpan={6} className="h-40 text-center">
    //                   <div className="flex flex-col items-center gap-2">
    //                     <Layers3 className="size-8 text-muted-foreground/50" />

    //                     <p className="font-medium">No traces found</p>

    //                     <p className="text-sm text-muted-foreground">
    //                       Try adjusting your filters or time range.
    //                     </p>
    //                   </div>
    //                 </TableCell>
    //               </TableRow>
    //             )}
    //           </TableBody>
    //         </Table>
    //       </div>

    //       <div className="flex items-center justify-between text-sm">
    //         <p>
    //           {result.totalCount} traces · Page {result.page} of{" "}
    //           {Math.max(1, result.totalPages)}
    //         </p>

    //         <div className="flex gap-2">
    //           <Link
    //             aria-disabled={page <= 1}
    //             className={`rounded border px-3 py-2 ${page <= 1 ? "pointer-events-none opacity-40" : ""}`}
    //             href={pageUrl(page - 1, selectedProject.id)}
    //           >
    //             Previous
    //           </Link>
    //           <Link
    //             aria-disabled={page >= result.totalPages}
    //             className={`rounded border px-3 py-2 ${page >= result.totalPages ? "pointer-events-none opacity-40" : ""}`}
    //             href={pageUrl(page + 1, selectedProject.id)}
    //           >
    //             Next
    //           </Link>
    //         </div>
    //       </div>
    //     </CardContent>
    //   </Card>
    // </main>
  );
}
