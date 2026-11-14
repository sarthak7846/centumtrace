import { OverviewMetrics } from "@/app/(signed)/dashboard/types";

const OverviewMetricCards = ({
  overviewMetrics,
}: {
  overviewMetrics: OverviewMetrics;
}) => {
  const { totalTraces, totalTokens, totalCost, errorRate, averageLatencyMs } =
    overviewMetrics;

  return (
    <div className="anim-entry-2 mb-space-lg">
      <div className="flex items-center justify-between mb-space-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">
            monitoring
          </span>
          <h2 className="font-title-md text-title-md text-on-surface font-semibold tracking-tight">
            Overview Metrics
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
        {/* <!-- Total Traces --> */}
        <div className="interactive-card relative overflow-hidden rounded-xl bg-surface-container-low p-4 shadow-md group cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              Total Traces
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span>
          </div>
          <div className="flex items-baseline justify-between">
            <span
              className="font-headline-xl text-headline-xl text-on-surface tracking-tight group-hover:text-primary transition-colors"
              id="counter-total"
            >
              {totalTraces}
            </span>
          </div>
          {/* <div className="mt-2 flex items-center gap-1 font-caption text-caption text-emerald-400">
            <span className="material-symbols-outlined text-[13px]">
              trending_up
            </span>
            <span>100% active run coverage</span>
          </div> */}
        </div>
        {/* <!-- Error Rate --> */}
        <div className="interactive-card relative overflow-hidden rounded-xl bg-surface-container-low p-4 shadow-md group cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              Error Rate
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-error/40 group-hover:bg-error transition-colors"></span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight group-hover:text-error transition-colors">
              {errorRate.toFixed(2)}
              <span className="font-headline-md text-headline-md text-outline font-normal">
                %
              </span>
            </span>
          </div>
          {/* <div className="mt-2 flex items-center gap-1 font-caption text-caption text-outline">
            <span className="w-1.5 h-1.5 rounded-full bg-error inline-block"></span>
            <span>7 failures logged</span>
          </div> */}
        </div>
        {/* <!-- Average Latency --> */}
        <div className="interactive-card relative overflow-hidden rounded-xl bg-surface-container-low p-4 shadow-md group cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              Average Latency
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary/40 group-hover:bg-secondary transition-colors"></span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight group-hover:text-secondary transition-colors">
              {averageLatencyMs.toFixed(0)}
              <span className="font-headline-md text-headline-md text-outline font-normal">
                {" "}
                ms
              </span>
            </span>
          </div>
          {/* <div className="mt-2 flex items-center gap-1 font-caption text-caption text-emerald-400">
            <span className="material-symbols-outlined text-[13px]">speed</span>
            <span>Optimal response curve</span>
          </div> */}
        </div>
        {/* <!-- Total Cost --> */}
        <div className="interactive-card relative overflow-hidden rounded-xl bg-surface-container-low p-4 shadow-md group cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              Total Cost
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary/40 group-hover:bg-tertiary transition-colors"></span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight group-hover:text-tertiary transition-colors">
              ${totalCost.toFixed(4)}
            </span>
          </div>
          {/* <div className="mt-2 flex items-center gap-1 font-caption text-caption text-outline">
            <span>Free tier sandbox model</span>
          </div> */}
        </div>
        {/* <!-- Total Tokens --> */}
        <div className="interactive-card relative overflow-hidden rounded-xl bg-surface-container-low p-4 shadow-md group cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              Total Tokens
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight group-hover:text-primary transition-colors">
             {totalTokens}
            </span>
          </div>
          {/* <div className="mt-2 flex items-center gap-1 font-caption text-caption text-on-surface-variant">
            <span>Prompt: 19k | Comp: 8.2k</span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default OverviewMetricCards;
