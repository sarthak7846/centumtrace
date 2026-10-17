const DashboardClient = ({ projects }: { projects: any[] }) => {
  return (
    <div>
      <h1>Dashboard</h1>

      {projects.map((project: any) => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  );
};

export default DashboardClient;
