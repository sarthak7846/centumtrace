import Sidebar from "@/components/Sidebar";
import SignedHeader from "@/components/SignedHeader";
import { getSignedInProjects } from "@/services/api/projects";
import { redirect } from "next/navigation";

const SignedLayout = async ({ children }: { children: React.ReactNode }) => {
  const {projects} = await getSignedInProjects();

  if (projects.length === 0) redirect("/onboarding");

  return (
    <div className="bg-background min-h-screen">
      <Sidebar projects={projects} />
      <div className="pl-56">
        <SignedHeader />
        <main
          className={`p-6 ${projects.length !== 0 && "min-h-[calc(100vh-3.5rem)]"}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default SignedLayout;
