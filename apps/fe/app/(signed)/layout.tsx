import Sidebar from "@/components/Sidebar";
import SignedHeader from "@/components/SignedHeader";
import { getSignedInProjects } from "@/services/api/projects";

const SignedLayout = async ({ children }: { children: React.ReactNode }) => {
  const projects = await getSignedInProjects();

  if (projects.length === 0) {
    return (
      <div className="bg-background min-h-screen">
        <Sidebar />
        <div className="pl-56">
          <SignedHeader projects={projects} />
          <main className="p-6">
            <p>No projects yet. Create your first project.</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Sidebar />
      <div className="pl-56">
        <SignedHeader projects={projects} />
        <main className="min-h-[calc(100vh-3.5rem)] p-6">{children}</main>
      </div>
    </div>
  );
};

export default SignedLayout;
