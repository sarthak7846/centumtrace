import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import { getSignedInProjects } from "@/services/api/projects";
import { redirect } from "next/navigation";

const OnboardingPage = async () => {
  const projects = await getSignedInProjects();

  if (projects.length > 0) {
    redirect("/analytics");
  }
  return <OnboardingFlow />;
};

export default OnboardingPage;
