import { getCurrentUser, getProjects } from "./actions";

const DashboardPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string }>;
}) => {
  const user = await getCurrentUser();

  const organization = user.memberships[0]?.organization;

  if (!organization) throw new Error("No organization found");

  const projects = await getProjects(organization.id);

  if (projects.length === 0) {
    return <p>No projects yet. Create your first project.</p>;
  }

  const { projectId: queryProjectId } = await searchParams;

  return (
    <div>
      <h1>Dashboard</h1>

      {projects.map((project: any) => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  );
};

export default DashboardPage;
