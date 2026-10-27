import Link from "next/link";
import { getCurrentUser, getProjects, getTraceDetails } from "../../dashboard/actions";

type PageProps = {
  params: Promise<{ traceId: string }>;
  searchParams: Promise<{ projectId?: string }>;
};

function JsonSection({ title, value }: { title: string; value: unknown }) {
  return (
    <section className="space-y-2 rounded-lg border p-4">
      <h2 className="font-semibold">{title}</h2>
      <pre className="overflow-x-auto rounded bg-gray-50 p-3 text-sm">
        {value == null ? "No data available" : JSON.stringify(value, null, 2)}
      </pre>
    </section>
  );
}

export default async function TraceDetailsPage({
  params,
  searchParams,
}: PageProps) {
  const { traceId } = await params;
  const { projectId } = await searchParams;

  const user = await getCurrentUser();
  const organization = user.memberships?.[0]?.organization;

  if (!organization || !projectId) {
    return <p>Project not found.</p>;
  }

  const projects = await getProjects(organization.id);
  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    return <p>Project not found or access denied.</p>;
  }

  const res = await getTraceDetails(project.id, traceId);
  const trace = res.data;

  return (
    <main className="space-y-6 p-6">
      <Link
        href={`/dashboard/traces?projectId=${encodeURIComponent(project.id)}`}
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to traces
      </Link>

      <div>
        <h1 className="text-2xl font-semibold">Trace Details</h1>
        <p className="mt-2 break-all font-mono text-sm text-gray-500">
          {trace.traceId}
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Status</p>
          <p className="mt-1 font-semibold">{trace.status}</p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Provider / Model</p>
          <p className="mt-1 font-semibold">
            {trace.provider} / {trace.model}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Latency</p>
          <p className="mt-1 font-semibold">
            {trace.latencyMs == null ? "—" : `${trace.latencyMs} ms`}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Total tokens</p>
          <p className="mt-1 font-semibold">
            {trace.totalTokens?.toLocaleString() ?? "—"}
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Input tokens</p>
          <p className="mt-1 font-semibold">{trace.inputTokens ?? "—"}</p>
          <p className="mt-2 text-sm text-gray-500">Input cost</p>
          <p>${Number(trace.inputCost ?? 0).toFixed(6)}</p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Output tokens</p>
          <p className="mt-1 font-semibold">{trace.outputTokens ?? "—"}</p>
          <p className="mt-2 text-sm text-gray-500">Output cost</p>
          <p>${Number(trace.outputCost ?? 0).toFixed(6)}</p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Total cost</p>
          <p className="mt-1 font-semibold">
            ${Number(trace.totalCost ?? 0).toFixed(6)}
          </p>
          <p className="mt-2 text-sm text-gray-500">Created</p>
          <p>{new Date(trace.createdAt).toLocaleString()}</p>
        </div>
      </section>

      {trace.status === "ERROR" && (
        <section className="space-y-2 rounded-lg border border-red-200 p-4">
          <h2 className="font-semibold text-red-600">Error details</h2>
          <p>{trace.errorType ?? "Unknown error"}</p>
          <p className="whitespace-pre-wrap text-sm">
            {trace.errorMessage ?? "No error message available"}
          </p>
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <JsonSection title="Input" value={trace.input} />
        <JsonSection title="Output" value={trace.output} />
      </div>

      <JsonSection title="Metadata" value={trace.metadata} />
    </main>
  );
}
