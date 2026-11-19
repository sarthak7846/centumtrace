import { NextRequest, NextResponse } from "next/server";
import { getLatencyTrend } from "@/services/api/analytics";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const projectId = searchParams.get("projectId");
    const range = searchParams.get("range") || "24h";

    if (!projectId) {
      return NextResponse.json(
        { message: "Project ID is required" },
        { status: 400 },
      );
    }

    const allowedRanges = ["24h", "7d", "30d"];

    if (!allowedRanges.includes(range)) {
      return NextResponse.json({ message: "Invalid range" }, { status: 400 });
    }

    const data = await getLatencyTrend(projectId, range);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch latency trend:", error);

    return NextResponse.json(
      { message: "Failed to fetch latency trend" },
      { status: 500 },
    );
  }
}
