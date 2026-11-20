"use client";

import { useState } from "react";
import {
  LatencyTrend,
  Range,
} from "@/app/(signed)/dashboard/types";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type LatencyTrendChartProps = {
  initialLatencyTrend: LatencyTrend;
  selectedProjectId: string;
};

export default function LatencyTrendChart({
  initialLatencyTrend,
  selectedProjectId,
}: LatencyTrendChartProps) {
  const [selectedRange, setSelectedRange] = useState<Range>("24h");
  const [latencyTrend, setLatencyTrend] = useState<LatencyTrend>(
    initialLatencyTrend,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const data = latencyTrend.data;
  const chartData = data.map((bucket) => {
    const date = new Date(bucket.timestamp);

    return {
      ...bucket,
      time: date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  });

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
        `/api/analytics/latency/trend?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch latency trend");
      }

      const updatedLatencyTrend: LatencyTrend = await response.json();

      setLatencyTrend(updatedLatencyTrend);
      setSelectedRange(range);
    } catch (error) {
      console.error("Error fetching latency trend:", error);
      setError("Unable to load analytics data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="anim-entry-5 interactive-card mb-space-lg rounded-xl bg-surface-container-low p-space-lg shadow-xl relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm mb-space-lg">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="material-symbols-outlined text-secondary text-[24px]">
              equalizer
            </span>
            <h3 className="font-title-md text-title-md text-on-surface font-bold tracking-tight">
              Latency Performance
            </h3>

            {/* <span className="relative flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-caption text-caption font-semibold border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Real-time
            </span> */}
          </div>
          <span className="font-label-md text-label-md text-on-surface-variant font-medium">
            Track response times and identify slower model requests
          </span>
        </div>

        {/* Chart Controls */}
        <div className="flex flex-wrap items-center gap-space-sm">
          <div className="inline-flex rounded-lg bg-surface-container p-0.5 border border-surface-container-high/60">
            {(["24h", "7d", "30d"] as const).map((range) => (
              <button
                key={range}
                onClick={() => handleRangeChange(range)}
                className={`px-2.5 py-1 cursor-pointer text-label-sm rounded-md transition-colors ${
                  selectedRange === range
                    ? "bg-surface-container-high text-on-surface font-medium shadow-xs"
                    : "text-outline hover:text-on-surface"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>
      {error && <p className="text-sm text-error mb-3">{error}</p>}

      {/* Chart */}
      {data.length === 0 ? (
        <div className="flex h-80 items-center justify-center text-sm text-outline">
          No latency data available for this time range.
        </div>
      ) : (
        <div className="relative w-full h-80 select-none">
          {isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-surface-container-low/50 backdrop-blur-[1px] rounded-lg">
              <div className="flex items-center gap-2 text-sm text-primary">
                <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                Updating chart...
              </div>
            </div>
          )}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 12,
                right: 12,
                left: 0,
                bottom: 8,
              }}
            >
              <CartesianGrid
                stroke="#31353f"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                tick={{
                  fill: "#908fa0",
                  fontSize: 11,
                }}
                axisLine={{ stroke: "#464554" }}
                tickLine={false}
                minTickGap={30}
              />

              <YAxis
                tick={{
                  fill: "#908fa0",
                  fontSize: 11,
                }}
                tickFormatter={(value: number) => `${value} ms`}
                axisLine={false}
                tickLine={false}
                width={55}
              />

              <Tooltip
                formatter={(value, name) => [
                  `${Number(value).toFixed(2)} ms`,
                  name,
                ]}
                contentStyle={{
                  backgroundColor: "#252936",
                  border: "1px solid #464554",
                  borderRadius: "12px",
                  color: "#ffffff",
                  padding: "12px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                }}
                labelStyle={{
                  color: "#a5a4b5",
                  marginBottom: "8px",
                }}
                itemStyle={{
                  fontSize: "12px",
                  padding: "2px 0",
                }}
                cursor={{
                  stroke: "#8083ff",
                  strokeDasharray: "4 4",
                }}
              />

              <Line
                type="monotone"
                dataKey="averageLatencyMs"
                name="averageLatencyMs"
                stroke="#8083ff"
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="p50LatencyMs"
                name="p50LatencyMs"
                stroke="#34d399"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="p95LatencyMs"
                name="p95LatencyMs"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="p99LatencyMs"
                name="p99LatencyMs"
                stroke="#ffb4ab"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
