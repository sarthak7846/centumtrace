"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAPIKey, createProject } from "@/services/api/projects";
import Header from "./Header";
import OnboardingStepCard from "./OnboardingStepCard";
import OnboardingStepIndicator from "./OnboardingStepIndicator";

type Project = {
  id: string;
  name: string;
  description?: string;
};

type ApiKey = {
  id: string;
  name: string;
  key: string;
};

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
              <svg
                className="w-3.5 h-3.5 text-indigo-400"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"></path>
              </svg>
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
          <OnboardingStepCard currentStep={step} />
          {/* <!-- Footer Note --> */}
          <p className="text-center text-xs text-slate-500 mt-6 flex items-center justify-center gap-2">
            <svg
              className="w-3.5 h-3.5 text-slate-500"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
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
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            viewBox="0 0 24 24"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <span className="text-xs sm:text-sm font-medium" id="toast-message">
          Notification message
        </span>
      </div>
    </div>
    //     <div className="min-h-screen bg-background text-foreground flex flex-col">
    //       {/* Header */}
    //       <header className="h-16 border-b border-border flex items-center px-6 lg:px-12">
    //         <div className="flex items-center gap-2">
    //           <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
    //             <span className="text-white font-bold text-sm">O</span>
    //           </div>
    //           <span className="font-semibold text-lg">Centum Trace</span>
    //         </div>

    //         <div className="ml-auto text-sm text-muted-foreground">
    //           Setting up your workspace
    //         </div>
    //       </header>

    //       {/* Main */}
    //       <main className="flex-1 flex justify-center px-4 py-12">
    //         <div className="w-full max-w-2xl">
    //           {/* Intro */}
    //           <div className="text-center mb-10">
    //             <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs text-muted-foreground mb-4">
    //               WORKSPACE SETUP
    //             </div>

    //             <h1 className="text-3xl font-semibold tracking-tight">
    //               Let's get you started
    //             </h1>

    //             <p className="mt-2 text-muted-foreground">
    //               Set up your first project and start observing your LLM
    //               applications.
    //             </p>
    //           </div>

    //           {/* Step indicator */}
    //           <div className="flex items-center justify-center mb-10">
    //             {steps.map((item, index) => {
    //               const isCompleted = index < currentStepIndex;
    //               const isActive = index === currentStepIndex;

    //               return (
    //                 <div key={item.id} className="flex items-center">
    //                   <div className="flex flex-col items-center gap-2">
    //                     <div
    //                       className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium border ${
    //                         isCompleted
    //                           ? "bg-primary border-primary text-primary-foreground"
    //                           : isActive
    //                             ? "border-primary text-primary"
    //                             : "border-border text-muted-foreground"
    //                       }`}
    //                     >
    //                       {isCompleted ? "✓" : index + 1}
    //                     </div>

    //                     <span
    //                       className={`text-xs whitespace-nowrap ${
    //                         isActive
    //                           ? "text-foreground font-medium"
    //                           : "text-muted-foreground"
    //                       }`}
    //                     >
    //                       {item.label}
    //                     </span>
    //                   </div>

    //                   {index !== steps.length - 1 && (
    //                     <div
    //                       className={`w-16 sm:w-24 h-px mx-3 mb-6 ${
    //                         isCompleted ? "bg-primary" : "bg-border"
    //                       }`}
    //                     />
    //                   )}
    //                 </div>
    //               );
    //             })}
    //           </div>

    //           {/* Card */}
    //           <div className="rounded-2xl border border-border bg-card shadow-sm p-6 sm:p-8">
    //             {error && (
    //               <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
    //                 {error}
    //               </div>
    //             )}

    //             {/* STEP 1: CREATE PROJECT */}
    //             {step === "project" && (
    //               <form onSubmit={handleCreateProject}>
    //                 <div className="mb-7">
    //                   <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
    //                     <span className="text-xl">▦</span>
    //                   </div>

    //                   <h2 className="text-xl font-semibold">
    //                     Create your first project
    //                   </h2>

    //                   <p className="text-sm text-muted-foreground mt-1">
    //                     Projects help you organize traces from different
    //                     applications or environments.
    //                   </p>
    //                 </div>

    //                 <div className="space-y-5">
    //                   <div>
    //                     <label
    //                       htmlFor="projectName"
    //                       className="block text-sm font-medium mb-2"
    //                     >
    //                       Project name <span className="text-red-500">*</span>
    //                     </label>

    //                     <input
    //                       id="projectName"
    //                       value={projectName}
    //                       onChange={(e) => setProjectName(e.target.value)}
    //                       placeholder="e.g. Customer Support AI"
    //                       maxLength={100}
    //                       required
    //                       className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
    //                     />
    //                   </div>

    //                   <div>
    //                     <label
    //                       htmlFor="description"
    //                       className="block text-sm font-medium mb-2"
    //                     >
    //                       Description{" "}
    //                       <span className="text-muted-foreground font-normal">
    //                         (Optional)
    //                       </span>
    //                     </label>

    //                     <textarea
    //                       id="description"
    //                       value={description}
    //                       onChange={(e) => setDescription(e.target.value)}
    //                       placeholder="What will you be monitoring?"
    //                       rows={3}
    //                       maxLength={500}
    //                       className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
    //                     />
    //                   </div>
    //                 </div>

    //                 <div className="mt-8 flex justify-end">
    //                   <button
    //                     type="submit"
    //                     disabled={loading || !projectName.trim()}
    //                     className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
    //                   >
    //                     {loading ? "Creating project..." : "Create project"}
    //                     {!loading && <span className="ml-2">→</span>}
    //                   </button>
    //                 </div>
    //               </form>
    //             )}

    //             {/* STEP 2: GENERATE API KEY */}
    //             {step === "api-key" && (
    //               <form onSubmit={handleGenerateApiKey}>
    //                 <div className="mb-7">
    //                   <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
    //                     <span className="text-xl">⌘</span>
    //                   </div>

    //                   <h2 className="text-xl font-semibold">
    //                     Generate your API key
    //                   </h2>

    //                   <p className="text-sm text-muted-foreground mt-1">
    //                     Your SDK uses this key to authenticate trace ingestion
    //                     requests.
    //                   </p>
    //                 </div>

    //                 <div className="rounded-lg border border-border bg-background p-4 mb-6">
    //                   {/* <p className="text-xs text-muted-foreground mb-1">
    //                     YOUR PROJECT
    //                   </p> */}
    //                   <p className="font-medium text-sm">{project?.name}</p>
    //                 </div>

    //                 <div>
    //                   <label
    //                     htmlFor="keyName"
    //                     className="block text-sm font-medium mb-2"
    //                   >
    //                     API key name
    //                   </label>

    //                   <input
    //                     id="keyName"
    //                     value={keyName}
    //                     onChange={(e) => setKeyName(e.target.value)}
    //                     placeholder="e.g. Production"
    //                     maxLength={100}
    //                     className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
    //                   />

    //                   <p className="text-xs text-muted-foreground mt-2">
    //                     Use a name that identifies where this key will be used.
    //                   </p>
    //                 </div>

    //                 <div className="mt-8 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
    //                   <button
    //                     type="button"
    //                     onClick={handleSkipApiKey}
    //                     className="text-sm text-muted-foreground hover:text-foreground"
    //                   >
    //                     Skip for now
    //                   </button>

    //                   <div className="flex gap-3">
    //                     <button
    //                       type="button"
    //                       onClick={handleBack}
    //                       className="rounded-lg border border-border px-4 py-2.5 text-sm"
    //                     >
    //                       Back
    //                     </button>

    //                     <button
    //                       type="submit"
    //                       disabled={loading || !keyName.trim()}
    //                       className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
    //                     >
    //                       {loading ? "Generating..." : "Generate API key"}
    //                     </button>
    //                   </div>
    //                 </div>
    //               </form>
    //             )}

    //             {/* STEP 3: SDK INTEGRATION */}
    //             {step === "integration" && (
    //               <div>
    //                 <div className="mb-7">
    //                   <div className="h-11 w-11 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
    //                     <span className="text-xl">✓</span>
    //                   </div>

    //                   <h2 className="text-xl font-semibold">
    //                     Your API key is ready
    //                   </h2>

    //                   <p className="text-sm text-muted-foreground mt-1">
    //                     Copy and securely store your key. You won't be able to view
    //                     it again after leaving this page.
    //                   </p>
    //                 </div>

    //                 {/* One-time key */}
    //                 <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 mb-7">
    //                   <div className="flex items-center justify-between gap-3 mb-3">
    //                     <span className="text-sm font-medium">
    //                       {apiKey?.name ?? "API key"}
    //                     </span>
    //                     <span className="text-xs text-amber-600">Shown once</span>
    //                   </div>

    //                   <div className="flex items-center gap-2">
    //                     <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap rounded-lg bg-background border border-border px-3 py-3 text-xs">
    //                       {apiKey?.key}
    //                     </code>

    //                     <button
    //                       type="button"
    //                       onClick={handleCopyKey}
    //                       className="shrink-0 rounded-lg border border-border px-3 py-3 text-xs font-medium hover:bg-muted"
    //                     >
    //                       {copied ? "Copied!" : "Copy"}
    //                     </button>
    //                   </div>

    //                   <p className="text-xs text-muted-foreground mt-3">
    //                     Keep this key private. Never commit it to source control or
    //                     expose it in browser-side code.
    //                   </p>
    //                 </div>

    //                 {/* SDK integration */}
    //                 <div className="mb-7">
    //                   <h3 className="font-semibold text-sm mb-1">
    //                     Integrate the SDK
    //                   </h3>

    //                   <p className="text-sm text-muted-foreground mb-4">
    //                     Install the Observe SDK in your Node.js application.
    //                   </p>

    //                   <div className="rounded-xl border border-border overflow-hidden mb-4">
    //                     <div className="flex items-center justify-between bg-muted/50 px-4 py-2 border-b border-border">
    //                       <span className="text-xs font-medium">Terminal</span>
    //                       <span className="text-xs text-muted-foreground">npm</span>
    //                     </div>

    //                     <pre className="overflow-x-auto p-4 text-sm">
    //                       <code>npm install @observe/sdk</code>
    //                     </pre>
    //                   </div>

    //                   <div className="rounded-xl border border-border overflow-hidden">
    //                     <div className="flex items-center justify-between bg-muted/50 px-4 py-2 border-b border-border">
    //                       <span className="text-xs font-medium">.env</span>
    //                       <span className="text-xs text-muted-foreground">
    //                         Environment variables
    //                       </span>
    //                     </div>

    //                     <pre className="overflow-x-auto p-4 text-sm">
    //                       <code>{`OBSERVE_API_KEY=${apiKey?.key ?? "your_api_key"}`}</code>
    //                     </pre>
    //                   </div>

    //                   <div className="rounded-xl border border-border overflow-hidden mt-4">
    //                     <div className="flex items-center justify-between bg-muted/50 px-4 py-2 border-b border-border">
    //                       <span className="text-xs font-medium">TypeScript</span>
    //                       <span className="text-xs text-muted-foreground">
    //                         observe.ts
    //                       </span>
    //                     </div>

    //                     <pre className="overflow-x-auto p-4 text-sm leading-6">
    //                       <code>{`import { Observe } from "@observe/sdk";

    // const observe = new Observe({
    //   apiKey: process.env.OBSERVE_API_KEY!,
    //   baseUrl: "${process.env.NEXT_PUBLIC_OBSERVE_INGEST_URL ?? "YOUR_API_BASE_URL"}",
    // });

    // // Start capturing your LLM traces
    // // using the Observe SDK.`}</code>
    //                     </pre>
    //                   </div>
    //                 </div>

    //                 <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
    //                   <button
    //                     type="button"
    //                     onClick={handleContinue}
    //                     className="text-sm text-muted-foreground hover:text-foreground"
    //                   >
    //                     I'll integrate later
    //                   </button>

    //                   <button
    //                     type="button"
    //                     onClick={handleContinue}
    //                     className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
    //                   >
    //                     Continue to Analytics →
    //                   </button>
    //                 </div>
    //               </div>
    //             )}
    //           </div>

    //           <p className="text-center text-xs text-muted-foreground mt-6">
    //             You can manage your projects and API keys anytime from Settings.
    //           </p>
    //         </div>
    //       </main>
    //     </div>
  );
}
