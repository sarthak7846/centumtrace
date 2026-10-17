"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function TraceFilters({ projectId }: { projectId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    params.set("projectId", projectId);
    params.set("page", "1"); // Reset pagination when filters change.

    for (const key of ["status", "provider", "model", "traceId", "range"]) {
      const value = String(formData.get(key) ?? "").trim();

      if (value) {
        params.set(key, value);
      }
    }

    // Preserve sorting when applying filters.
    params.set("sortBy", searchParams.get("sortBy") ?? "createdAt");
    params.set("sortOrder", searchParams.get("sortOrder") ?? "desc");

    router.push(`/dashboard/traces?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <label className="grid gap-1 text-sm">
        Status
        <select
          name="status"
          defaultValue={searchParams.get("status") ?? ""}
          className="rounded border p-2"
        >
          <option value="">All statuses</option>
          <option value="SUCCESS">Success</option>
          <option value="ERROR">Error</option>
        </select>
      </label>

      <label className="grid gap-1 text-sm">
        Provider
        <input
          name="provider"
          defaultValue={searchParams.get("provider") ?? ""}
          placeholder="openai"
          className="rounded border p-2"
        />
      </label>

      <label className="grid gap-1 text-sm">
        Model
        <input
          name="model"
          defaultValue={searchParams.get("model") ?? ""}
          placeholder="gpt-5"
          className="rounded border p-2"
        />
      </label>

      <label className="grid gap-1 text-sm">
        Trace ID
        <input
          name="traceId"
          defaultValue={searchParams.get("traceId") ?? ""}
          placeholder="Search trace ID"
          className="rounded border p-2"
        />
      </label>

      <label className="grid gap-1 text-sm">
        Time range
        <select
          name="range"
          defaultValue={searchParams.get("range") ?? ""}
          className="rounded border p-2"
        >
          <option value="">All time</option>
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
      </label>

      <button type="submit" className="rounded bg-black px-4 py-2 text-white">
        Apply filters
      </button>
    </form>
  );
}
