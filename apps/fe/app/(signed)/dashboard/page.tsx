import OverviewCards from "@/components/dashboard/OverviewCards";
import { TraceVolumeRange, validRanges } from "./types";
import VolumeRangeSelector from "@/components/dashboard/VolumeRangeSelector";
import TraceVolumeChart from "@/components/dashboard/TraceVolumeChart";
import { resolveSelectedProject } from "@/services/api/projects";
import { getAnalyticsOverview, getAnalyticsVolume } from "@/services/api/analytics";



const DashboardPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string; range?: string }>;
}) => {
  const params = await searchParams;
  const { selectedProject } = await resolveSelectedProject(params.projectId);

  if (!selectedProject) {
    return <p>No projects yet. Create your first project.</p>;
  }

  const range = validRanges.includes(params.range as TraceVolumeRange)
    ? (params.range as TraceVolumeRange)
    : "24h";

  const [overview, analyticsVolume] = await Promise.all([
    getAnalyticsOverview(selectedProject.id),
    getAnalyticsVolume(selectedProject.id, range),
  ]);

  return (
    <main className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor your LLM application's performance and usage.
        </p>
      </div>

      <OverviewCards analyticsOverview={overview} />

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Trace Activity</h2>
          <VolumeRangeSelector selectedRange={range} />
        </div>

        <TraceVolumeChart analyticsVolume={analyticsVolume} />
      </section>
    </main>
  );
};

export default DashboardPage;
