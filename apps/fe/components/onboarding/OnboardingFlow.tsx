"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAPIKey, createProject } from "@/services/api/projects";
import Header from "./Header";
import OnboardingStepCard from "./OnboardingStepCard";
import OnboardingStepIndicator from "./OnboardingStepIndicator";
import { ApiKey, Project } from "@/app/(signed)/dashboard/types";


export type Step = "project" | "api-key" | "integration";

const steps = [
  { id: "project", label: "Create project" },
  { id: "api-key", label: "Generate API key" },
  { id: "integration", label: "Integrate SDK" },
];

export default function OnboardingFlow({
  organizationId,
}: {
  organizationId: string;
}) {
  const router = useRouter();

  const [step, setStep] = useState<Step>("project");
  const [project, setProject] = useState<Project | null>(null);
  const [apiKey, setApiKey] = useState<ApiKey | null>(null);

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [keyName, setKeyName] = useState("Production");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const currentStepIndex = steps.findIndex((item) => item.id === step);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("creating project", "move");

    if (project) {
      setStep("api-key");
      return;
    }

    setError("");

    if (!projectName.trim()) {
      setError("Please enter a project name.");
      return;
    }

    setLoading(true);

    const result = await createProject(
      organizationId,
      projectName.trim(),
      description.trim() ?? "",
    );
    console.log("result", result, "move");

    setLoading(false);

    if (result.error) {
      setError(result.message);
      return;
    }
    setProject(result.data);
    setStep("api-key");
  };

  const handleGenerateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    setError("");
    setLoading(true);

    const result = await createAPIKey(project.id, keyName.trim());

    setLoading(false);

    if (result.error) {
      setError(result.message);
      return;
    }

    setApiKey(result.data);
    setStep("integration");
  };

  const handleCopyKey = async () => {
    if (!apiKey?.key) return;

    await navigator.clipboard.writeText(apiKey.key);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleSkipApiKey = () => {
    setApiKey(null);
    router.replace("/analytics");
  };

  const handleContinue = () => {
    router.replace("/analytics");
    router.refresh();
  };

  const handleBack = () => {
    if (step === "api-key") {
      setStep("project");
    } else if (step === "integration") {
      // The key has already been generated. Don't generate another
      // key simply because the user wants to review the previous step.
      setStep("api-key");
    }
  };

  return (
    <div className="bg-[#07090e] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      <div className="fixed top-[-12%] left-1/2 -translate-x-1/2 w-212.5 h-110 bg-linear-to-b from-indigo-600/20 via-violet-600/12 to-transparent blur-[130px] pointer-events-none -z-10 animate-glow"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-145 h-105 bg-violet-600/15 blur-[150px] pointer-events-none -z-10 animate-drift-right"></div>
      {/* <!-- Header --> */}
      <Header />
      {/* <!-- Main Content Container --> */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-2xl mx-auto">
          {/* <!-- Intro Title & Subtitle --> */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-indigo-300 uppercase mb-3.5 shadow-sm shadow-indigo-500/10">
              {/* <svg
                className="w-3.5 h-3.5 text-indigo-400"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"></path>
              </svg> */}
              Workspace Setup
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Let's get you started
            </h1>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Set up your first project and start observing your LLM
              applications in minutes.
            </p>
          </div>
          <OnboardingStepIndicator
            steps={steps}
            currentStepIndex={currentStepIndex}
          />
          <OnboardingStepCard
            currentStep={step}
            description={description}
            handleCreateProject={handleCreateProject}
            loading={loading}
            projectName={projectName}
            setDescription={setDescription}
            setProjectName={setProjectName}
            handleGenerateApiKey={handleGenerateApiKey}
            handleSkipApiKey={handleSkipApiKey}
            keyName={keyName}
            setKeyName={setKeyName}
            handleBack={handleBack}
            copied={copied}
            setCopied={setCopied}
            handleCopyKey={handleCopyKey}
            apiKey={apiKey}
            handleContinue={handleContinue}
            error={error}
          />
          {/* <!-- Footer Note --> */}
          <p className="text-center text-xs text-slate-500 mt-6 flex items-center justify-center gap-2">
            <img src="/icons/bolt.svg" className="w-3.5 h-3.5" alt="bolt" />
            You can manage your projects and API keys anytime from Workspace
            Settings.
          </p>
        </div>
      </main>
      {/* <!-- Interactive Floating Toast --> */}
      <div
        className="fixed bottom-6 right-6 z-50 bg-[#121927] border border-indigo-500/40 text-slate-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 translate-y-20 opacity-0 pointer-events-none transition-all duration-300"
        id="toast"
      >
        <div
          className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0"
          id="toast-icon-wrap"
        >
          {/* <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            viewBox="0 0 24 24"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg> */}
        </div>
        <span className="text-xs sm:text-sm font-medium" id="toast-message">
          Notification message
        </span>
      </div>
    </div>
  );
}
