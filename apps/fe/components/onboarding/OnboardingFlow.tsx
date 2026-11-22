"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAPIKey, createProject } from "@/services/api/projects";

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

type Step = "project" | "api-key" | "integration";

const steps = [
  { id: "project", label: "Create project" },
  { id: "api-key", label: "Generate API key" },
  { id: "integration", label: "Integrate SDK" },
] as const;

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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-border flex items-center px-6 lg:px-12">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">O</span>
          </div>
          <span className="font-semibold text-lg">Centum Trace</span>
        </div>

        <div className="ml-auto text-sm text-muted-foreground">
          Setting up your workspace
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Intro */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs text-muted-foreground mb-4">
              WORKSPACE SETUP
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">
              Let's get you started
            </h1>

            <p className="mt-2 text-muted-foreground">
              Set up your first project and start observing your LLM
              applications.
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center mb-10">
            {steps.map((item, index) => {
              const isCompleted = index < currentStepIndex;
              const isActive = index === currentStepIndex;

              return (
                <div key={item.id} className="flex items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium border ${
                        isCompleted
                          ? "bg-primary border-primary text-primary-foreground"
                          : isActive
                            ? "border-primary text-primary"
                            : "border-border text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? "✓" : index + 1}
                    </div>

                    <span
                      className={`text-xs whitespace-nowrap ${
                        isActive
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  {index !== steps.length - 1 && (
                    <div
                      className={`w-16 sm:w-24 h-px mx-3 mb-6 ${
                        isCompleted ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-border bg-card shadow-sm p-6 sm:p-8">
            {error && (
              <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

            {/* STEP 1: CREATE PROJECT */}
            {step === "project" && (
              <form onSubmit={handleCreateProject}>
                <div className="mb-7">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <span className="text-xl">▦</span>
                  </div>

                  <h2 className="text-xl font-semibold">
                    Create your first project
                  </h2>

                  <p className="text-sm text-muted-foreground mt-1">
                    Projects help you organize traces from different
                    applications or environments.
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="projectName"
                      className="block text-sm font-medium mb-2"
                    >
                      Project name <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="projectName"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="e.g. Customer Support AI"
                      maxLength={100}
                      required
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium mb-2"
                    >
                      Description{" "}
                      <span className="text-muted-foreground font-normal">
                        (Optional)
                      </span>
                    </label>

                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What will you be monitoring?"
                      rows={3}
                      maxLength={500}
                      className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading || !projectName.trim()}
                    className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
                  >
                    {loading ? "Creating project..." : "Create project"}
                    {!loading && <span className="ml-2">→</span>}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: GENERATE API KEY */}
            {step === "api-key" && (
              <form onSubmit={handleGenerateApiKey}>
                <div className="mb-7">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <span className="text-xl">⌘</span>
                  </div>

                  <h2 className="text-xl font-semibold">
                    Generate your API key
                  </h2>

                  <p className="text-sm text-muted-foreground mt-1">
                    Your SDK uses this key to authenticate trace ingestion
                    requests.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-background p-4 mb-6">
                  {/* <p className="text-xs text-muted-foreground mb-1">
                    YOUR PROJECT
                  </p> */}
                  <p className="font-medium text-sm">{project?.name}</p>
                </div>

                <div>
                  <label
                    htmlFor="keyName"
                    className="block text-sm font-medium mb-2"
                  >
                    API key name
                  </label>

                  <input
                    id="keyName"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    placeholder="e.g. Production"
                    maxLength={100}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />

                  <p className="text-xs text-muted-foreground mt-2">
                    Use a name that identifies where this key will be used.
                  </p>
                </div>

                <div className="mt-8 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleSkipApiKey}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Skip for now
                  </button>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="rounded-lg border border-border px-4 py-2.5 text-sm"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={loading || !keyName.trim()}
                      className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
                    >
                      {loading ? "Generating..." : "Generate API key"}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 3: SDK INTEGRATION */}
            {step === "integration" && (
              <div>
                <div className="mb-7">
                  <div className="h-11 w-11 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
                    <span className="text-xl">✓</span>
                  </div>

                  <h2 className="text-xl font-semibold">
                    Your API key is ready
                  </h2>

                  <p className="text-sm text-muted-foreground mt-1">
                    Copy and securely store your key. You won't be able to view
                    it again after leaving this page.
                  </p>
                </div>

                {/* One-time key */}
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 mb-7">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-sm font-medium">
                      {apiKey?.name ?? "API key"}
                    </span>
                    <span className="text-xs text-amber-600">Shown once</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap rounded-lg bg-background border border-border px-3 py-3 text-xs">
                      {apiKey?.key}
                    </code>

                    <button
                      type="button"
                      onClick={handleCopyKey}
                      className="shrink-0 rounded-lg border border-border px-3 py-3 text-xs font-medium hover:bg-muted"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground mt-3">
                    Keep this key private. Never commit it to source control or
                    expose it in browser-side code.
                  </p>
                </div>

                {/* SDK integration */}
                <div className="mb-7">
                  <h3 className="font-semibold text-sm mb-1">
                    Integrate the SDK
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4">
                    Install the Observe SDK in your Node.js application.
                  </p>

                  <div className="rounded-xl border border-border overflow-hidden mb-4">
                    <div className="flex items-center justify-between bg-muted/50 px-4 py-2 border-b border-border">
                      <span className="text-xs font-medium">Terminal</span>
                      <span className="text-xs text-muted-foreground">npm</span>
                    </div>

                    <pre className="overflow-x-auto p-4 text-sm">
                      <code>npm install @observe/sdk</code>
                    </pre>
                  </div>

                  <div className="rounded-xl border border-border overflow-hidden">
                    <div className="flex items-center justify-between bg-muted/50 px-4 py-2 border-b border-border">
                      <span className="text-xs font-medium">.env</span>
                      <span className="text-xs text-muted-foreground">
                        Environment variables
                      </span>
                    </div>

                    <pre className="overflow-x-auto p-4 text-sm">
                      <code>{`OBSERVE_API_KEY=${apiKey?.key ?? "your_api_key"}`}</code>
                    </pre>
                  </div>

                  <div className="rounded-xl border border-border overflow-hidden mt-4">
                    <div className="flex items-center justify-between bg-muted/50 px-4 py-2 border-b border-border">
                      <span className="text-xs font-medium">TypeScript</span>
                      <span className="text-xs text-muted-foreground">
                        observe.ts
                      </span>
                    </div>

                    <pre className="overflow-x-auto p-4 text-sm leading-6">
                      <code>{`import { Observe } from "@observe/sdk";

const observe = new Observe({
  apiKey: process.env.OBSERVE_API_KEY!,
  baseUrl: "${process.env.NEXT_PUBLIC_OBSERVE_INGEST_URL ?? "YOUR_API_BASE_URL"}",
});

// Start capturing your LLM traces
// using the Observe SDK.`}</code>
                    </pre>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    I'll integrate later
                  </button>

                  <button
                    type="button"
                    onClick={handleContinue}
                    className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
                  >
                    Continue to Analytics →
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            You can manage your projects and API keys anytime from Settings.
          </p>
        </div>
      </main>
    </div>
  );
}
