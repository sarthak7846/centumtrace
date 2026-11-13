import NavigationProgress from "@/components/NavigationProgress";
import Sidebar from "@/components/Sidebar";
import SignedHeader from "@/components/SignedHeader";
import { getSignedInProjects } from "@/services/api/projects";

const SignedLayout = async ({ children }: { children: React.ReactNode }) => {
  const projects = await getSignedInProjects();

  return (
    <div className="bg-background min-h-screen">
      <NavigationProgress/>
      <Sidebar projects={projects} />
      <div className="pl-56">
        <SignedHeader />
        <main
          className={`p-6 ${projects.length !== 0 && "min-h-[calc(100vh-3.5rem)]"}`}
        >
          {projects.length === 0 ? (
            <p>No projects yet. Create your first project.</p>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
};

export default SignedLayout;
