import Link from "next/link";
import { SearchParams } from "../types";
import { getAllTraces, getCurrentUser, getProjects } from "../actions";
import TraceFilters from "@/components/dashboard/TraceFilters";

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

  for (const key of ["provider", "model", "traceId"] as const) {
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

      <div>
        <h1 className="text-2xl font-semibold">Trace Explorer</h1>
        <p className="mt-1 text-sm text-gray-500">
          Inspect LLM requests, latency, token usage, and errors.
        </p>
      </div>

      <p className="text-sm text-gray-500">
        Project: <strong>{selectedProject.name}</strong>
      </p>

      <TraceFilters projectId={selectedProject.id} />

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Trace ID</th>
              <th className="p-3">Provider / Model</th>
              <th className="p-3">Status</th>
              <th className="p-3">Latency</th>
              <th className="p-3">Tokens</th>
              <th className="p-3">Cost</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>

          <tbody>
            {result.data.map((trace) => (
              <tr key={trace.traceId} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <Link
                    className="font-mono text-blue-600 hover:underline"
                    href={`/dashboard/traces/${encodeURIComponent(trace.traceId)}?projectId=${encodeURIComponent(selectedProject.id)}`}
                  >
                    {trace.traceId}
                  </Link>
                </td>
                <td className="p-3">
                  <div>{trace.provider}</div>
                  <div className="text-gray-500">{trace.model}</div>
                </td>
                <td className="p-3">
                  <span
                    className={
                      trace.status === "ERROR"
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  >
                    {trace.status}
                  </span>
                  {trace.errorType && (
                    <div className="text-xs text-red-500">
                      {trace.errorType}
                    </div>
                  )}
                </td>
                <td className="p-3">
                  {trace.latencyMs == null ? "—" : `${trace.latencyMs} ms`}
                </td>
                <td className="p-3">
                  {trace.totalTokens?.toLocaleString() ?? "—"}
                </td>
                <td className="p-3">
                  {trace.totalCost == null
                    ? "—"
                    : `$${Number(trace.totalCost).toFixed(6)}`}
                </td>
                <td className="p-3">
                  {new Date(trace.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}

            {result.data.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  No traces found for these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
    </main>
  );
}
