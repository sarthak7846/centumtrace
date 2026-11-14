import { LatencyMetrics } from "@/app/(signed)/dashboard/types";

const LatencyMetricCards = ({
  latencyMetrics,
}: {
  latencyMetrics: LatencyMetrics;
}) => {
  const { p50LatencyMs, p95LatencyMs, p99LatencyMs, totalTraces } = latencyMetrics;

  return (
    <div className="anim-entry-4 gap-space-md mb-space-lg w-full">
      <div className="interactive-card rounded-xl bg-surface-container-low p-space-lg shadow-md w-full">
        {/* <!-- Card Header --> */}
        <div className="flex items-center justify-between mb-space-lg">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[24px]">
              timer
            </span>
            <h3 className="font-title-md text-title-md text-on-surface font-bold tracking-tight">
              Latency Performance &amp; Percentiles
            </h3>
          </div>
          <span className="text-caption text-outline font-mono">
            Aggregation: Mean Window
          </span>
        </div>
        {/* <!-- Percentiles 3-Column Grid --> */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-lg">
          {/* <!-- P50 Latency --> */}
          <div className="flex flex-col justify-between p-3 rounded-lg hover:bg-surface-container transition-colors">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-label-md text-label-md font-semibold text-primary">
                  P50 Latency
                </span>
                <span className="font-caption text-caption text-outline px-1.5 py-0.5 rounded bg-surface-container">
                  Median
                </span>
              </div>
              <div className="flex items-baseline gap-1 my-1.5">
                <span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                  {p50LatencyMs.toFixed(0)}
                </span>
                <span className="font-label-sm text-label-sm text-outline font-normal">
                  ms
                </span>
              </div>
            </div>
            <p className="font-caption text-caption text-on-surface-variant mt-2">
              Median response time across {totalTraces} queries
            </p>
          </div>
          {/* <!-- P95 Latency --> */}
          <div className="flex flex-col justify-between p-3 rounded-lg hover:bg-surface-container transition-colors">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-label-md text-label-md font-semibold text-primary">
                  P95 Latency
                </span>
                <span className="font-caption text-caption text-outline px-1.5 py-0.5 rounded bg-surface-container">
                  Tail 5%
                </span>
              </div>
              <div className="flex items-baseline gap-1 my-1.5">
                <span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                  {p95LatencyMs.toFixed(0)}
                </span>
                <span className="font-label-sm text-label-sm text-outline font-normal">
                  ms
                </span>
              </div>
            </div>
            <p className="font-caption text-caption text-on-surface-variant mt-2">
              95% of user interactions finish within this budget
            </p>
          </div>
          {/* <!-- P99 Latency --> */}
          <div className="flex flex-col justify-between p-3 rounded-lg hover:bg-surface-container transition-colors">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-label-md text-label-md font-semibold text-tertiary">
                  P99 Latency
                </span>
                <span className="font-caption text-caption text-outline px-1.5 py-0.5 rounded bg-surface-container">
                  Outliers
                </span>
              </div>
              <div className="flex items-baseline gap-1 my-1.5">
                <span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                  {p99LatencyMs.toFixed(0)}
                </span>
                <span className="font-label-sm text-label-sm text-outline font-normal">
                  ms
                </span>
              </div>
            </div>
            <p className="font-caption text-caption text-on-surface-variant mt-2">
              99% of traces finish within 1.5s max cap
            </p>
          </div>
        </div>
        {/* <!-- Interactive Latency Distribution Bands Section --> */}
        {/* <div className="pt-space-md border-t border-surface-container-high/40">
          <div className="flex justify-between items-center text-caption font-caption text-outline mb-2">
            <span className="font-medium text-on-surface">
              Latency Distribution Bands
            </span>
            <span className="transition-all duration-200" id="band-description">
              &lt;1000ms: <strong className="text-emerald-400">78%</strong> |
              1000-1400ms: <strong className="text-secondary">17%</strong> |
              &gt;1400ms: <strong className="text-error">5%</strong>
            </span>
          </div>
          <div className="w-full h-3 rounded-full flex overflow-hidden gap-1 bg-surface-container-highest p-0.5">
            <div
              className="h-full bg-emerald-400 rounded-l-full w-[78%] transition-all duration-300 hover:brightness-125 cursor-pointer shadow-[0_0_8px_rgba(52,211,153,0.4)]"
              id="band-fast"
              title="Fast (&lt;1000ms): 78% (468 traces)"
            ></div>
            <div
              className="h-full bg-secondary w-[17%] transition-all duration-300 hover:brightness-125 cursor-pointer shadow-[0_0_8px_rgba(208,188,255,0.4)]"
              id="band-medium"
              title="Medium (1000-1400ms): 17% (102 traces)"
            ></div>
            <div
              className="h-full bg-error rounded-r-full w-[5%] transition-all duration-300 hover:brightness-125 cursor-pointer shadow-[0_0_8px_rgba(255,180,171,0.4)]"
              id="band-slow"
              title="Slow (&gt;1400ms): 5% (30 traces)"
            ></div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default LatencyMetricCards;
