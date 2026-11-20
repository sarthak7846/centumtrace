"use client";

import {
  ErrorBreakdown,
  Range,
  validRanges,
} from "@/app/(signed)/dashboard/types";
import { useState } from "react";

const ErrorsBreakdownTable = ({
  initialErrorBreakdown,
  selectedProjectId,
}: {
  initialErrorBreakdown: ErrorBreakdown;
  selectedProjectId: string;
}) => {
  const [errorBreakdown, setErrorBreakdown] = useState<ErrorBreakdown>(
    initialErrorBreakdown,
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
        `/api/analytics/errors/breakdown?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch error breakdown");
      }

      const updatedErrorBreakdown: ErrorBreakdown = await response.json();

      setErrorBreakdown(updatedErrorBreakdown);
      setSelectedRange(range);
    } catch (error) {
      console.error("Error fetching error breakdown:", error);
      setError("Unable to load analytics data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-space-md mb-space-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-red-400 text-lg">
              error
            </span>
            <h2 className="font-title-md text-title-md text-[#f8fafc] font-semibold">
              Errors breakdown by model
            </h2>
          </div>
          <p className="font-label-sm text-label-sm text-slate-400">
            Inspect error distribution across providers, models, and error
            types.
          </p>
        </div>
        {/* <!-- Meta Badges --> */}
        <div className="flex items-center gap-1.5 flex-wrap">
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
          <span className="px-2.5 py-1 rounded-md bg-[#131828] border border-[#23293d] text-slate-300 font-caption text-xs font-medium">
            Total Traces:{" "}
            <strong className="text-white font-mono">
              {errorBreakdown.totalTraces}
            </strong>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 font-caption text-xs font-medium">
            Error Traces:{" "}
            <strong className="font-mono">{errorBreakdown.errorTraces}</strong>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 font-caption text-xs font-semibold shadow-[0_0_8px_rgba(239,68,68,0.2)]">
            Error Rate: {errorBreakdown.errorRate}%
          </span>
        </div>
      </div>

      {/* <!-- Errors Table --> */}
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0c101c] border-b border-[#1e263d] text-slate-400 font-caption text-caption uppercase tracking-wider">
                <th className="py-3.5 px-space-md font-semibold">Provider</th>
                <th className="py-3.5 px-space-md font-semibold">Model</th>
                <th className="py-3.5 px-space-md font-semibold">Error Type</th>
                <th className="py-3.5 px-space-md font-semibold text-right">
                  Error Count
                </th>
                <th className="py-3.5 px-space-md font-semibold text-right min-w-45">
                  % of Errors
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e263d]">
              {/* <!-- Row 1 --> */}
              {errorBreakdown.data.map(
                ({
                  errorCount,
                  errorType,
                  model,
                  percentageOfErrors,
                  provider,
                }) => (
                  <tr
                    key={`${provider}-${percentageOfErrors}-${model}`}
                    className="hover:bg-[#161f36] transition-all duration-200 group cursor-pointer"
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
                        <span className=" font-caption text-caption px-2 py-0.5 rounded bg-[#1c2438] border border-[#273352] text-slate-200 group-hover:border-indigo-500/50 transition-colors">
                          {model}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-space-md">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-caption text-caption font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                        {errorType}
                      </span>
                    </td>
                    <td className="py-3.5 px-space-md text-right  font-label-md text-label-md text-[#f8fafc] font-semibold">
                      {errorCount}
                    </td>
                    <td className="py-3.5 px-space-md text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 h-1.5 rounded-full bg-[#1c2438] overflow-hidden">
                          <div
                            className="h-full bg-error rounded-full"
                            style={{ width: `${percentageOfErrors}%` }}
                          ></div>
                        </div>
                        <span className=" font-caption text-caption text-slate-300 w-12 text-right">
                          {percentageOfErrors}%
                        </span>
                      </div>
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

export default ErrorsBreakdownTable;
