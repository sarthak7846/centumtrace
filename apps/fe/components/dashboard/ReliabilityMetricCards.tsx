import { ReliabilityMetrics } from "@/app/(signed)/dashboard/types";

const ReliabilityMetricCards = ({
  reliabilityMetrics,
}: {
  reliabilityMetrics: ReliabilityMetrics;
}) => {
  const { errorTraces, successfulTraces, errorRate, totalTraces } =
    reliabilityMetrics;

  return (
    <div className="anim-entry-3 mb-space-lg">
      <div className="flex items-center justify-between mb-space-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-[20px]">
            verified
          </span>
          <h2 className="font-title-md text-title-md text-on-surface font-semibold">
            Reliability &amp; Execution Health
          </h2>
        </div>
        <span className="font-caption text-caption text-outline px-2.5 py-0.5 rounded-full bg-surface-container-low border border-surface-container-high/40">
          {(100 - errorRate).toFixed(2)}% Total Success Ratio
        </span>
      </div>
      <div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
        {/* <!-- Successful Traces Card --> */}
        <div className="interactive-card rounded-xl bg-surface-container-low p-space-md shadow-md flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                Successful Traces
              </span>
              <span className="material-symbols-outlined text-emerald-400 text-[18px] group-hover:scale-110 transition-transform">
                check_circle
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                {successfulTraces}
              </span>
              <span className="font-label-sm text-label-sm text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-400/10">
                {(100 - errorRate).toFixed(2)}%
              </span>
            </div>
          </div>
          <div>
            <div
              className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden mb-2 relative group/bar cursor-pointer"
              title="593 Successful completions (98.83%)"
            >
              <div
                className="h-full bg-emerald-400 rounded-full w-0 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(52,211,153,0.6)] group-hover/bar:brightness-125"
                id="bar-success-fill"
              ></div>
            </div>
            <div className="flex items-center justify-between font-caption text-caption text-outline">
              <span>Status 200 OK completions</span>
              <span className="text-on-surface font-mono font-medium">
                {successfulTraces} / {totalTraces}
              </span>
            </div>
          </div>
        </div>
        {/* <!-- Error Traces Card --> */}
        <div className="interactive-card rounded-xl bg-surface-container-low p-space-md shadow-md flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                Error Traces
              </span>
              <span className="material-symbols-outlined text-error text-[18px] group-hover:scale-110 transition-transform">
                error
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="font-headline-lg text-headline-lg text-error font-bold tracking-tight">
                {errorTraces}
              </span>
              <span className="font-label-sm text-label-sm text-error font-semibold px-2 py-0.5 rounded bg-error/10">
                {errorRate.toFixed(2)}%
              </span>
            </div>
          </div>
          <div>
            <div
              className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden mb-2 relative group/bar cursor-pointer"
              title={`${errorTraces} Errors (${errorRate.toFixed(2)}%)`}
            >
              <div
                className="h-full bg-error rounded-full w-0 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,180,171,0.6)] group-hover/bar:brightness-125"
                id="bar-error-fill"
              ></div>
            </div>
            <div className="flex items-center justify-between font-caption text-caption">
              <a
                className="text-error hover:text-on-error-container hover:underline flex items-center gap-1 font-semibold transition-colors group/link"
                href="/traces"
              >
                <span>Inspect {errorTraces} failed traces</span>
                <span className="material-symbols-outlined text-[13px] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform">
                  north_east
                </span>
              </a>
              <span className="text-outline font-mono">HTTP 429 / 500</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReliabilityMetricCards;
