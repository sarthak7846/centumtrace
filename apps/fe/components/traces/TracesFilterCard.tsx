"use client";

import { useRouter, useSearchParams } from "next/navigation";

export const traceFilterQueryFields = [
  "status",
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
];

const TracesFilterCard = ({ projectId }: { projectId: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    params.set("projectId", projectId);
    params.set("page", "1"); // Reset pagination when filters change.

    for (const key of traceFilterQueryFields) {
      const value = String(formData.get(key) ?? "").trim();

      if (value) {
        params.set(key, value);
      }
    }

    // Preserve sorting when applying filters.
    params.set("sortBy", searchParams.get("sortBy") ?? "createdAt");
    params.set("sortOrder", searchParams.get("sortOrder") ?? "desc");

    router.push(`/traces?${params.toString()}`);
  }

  return (
    <div className="anim-filters p-space-lg rounded-xl bg-surface-container-lowest border border-[#1e2436] shadow-sm mb-space-lg flex flex-col gap-space-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pb-space-sm border-b border-[#1e2436]">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-lg">
              tune
            </span>
            <h2 className="font-title-md text-title-md text-on-surface font-semibold">
              Filter traces
            </h2>
          </div>
          <p className="font-caption text-caption text-on-surface-variant">
            Narrow down execution spans by status, model, latency, tokens, cost
            threshold, or run identifier.
          </p>
        </div>
        <div className="flex items-center gap-space-sm self-end md:self-auto">
          <button
            className="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high border border-transparent hover:border-slate-700 text-on-surface font-label-md text-label-md transition-all active:scale-95 duration-150"
            id="reset-filter-btn"
            type="button"
          >
            Reset filters
          </button>
          <button
            className="relative overflow-hidden flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md shadow-md shadow-primary/20 hover:shadow-primary/35 transition-all duration-200 active:scale-95"
            id="apply-filter-btn"
            type="button"
          >
            <span
              className="material-symbols-outlined text-base transition-transform duration-300"
              id="apply-btn-icon"
            >
              filter_alt
            </span>
            <span id="apply-btn-label">Apply filters</span>
          </button>
        </div>
      </div>
      <form className="flex flex-col gap-space-md" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {/* <!-- Status Dropdown --> */}
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface font-medium">
              Status
            </label>
            <div className="relative select-wrapper fancy-input-wrap rounded-lg bg-surface-container-low border border-[#1e2436]">
              <select
                className="w-full h-10 pl-3 pr-8 rounded-lg bg-transparent text-on-surface text-body-md font-body-md border-0 focus:ring-0 cursor-pointer appearance-none"
                id="status-filter"
                name="status"
                defaultValue={searchParams.get("status") ?? ""}
              >
                <option value="ALL">All statuses</option>
                <option value="SUCCESS">Success</option>
                <option value="ERROR">Error</option>
              </select>
              <span className="select-chevron material-symbols-outlined text-slate-400 text-sm absolute right-2.5 top-3 pointer-events-none transition-transform duration-200">
                expand_more
              </span>
            </div>
          </div>
          {/* <!-- Time Range Dropdown --> */}
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface font-medium">
              Time Range
            </label>
            <div className="relative select-wrapper fancy-input-wrap rounded-lg bg-surface-container-low border border-[#1e2436]">
              <select
                className="w-full h-10 pl-3 pr-8 rounded-lg bg-transparent text-on-surface text-body-md font-body-md border-0 focus:ring-0 cursor-pointer appearance-none"
                id="range-filter"
                name="range"
                defaultValue={searchParams.get("range") ?? ""}
              >
                <option value="all">All time</option>
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>
              <span className="select-chevron material-symbols-outlined text-slate-400 text-sm absolute right-2.5 top-3 pointer-events-none transition-transform duration-200">
                expand_more
              </span>
            </div>
          </div>
          {/* <!-- Provider Filter --> */}
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface font-medium">
              Provider
            </label>
            <div className="fancy-input-wrap flex items-center gap-space-xs px-3 h-10 rounded-lg bg-surface-container-low text-on-surface border border-[#1e2436]">
              <span className="material-symbols-outlined text-outline text-base">
                cloud
              </span>
              <input
                className="w-full bg-transparent border-0 outline-none text-body-md font-body-md text-on-surface placeholder:text-outline p-0 focus:ring-0"
                id="provider-filter"
                name="provider"
                placeholder="openai"
                type="text"
                defaultValue={searchParams.get("provider") ?? ""}
              />
            </div>
          </div>
          {/* <!-- Model Filter --> */}
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface font-medium">
              Model
            </label>
            <div className="fancy-input-wrap flex items-center gap-space-xs px-3 h-10 rounded-lg bg-surface-container-low text-on-surface border border-[#1e2436]">
              <span className="material-symbols-outlined text-outline text-base">
                memory
              </span>
              <input
                className="w-full bg-transparent border-0 outline-none text-body-md font-body-md text-on-surface placeholder:text-outline p-0 focus:ring-0"
                id="model-filter"
                name="model"
                placeholder="gpt-5"
                type="text"
                defaultValue={searchParams.get("model") ?? ""}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
          {/* <!-- Trace ID Search --> */}
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface font-medium">
              Trace ID
            </label>
            <div className="fancy-input-wrap flex items-center gap-space-xs px-3 h-10 rounded-lg bg-surface-container-low text-on-surface border border-[#1e2436]">
              <span className="material-symbols-outlined text-outline text-base">
                search
              </span>
              <input
                className="w-full bg-transparent border-0 outline-none text-body-md font-body-md text-on-surface placeholder:text-outline p-0 focus:ring-0"
                id="trace-search-input"
                name="traceId"
                placeholder="Search trace ID"
                type="text"
                defaultValue={searchParams.get("traceId") ?? ""}
              />
            </div>
          </div>
          {/* <!-- API Key ID --> */}
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface font-medium">
              API Key ID
            </label>
            <div className="fancy-input-wrap flex items-center gap-space-xs px-3 h-10 rounded-lg bg-surface-container-low text-on-surface border border-[#1e2436]">
              <span className="material-symbols-outlined text-outline text-base">
                key
              </span>
              <input
                className="w-full bg-transparent border-0 outline-none text-body-md font-body-md text-on-surface placeholder:text-outline p-0 focus:ring-0"
                id="api-key-filter"
                name="apiKeyId"
                placeholder="Search api key ID"
                type="text"
                defaultValue={searchParams.get("apiKeyId") ?? ""}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
          <div className="flex flex-col gap-1 p-space-sm rounded-lg bg-surface-container-low/50 border border-[#1e2436] transition-all hover:border-slate-700">
            <span className="font-label-sm text-label-sm text-on-surface font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-base text-primary">
                timer
              </span>{" "}
              Latency (ms)
            </span>
            <div className="grid grid-cols-2 gap-space-xs">
              <input
                className="fancy-input-wrap w-full h-9 px-2.5 rounded-md bg-surface-container-low border border-[#1e2436] outline-none text-body-md font-body-md text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/40"
                id="min-latency-input"
                name="minLatency"
                placeholder="Search min latency"
                type="text"
                defaultValue={searchParams.get("minLatency") ?? ""}
              />
              <input
                className="fancy-input-wrap w-full h-9 px-2.5 rounded-md bg-surface-container-low border border-[#1e2436] outline-none text-body-md font-body-md text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/40"
                id="max-latency-input"
                name="maxLatency"
                placeholder="Search max latency"
                type="text"
                defaultValue={searchParams.get("maxLatency") ?? ""}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 p-space-sm rounded-lg bg-surface-container-low/50 border border-[#1e2436] transition-all hover:border-slate-700">
            <span className="font-label-sm text-label-sm text-on-surface font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-base text-primary">
                payments
              </span>{" "}
              Cost ($)
            </span>
            <div className="grid grid-cols-2 gap-space-xs">
              <input
                className="fancy-input-wrap w-full h-9 px-2.5 rounded-md bg-surface-container-low border border-[#1e2436] outline-none text-body-md font-body-md text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/40"
                id="min-cost-input"
                name="minCost"
                placeholder="Search min cost"
                type="text"
                defaultValue={searchParams.get("minCost") ?? ""}
              />
              <input
                className="fancy-input-wrap w-full h-9 px-2.5 rounded-md bg-surface-container-low border border-[#1e2436] outline-none text-body-md font-body-md text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/40"
                id="max-cost-input"
                name="maxCost"
                placeholder="Search max cost"
                type="text"
                defaultValue={searchParams.get("maxCost") ?? ""}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 p-space-sm rounded-lg bg-surface-container-low/50 border border-[#1e2436] transition-all hover:border-slate-700">
            <span className="font-label-sm text-label-sm text-on-surface font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-base text-primary">
                token
              </span>{" "}
              Tokens
            </span>
            <div className="grid grid-cols-2 gap-space-xs">
              <input
                className="fancy-input-wrap w-full h-9 px-2.5 rounded-md bg-surface-container-low border border-[#1e2436] outline-none text-body-md font-body-md text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/40"
                id="min-tokens-input"
                name="minTokens"
                placeholder="Search min tokens"
                type="text"
                defaultValue={searchParams.get("minTokens") ?? ""}
              />
              <input
                className="fancy-input-wrap w-full h-9 px-2.5 rounded-md bg-surface-container-low border border-[#1e2436] outline-none text-body-md font-body-md text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary/40"
                id="max-tokens-input"
                name="maxTokens"
                placeholder="Search max tokens"
                type="text"
                defaultValue={searchParams.get("maxTokens") ?? ""}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TracesFilterCard;
