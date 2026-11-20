"use client";

import {
  LatencyBreakdown,
  Range,
  validRanges,
} from "@/app/(signed)/dashboard/types";
import { useState } from "react";

const LatencyBreakdownTable = ({
  initialLatencyBreakdown,
  selectedProjectId,
}: {
  initialLatencyBreakdown: LatencyBreakdown;
  selectedProjectId: string;
}) => {
  const [latencyBreakdown, setLatencyBreakdown] = useState<LatencyBreakdown>(
    initialLatencyBreakdown,
  );
  const [selectedRange, setSelectedRange] = useState<Range>("24h");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRangeChange = async (range: Range) => {
    if (range === selectedRange) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        projectId: selectedProjectId,
        range,
      });

      const response = await fetch(
        `/api/analytics/latency/breakdown?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch latency breakdown");
      }

      const updatedLatencyBreakdown: LatencyBreakdown = await response.json();

      setLatencyBreakdown(updatedLatencyBreakdown);
      setSelectedRange(range);
    } catch (error) {
      console.error("Error fetching latency trend:", error);
      setError("Unable to load analytics data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-space-md mb-space-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
        <div>
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-emerald-400 text-lg">
              speed_4_progress
            </span>
            <h2 className="font-title-md text-title-md text-[#f8fafc] font-semibold">
              Latency by model
            </h2>
          </div>

          <p className="font-label-sm text-label-sm text-slate-400">
            Compare performance across providers and models.
          </p>
        </div>
        <div className="flex items-center gap-space-xs">
          <div className="flex items-center gap-space-xs mr-2">
            <span className="font-caption text-caption text-slate-400">
              Range:
            </span>
            <div className="range-selector-group flex items-center bg-[#131828] p-0.5 rounded-lg border border-[#23293d]">
              {validRanges.map((range) => {
                const isSelected = selectedRange === range;

                return (
                  <button
                    key={range}
                    type="button"
                    onClick={() => handleRangeChange(range)}
                    aria-pressed={isSelected}
                    className={`range-pill px-2.5 py-1 rounded-md cursor-pointer transition-all ${
                      isSelected
                        ? "text-xs font-semibold text-white bg-indigo-600 shadow-sm"
                        : "text-xs font-medium text-slate-400 hover:text-white"
                    }`}
                  >
                    {range}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {/* <div className="flex items-center gap-space-xs">
          <span className="font-caption text-caption text-slate-400">
            Sort by:
          </span>
          <div
            className="flex items-center bg-[#131828] p-0.5 rounded-lg border border-[#23293d]"
            id="sortControls"
          >
            <button
              className="sort-btn active px-2.5 py-1 rounded-md text-xs font-semibold text-white bg-indigo-600 transition-all shadow-sm"
              data-sort="requests"
              type="button"
            >
              Requests (Desc)
            </button>
            <button
              className="sort-btn px-2.5 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-white transition-all"
              data-sort="latency"
              type="button"
            >
              Avg Latency
            </button>
            <button
              className="sort-btn px-2.5 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-white transition-all"
              data-sort="p95"
              type="button"
            >
              P95
            </button>
          </div>
        </div> */}
      </div>
      {/* <!-- Clean Data Table Container --> */}
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="overflow-x-auto rounded-xl bg-[#0f1424] border border-[#1e263d] shadow-xl">
        {isLoading ? (
          <div className="flex items-center justify-center bg-surface-container-low/50 backdrop-blur-[1px] rounded-lg">
            <div className="flex items-center gap-2 text-sm text-primary py-10">
              <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              Fetching data for selected range...
            </div>
          </div>
        ) : (
          <table
            className="w-full text-left border-collapse"
            id="modelBenchmarkTable"
          >
            <thead>
              <tr className="bg-[#0c101c] border-b border-[#1e263d] text-slate-400 font-caption text-caption uppercase tracking-wider">
                <th className="py-3.5 px-space-md font-semibold">Provider</th>
                <th className="py-3.5 px-space-md font-semibold">Model</th>
                <th className="py-3.5 px-space-md font-semibold text-right">
                  Trace Count
                </th>
                <th className="py-3.5 px-space-md font-semibold text-right">
                  Avg. Latency
                </th>
                <th className="py-3.5 px-space-md font-semibold text-right">
                  P50
                </th>
                <th className="py-3.5 px-space-md font-semibold text-right">
                  P95
                </th>
                <th className="py-3.5 px-space-md font-semibold text-right">
                  P99
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e263d]" id="tableBody">
              {/* <!-- Row 1: GPT-5 --> */}
              {latencyBreakdown.data.map(
                ({
                  provider,
                  model,
                  traceCount,
                  averageLatencyMs,
                  p50LatencyMs,
                  p95LatencyMs,
                  p99LatencyMs,
                }) => (
                  <tr
                    key={`${provider}-${model}`}
                    className="model-row hover:bg-[#161f36] transition-all duration-200 group cursor-pointer hover:shadow-inner"
                    data-latency="950"
                    data-p95="1420"
                    data-requests="120"
                  >
                    <td className="py-3.5 px-space-md">
                      <span className="font-body-md text-body-md text-slate-300 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base text-slate-400 group-hover:text-indigo-400 transition-colors">
                          smart_toy
                        </span>
                        {provider}
                      </span>
                    </td>
                    <td className="py-3.5 px-space-md">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono  text-caption px-2 py-0.5 rounded bg-[#1c2438] border border-[#273352] text-slate-200 group-hover:border-indigo-500/50 transition-colors">
                          {model}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-space-md text-right  font-label-md text-label-md text-[#f8fafc] font-medium">
                      {traceCount}
                    </td>
                    <td className="py-3.5 px-space-md text-right  font-label-md text-label-md text-[#f8fafc]">
                      {averageLatencyMs} ms
                    </td>
                    <td className="py-3.5 px-space-md text-right  font-label-md text-label-md text-[#f8fafc] font-semibold">
                      {p95LatencyMs} ms
                    </td>
                    <td className="py-3.5 px-space-md text-right  font-label-md text-label-md text-[#f8fafc] font-semibold">
                      {p50LatencyMs} ms
                    </td>
                    <td className="py-3.5 px-space-md text-right  font-label-md text-label-md text-[#f8fafc] font-semibold">
                      {p99LatencyMs} ms
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LatencyBreakdownTable;
