import { AnalyticsOverview } from "@/app/(signed)/dashboard/types";
import Link from "next/link";

export default function OverviewCards({
  analyticsOverview,
}: {
  analyticsOverview: AnalyticsOverview;
}) {
  const {
    totalTraces,
    totalTokens,
    totalCost,
    errorTraces,
    errorRate,
    averageLatencyMs,
    p50LatencyMs,
    p95LatencyMs,
    p99LatencyMs,
    successfulTraces,
  } = analyticsOverview;

  const sections = [
    {
      title: "Overview",
      metrics: [
        {
          label: "Total Traces",
          value: totalTraces.toLocaleString(),
        },
        {
          label: "Error Rate",
          value: `${errorRate.toFixed(2)}%`,
        },
        {
          label: "Average Latency",
          value: `${averageLatencyMs.toFixed(0)} ms`,
        },
        {
          label: "Total Cost",
          value: `$${totalCost.toFixed(4)}`,
        },
      ],
    },
    {
      title: "Reliability",
      metrics: [
        {
          label: "Successful Traces",
          value: successfulTraces.toLocaleString(),
        },
        {
          label: "Error Traces",
          value: errorTraces.toLocaleString(),
        },
      ],
    },
    {
      title: "Latency Performance",
      metrics: [
        {
          label: "P50 Latency",
          value: `${p50LatencyMs.toFixed(0)} ms`,
          description: "Median response time",
        },
        {
          label: "P95 Latency",
          value: `${p95LatencyMs.toFixed(0)} ms`,
          description: "95% of traces finish within this time",
        },
        {
          label: "P99 Latency",
          value: `${p99LatencyMs.toFixed(0)} ms`,
          description: "99% of traces finish within this time",
        },
      ],
    },
    {
      title: "Usage",
      metrics: [
        {
          label: "Total Tokens",
          value: totalTokens.toLocaleString(),
        },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {section.title}
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {section.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                {metric.label === "Total Traces" ? (
                  <Link
                    href={`/traces`}
                    className="text-sm text-gray-500 hover:underline"
                  >
                    {metric.label}
                  </Link>
                ) : (
                  <p className="text-sm text-gray-500">{metric.label}</p>
                )}

                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {metric.value}
                </p>

                {"description" in metric && (
                  <p className="mt-2 text-xs text-gray-500">
                    {metric.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
