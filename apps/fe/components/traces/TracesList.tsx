import { TraceResponse } from "@/app/(signed)/dashboard/types";

const TracesList = ({ result }: { result: TraceResponse }) => {
  return (
    <div className="anim-table rounded-xl bg-surface-container-lowest border border-[#1e2436] shadow-sm flex flex-col overflow-hidden">
      {/* <!-- Card Subheader --> */}
      <div className="px-space-lg py-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container-lowest border-b border-[#1e2436]">
        <div className="flex items-center gap-space-sm">
          <h3 className="font-title-md text-title-md text-on-surface font-semibold">
            Traces
          </h3>
          <span
            className="px-2.5 py-0.5 rounded-full bg-surface-container border border-slate-700/40 text-on-surface-variant font-caption text-caption font-medium transition-all"
            id="table-record-count"
          >
            {result.totalCount} matching records
          </span>
        </div>
        <div className="flex items-center gap-space-xs">
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Sort by:
          </span>
          <select className="h-8 px-2 rounded-md bg-surface-container text-on-surface text-label-sm font-label-sm border border-[#1e2436] focus:ring-1 focus:ring-primary cursor-pointer hover:border-slate-600 transition-colors">
            <option>Created Date (desc)</option>
            <option>Latency (high to low)</option>
            <option>Total Cost (high to low)</option>
            <option>Token Count</option>
          </select>
          <span className="px-space-sm py-1 rounded-md bg-surface-container text-on-surface-variant font-caption text-caption border border-[#1e2436]">
            Page 1
          </span>
        </div>
      </div>
      {/* <!-- Responsive Table Container --> */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider select-none border-b border-[#1e2436]">
              <th className="py-space-sm px-space-lg font-medium">
                Trace ID &amp; Model
              </th>
              <th className="py-space-sm px-space-md font-medium">Status</th>
              <th className="py-space-sm px-space-md font-medium">Latency</th>
              <th className="py-space-sm px-space-md font-medium">Tokens</th>
              <th className="py-space-sm px-space-md font-medium">
                Total Cost
              </th>
              <th className="py-space-sm px-space-md font-medium">
                Created Time
              </th>
              <th className="py-space-sm px-space-lg text-right font-medium">
                Inspect
              </th>
            </tr>
          </thead>
          <tbody
            className="divide-y divide-[#161d2e] text-on-surface font-body-md text-body-md"
            id="traces-table-body"
          >
            {/* <!-- Row 1: Error RateLimit --> */}
            <tr
              className="trace-row hover:bg-[#111728] transition-all duration-200 cursor-pointer group"
              data-model="gpt-4"
              data-provider="openai"
              data-status="ERROR"
              // onClick="inspectRow('tr_9a8f4c2e1b')"
            >
              <td className="py-space-md px-space-lg">
                <div className="flex items-center gap-space-sm">
                  <div className="w-2 h-2 rounded-full bg-error ring-2 ring-error/20 group-hover:scale-125 transition-transform"></div>
                  <div className="flex flex-col">
                    <div
                      className="copy-pill inline-flex items-center gap-1.5"
                      // onClick="event.stopPropagation(); copyTraceId('tr_9a8f4c2e1b', this)"
                    >
                      <span className="font-mono font-medium text-primary group-hover:text-indigo-300 transition-colors">
                        tr_9a8f4c2e1b
                      </span>
                      <span
                        className="copy-icon material-symbols-outlined text-xs text-slate-400 opacity-0 group-hover:opacity-60 hover:opacity-100! transition-all hover:text-white"
                        title="Copy Trace ID"
                      >
                        content_copy
                      </span>
                      {/* <span className="copy-tooltip absolute -top-6 left-0 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded shadow border border-slate-700">
                            Copied!
                          </span> */}
                    </div>
                    <span className="font-caption text-caption text-on-surface-variant">
                      openai · gpt-4
                    </span>
                  </div>
                </div>
              </td>
              <td className="py-space-md px-space-md">
                <div className="inline-flex flex-col">
                  <span className="badge-error-glow inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-label-sm font-label-sm bg-red-950/70 border border-error/40 text-red-300 font-semibold shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-error"></span>{" "}
                    ERROR
                  </span>
                  <span className="font-caption text-caption text-error mt-0.5">
                    RateLimitError (429)
                  </span>
                </div>
              </td>
              <td className="py-space-md px-space-md font-mono text-on-surface font-medium group-hover:text-white transition-colors">
                927 ms
              </td>
              <td className="py-space-md px-space-md font-mono text-on-surface-variant">
                8,898
              </td>
              <td className="py-space-md px-space-md font-mono font-medium text-on-surface group-hover:text-white transition-colors">
                $0.125711
              </td>
              <td className="py-space-md px-space-md font-caption text-caption text-on-surface-variant">
                Oct 24, 05:28 AM
              </td>
              <td className="py-space-md px-space-lg text-right">
                <button
                  className="p-1.5 rounded-lg hover:bg-primary/20 text-on-surface-variant hover:text-indigo-300 hover:border-primary/40 border border-transparent transition-all duration-200 group/btn"
                  // onClick="event.stopPropagation(); inspectRow('tr_9a8f4c2e1b')"
                  title="Inspect Trace JSON"
                >
                  <span className="material-symbols-outlined text-lg group-hover/btn:scale-125 transition-transform duration-200">
                    code
                  </span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* <!-- Table Pagination Footer --> */}
      <div className="px-space-lg py-space-md bg-surface-container-low border-t border-[#1e2436] flex flex-col sm:flex-row items-center justify-between gap-space-sm">
        <div className="font-caption text-caption text-on-surface-variant">
          Showing{" "}
          <span className="font-semibold text-on-surface" id="pagination-range">
            1 - 20
          </span>{" "}
          of{" "}
          <span className="font-semibold text-on-surface" id="pagination-total">
            353
          </span>{" "}
          traces · Page 1 of 18
        </div>
        <div className="flex items-center gap-space-xs">
          <button className="group px-space-md py-1.5 rounded-md bg-surface-container border border-[#1e2436] text-on-surface-variant font-label-sm text-label-sm opacity-50 cursor-not-allowed flex items-center gap-1 transition-all">
            <span className="material-symbols-outlined text-base group-hover:-translate-x-0.5 transition-transform">
              chevron_left
            </span>
            <span>Previous</span>
          </button>
          <button className="group px-space-md py-1.5 rounded-md bg-surface-container hover:bg-surface-container-high border border-[#1e2436] hover:border-slate-600 text-on-surface font-label-sm text-label-sm flex items-center gap-1 transition-all active:scale-95 shadow-xs">
            <span>Next</span>
            <span className="material-symbols-outlined text-base group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TracesList;
