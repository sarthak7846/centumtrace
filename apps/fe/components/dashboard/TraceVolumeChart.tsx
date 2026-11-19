"use client";

import { useId, useState } from "react";
import {
  AnalyticsVolume,
  Range,
} from "@/app/(signed)/dashboard/types";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type TraceVolumeChartProps = {
  initialAnalyticsVolume: AnalyticsVolume;
  selectProjectId: string;
};

export default function TraceVolumeChart({
  initialAnalyticsVolume,
  selectProjectId,
}: TraceVolumeChartProps) {
  const [selectedRange, setSelectedRange] = useState<Range>("24h");
  const [analyticsVolume, setAnalyticsVolume] = useState<AnalyticsVolume>(
    initialAnalyticsVolume,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [visible, setVisible] = useState({
    total: true,
    success: true,
    errors: true,
  });

  const gradientId = useId().replace(/:/g, "");
  const data = analyticsVolume.data;
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

  const totalTracesSum = data.reduce((total, data) => total + data.total, 0);
  const successTracesSum = data.reduce(
    (total, data) => total + data.success,
    0,
  );
  const errorsTracesSum = data.reduce((total, data) => total + data.errors, 0);

  const toggleSeries = (key: keyof typeof visible) => {
    setVisible((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleRangeChange = async (range: Range) => {
    if (range === selectedRange) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        projectId: selectProjectId,
        range,
      });

      const response = await fetch(
        `/api/analytics/volume?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch trace volume");
      }

      const updatedAnalytics: AnalyticsVolume = await response.json();

      setAnalyticsVolume(updatedAnalytics);
      setSelectedRange(range);
    } catch (error) {
      console.error("Error fetching trace volume:", error);
      setError("Unable to load analytics data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const series = [
    {
      key: "total" as const,
      label: "Total Traces",
      color: "#8083ff",
      value: totalTracesSum ?? 0,
    },
    {
      key: "success" as const,
      label: "Successful",
      color: "#34d399",
      value: successTracesSum ?? 0,
    },
    {
      key: "errors" as const,
      label: "Errors",
      color: "#ffb4ab",
      value: errorsTracesSum ?? 0,
    },
  ];

  return (
    <div className="anim-entry-5 interactive-card rounded-xl bg-surface-container-low p-space-lg shadow-xl relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm mb-space-lg">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="material-symbols-outlined text-secondary text-[24px]">
              equalizer
            </span>
            <h3 className="font-title-md text-title-md text-on-surface font-bold tracking-tight">
              Trace Volume
            </h3>

            {/* <span className="relative flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-caption text-caption font-semibold border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Real-time
            </span> */}
          </div>
          <span className="font-label-md text-label-md text-on-surface-variant font-medium">
            Requests, successful traces, and errors over time
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
          No trace data available for this time range.
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
            <AreaChart
              data={chartData}
              margin={{
                top: 12,
                right: 12,
                left: 0,
                bottom: 8,
              }}
            >
              <defs>
                {/* Total traces gradient */}
                <linearGradient
                  id={`${gradientId}-total`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#8083ff" stopOpacity={0.32} />
                  <stop offset="80%" stopColor="#8083ff" stopOpacity={0.04} />
                  <stop offset="100%" stopColor="#8083ff" stopOpacity={0} />
                </linearGradient>

                {/* Successful traces gradient */}
                <linearGradient
                  id={`${gradientId}-success`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>

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
                allowDecimals={false}
                tick={{
                  fill: "#908fa0",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
                width={40}
              />

              <Tooltip
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

              {/* Total traces */}
              <Area
                type="monotone"
                dataKey="total"
                name="Total Traces"
                stroke="#8083ff"
                strokeWidth={2.5}
                fill={`url(#${gradientId}-total)`}
                dot={false}
                activeDot={{
                  r: 5,
                  stroke: "#8083ff",
                  strokeWidth: 2,
                  fill: "#252936",
                }}
                hide={!visible.total}
              />

              {/* Successful traces */}
              <Area
                type="monotone"
                dataKey="success"
                name="Successful"
                stroke="#34d399"
                strokeWidth={2}
                fill={`url(#${gradientId}-success)`}
                dot={false}
                activeDot={{
                  r: 4,
                  stroke: "#34d399",
                  strokeWidth: 2,
                  fill: "#252936",
                }}
                hide={!visible.success}
              />

              {/* Errors */}
              <Line
                type="monotone"
                dataKey="errors"
                name="Errors"
                stroke="#ffb4ab"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#ffb4ab",
                }}
                hide={!visible.errors}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Interactive Legend */}
      <div className="flex flex-wrap items-center justify-center gap-space-sm md:gap-space-lg mt-space-lg pt-space-md border-t border-surface-container-high/60">
        {series.map((item) => (
          <button
            key={item.key}
            onClick={() => toggleSeries(item.key)}
            aria-pressed={visible[item.key]}
            title={`Toggle ${item.label} visibility`}
            className={`flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg bg-surface-container/70 hover:bg-surface-container-high border border-outline-variant/20 transition-all duration-200 active:scale-95 ${
              !visible[item.key] ? "opacity-40" : ""
            }`}
          >
            <span
              className="w-3 h-1.5 rounded-full"
              style={{
                backgroundColor: item.color,
                boxShadow: visible[item.key]
                  ? `0 0 8px ${item.color}80`
                  : "none",
              }}
            />

            <span className="font-label-md text-label-md text-on-surface">
              {item.label}
            </span>

            <span className="text-caption px-1.5 py-0.5 rounded bg-surface-container-highest font-mono text-on-surface-variant">
              {item.value}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
