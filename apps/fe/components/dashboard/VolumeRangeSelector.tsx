"use client";

import { TraceVolumeRange } from "@/app/dashboard/types";
import { useRouter, useSearchParams } from "next/navigation";

const ranges: { label: string; value: TraceVolumeRange }[] = [
  { label: "24 hours", value: "24h" },
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
];

export default function VolumeRangeSelector({
  selectedRange,
}: {
  selectedRange: TraceVolumeRange;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(range: TraceVolumeRange) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", range);

    router.replace(`/dashboard?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {ranges.map((range) => {
        const active = selectedRange === range.value;

        return (
          <button
            key={range.value}
            type="button"
            onClick={() => handleChange(range.value)}
            className={`rounded-lg border px-3 py-2 text-sm ${
              active
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
}
