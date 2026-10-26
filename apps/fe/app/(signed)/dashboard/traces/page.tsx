import Link from "next/link";
import { SearchParams } from "../types";
import { getAllTraces, getCurrentUser, getProjects } from "../actions";
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
  const user = await getCurrentUser();
  const organization = user.memberships?.[0]?.organization;

  if (!organization) {
    return <p>No organization found.</p>;
  }

  const projects = await getProjects(organization.id);

  if (!projects.length) {
    return <p>Create a project before viewing traces.</p>;
  }

  // Only allow a project the user can access.
  const selectedProject =
    projects.find((project) => project.id === params.projectId) ?? projects[0];

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

  function pageUrl(nextPage: number) {
    const next = new URLSearchParams(query);
    next.set("page", String(nextPage));
    next.set("projectId", selectedProject.id);
    return `/dashboard/traces?${next.toString()}`;
  }

  return (
    <main className="space-y-6 p-6">
      <Link
        href={`/dashboard`}
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to dashboard
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="size-5 text-muted-foreground" />

            <h1 className="text-2xl font-semibold tracking-tight">
              Trace Explorer
            </h1>
          </div>

          <p className="text-sm text-muted-foreground">
            Inspect, filter, and debug your LLM executions.
          </p>
        </div>

        <Badge variant="outline" className="w-fit gap-2 px-3 py-1.5">
          <span className="size-2 rounded-full bg-emerald-500" />
          {selectedProject.name}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Matching traces
            </CardTitle>

            <Layers3 className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-semibold tracking-tight">
              {result.totalCount.toLocaleString()}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Based on your current filters
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Results on this page
            </CardTitle>

            <ListFilter className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-semibold tracking-tight">
              {result.data.length}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Out of {result.totalCount.toLocaleString()} matching traces
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current page
            </CardTitle>

            <Activity className="size-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-semibold tracking-tight">
              {result.page}
              <span className="text-base font-normal text-muted-foreground">
                {" "}
                / {Math.max(1, result.totalPages)}
              </span>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              {result.limit} traces per page
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filter traces</CardTitle>

          <p className="text-sm text-muted-foreground">
            Narrow down traces by status, provider, model, ID, or time range.
          </p>
        </CardHeader>

        <CardContent>
          <TraceFilters projectId={selectedProject.id} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-base">Traces</CardTitle>

            <p className="text-sm text-muted-foreground">
              {result.totalCount.toLocaleString()} matching records
            </p>
          </div>

          <Badge variant="secondary">Page {result.page}</Badge>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trace</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Latency</TableHead>
                  <TableHead>Tokens</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {result.data.map((trace) => (
                  <TableRow key={trace.traceId}>
                    <TableCell className="min-w-48">
                      <Link
                        href={`/dashboard/traces/${encodeURIComponent(trace.traceId)}?projectId=${encodeURIComponent(selectedProject.id)}`}
                        className="font-mono text-sm font-medium hover:underline"
                      >
                        {trace.traceId}
                      </Link>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {trace.provider} · {trace.model}
                      </p>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          trace.status === "ERROR"
                            ? "border-red-500/30 bg-red-500/10 text-red-600"
                            : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                        }
                      >
                        <span
                          className={`mr-1.5 size-1.5 rounded-full ${
                            trace.status === "ERROR"
                              ? "bg-red-500"
                              : "bg-emerald-500"
                          }`}
                        />

                        {trace.status}
                      </Badge>

                      {trace.errorType && (
                        <p className="mt-1 max-w-36 truncate text-xs text-muted-foreground">
                          {trace.errorType}
                        </p>
                      )}
                    </TableCell>

                    <TableCell className="whitespace-nowrap tabular-nums">
                      {formatLatency(trace.latencyMs)}
                    </TableCell>

                    <TableCell className="tabular-nums">
                      {trace.totalTokens?.toLocaleString() ?? "—"}
                    </TableCell>

                    <TableCell className="whitespace-nowrap font-mono text-sm tabular-nums">
                      {formatCost(trace.totalCost)}
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {formatTimestamp(trace.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}

                {result.data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Layers3 className="size-8 text-muted-foreground/50" />

                        <p className="font-medium">No traces found</p>

                        <p className="text-sm text-muted-foreground">
                          Try adjusting your filters or time range.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between text-sm">
            <p>
              {result.totalCount} traces · Page {result.page} of{" "}
              {Math.max(1, result.totalPages)}
            </p>

            <div className="flex gap-2">
              <Link
                aria-disabled={page <= 1}
                className={`rounded border px-3 py-2 ${page <= 1 ? "pointer-events-none opacity-40" : ""}`}
                href={pageUrl(page - 1)}
              >
                Previous
              </Link>
              <Link
                aria-disabled={page >= result.totalPages}
                className={`rounded border px-3 py-2 ${page >= result.totalPages ? "pointer-events-none opacity-40" : ""}`}
                href={pageUrl(page + 1)}
              >
                Next
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
