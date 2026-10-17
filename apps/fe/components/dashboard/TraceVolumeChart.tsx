"use client";

import { AnalyticsVolume } from "@/app/(signed)/dashboard/types";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function TraceVolumeChart({
  analyticsVolume,
}: {
  analyticsVolume: AnalyticsVolume;
}) {
  const data = analyticsVolume.data;
  const chartData = data.map((bucket) => {
    console.log("Original timestamp:", bucket.timestamp);
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
  
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Trace Volume</h2>
        <p className="text-sm text-gray-500">
          Requests, successful traces, and errors over time
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex h-72 items-center justify-center text-sm text-gray-500">
          No trace data available for this time range.
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="time" tick={{ fontSize: 12 }} minTickGap={30} />

              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />

              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                dataKey="total"
                name="Total Traces"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="success"
                name="Successful"
                stroke="#16a34a"
                strokeWidth={2}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="errors"
                name="Errors"
                stroke="#dc2626"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
