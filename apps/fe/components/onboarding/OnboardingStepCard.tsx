import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { Step } from "./OnboardingFlow";
import { ApiKey } from "@/app/(signed)/dashboard/types";

type PackageManager = "npm" | "pnpm" | "pip";

const installCommands: Record<PackageManager, string> = {
  npm: "npm install @centrumtrace/sdk",
  pnpm: "pnpm add @centrumtrace/sdk",
  pip: "pip install centrumtrace",
};

const OnboardingStepCard = ({
  currentStep,
  handleCreateProject,
  projectName,
  setProjectName,
  description,
  setDescription,
  loading,
  handleGenerateApiKey,
  keyName,
  setKeyName,
  handleSkipApiKey,
  handleBack,
  copied,
  handleCopyKey,
  apiKey,
  handleContinue,
  error,
}: {
  currentStep: Step;
  handleCreateProject: (e: FormEvent<Element>) => Promise<void>;
  projectName: string;
  setProjectName: Dispatch<SetStateAction<string>>;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  loading: boolean;
  handleGenerateApiKey: (e: FormEvent<Element>) => Promise<void>;
  keyName: string;
  setKeyName: Dispatch<SetStateAction<string>>;
  handleSkipApiKey: () => void;
  handleBack: () => void;
  copied: boolean;
  setCopied: Dispatch<SetStateAction<boolean>>;
  handleCopyKey: () => Promise<void>;
  apiKey: ApiKey | null;
  handleContinue: () => void;
  error: string;
}) => {
  const [activeTab, setActiveTab] = useState<PackageManager>("npm");

  return (
    <div className="relative rounded-2xl border border-[#1f283e] bg-[#0d121c]/95 backdrop-blur-xl shadow-2xl shadow-black/80 p-6 sm:p-9 transition-all">
      {/* <!-- Error Banner Container --> */}
      {error && (
        <div
          className="hidden mb-6 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300 items-center gap-3 animate-fadeInUp"
          id="error-container"
        >
          <img
            src="/icons/caution.svg"
            className="w-5 h-5 shrink-0"
            alt="caution"
          />
          <span id="error-text">{error}</span>
        </div>
      )}
      {/* <!-- ============================================== -->
<!-- STEP 1: CREATE PROJECT -->
<!-- ============================================== --> */}
      {currentStep === "project" && (
        <div className="step-card-enter" id="step-1-panel">
          <div className="mb-7">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mb-4 shadow-inner ring-1 ring-indigo-400/20">
              <img src="/icons/box.svg" alt="box" className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Create your first project
            </h2>
            <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
              Projects help you organize traces, evaluations, and metrics across
              different applications or environments.
            </p>
          </div>
          <form className="space-y-5" onSubmit={handleCreateProject}>
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
                htmlFor="projectName"
              >
                Project name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  className="glow-input w-full rounded-xl border border-[#242f48] bg-[#080b11] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200"
                  id="projectName"
                  maxLength={100}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Customer Support AI"
                  type="text"
                  required
                  value={projectName}
                />
                {/* <div
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono"
                  id="project-char-count"
                >
                  19/100
                </div> */}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                  htmlFor="description"
                >
                  Description
                </label>
                {/* <span
                  className="text-xs text-slate-500 font-mono"
                  id="desc-char-count"
                >
                  92/500
                </span> */}
              </div>
              <textarea
                className="glow-input w-full resize-none rounded-xl border border-[#242f48] bg-[#080b11] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 leading-relaxed"
                id="description"
                maxLength={500}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What will you be monitoring? (e.g. Production user queries, latency thresholds, and guardrails)"
                rows={3}
                value={description}
              />
            </div>
            <div className="pt-4 flex items-center justify-between border-t border-[#1a2235]">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <img
                  src="/icons/clock.svg"
                  alt="clock"
                  className="w-3.5 h-3.5 text-indigo-400"
                />
                Takes less than 30 seconds
              </span>
              <button
                className="btn-lift inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30"
                id="btn-create-project"
                type="submit"
                disabled={loading || !projectName.trim()}
              >
                <span>
                  {loading ? "Creating project..." : "Create project"}
                </span>

                <img
                  src="/icons/right-arrow.svg"
                  alt="right-arrow"
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                />
              </button>
            </div>
          </form>
        </div>
      )}
      {/* <!-- ============================================== -->
<!-- STEP 2: GENERATE API KEY -->
<!-- ============================================== --> */}
      {currentStep === "api-key" && (
        <div id="step-2-panel">
          <div className="mb-7">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mb-4 shadow-inner ring-1 ring-indigo-400/20">
              <span className="material-symbols-outlined w-6 h-6">key</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Generate your API key
            </h2>
            <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
              Your SDK uses this secret key to authenticate trace ingestion and
              telemetry streams.
            </p>
          </div>
          {/* <!-- Project Context Banner --> */}
          <div className="rounded-xl border border-[#232c42] bg-[#080b11] p-4 mb-6 flex items-center justify-between transition-all hover:border-indigo-500/40">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold font-mono border border-indigo-500/30">
                PRJ
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Active Target Project
                </p>
                <p
                  className="font-semibold text-sm text-white"
                  id="display-project-name"
                >
                  {projectName}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>{" "}
              Ready
            </span>
          </div>
          <form className="space-y-5" onSubmit={handleGenerateApiKey}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                  htmlFor="keyName"
                >
                  API key name <span className="text-rose-400">*</span>
                </label>
                {/* <span
                  className="text-xs text-slate-500 font-mono"
                  id="key-char-count"
                >
                  10/100
                </span> */}
              </div>
              <input
                className="glow-input w-full rounded-xl border border-[#242f48] bg-[#080b11] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200"
                id="keyName"
                maxLength={100}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="e.g. Production, Staging, or Local Agent"
                required={true}
                type="text"
                value={keyName}
              />
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5 ">
                <span className="material-symbols-outlined text-slate-400">
                  error
                </span>
                Use an identifiable name matching the environment where this key
                will be deployed.
              </p>
            </div>
            <div className="pt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-[#1a2235]">
              <button
                className="text-xs font-medium text-slate-400 hover:text-indigo-300 py-2.5 transition-colors text-center sm:text-left hover:underline"
                onClick={handleSkipApiKey}
                type="button"
              >
                Skip for now →
              </button>
              <div className="flex items-center gap-3">
                <button
                  className="rounded-xl cursor-pointer border border-[#26324d] bg-[#111724] hover:bg-[#182133] hover:border-slate-500 px-5 py-2.5 text-sm font-medium text-slate-200 transition-all active:scale-95"
                  onClick={handleBack}
                  type="button"
                >
                  Back
                </button>
                <button
                  className="btn-lift inline-flex items-center cursor-pointer gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30"
                  disabled={loading || !keyName.trim()}
                  id="btn-gen-key"
                  type="submit"
                >
                  <span>{loading ? "Generating..." : "Generate API key"}</span>
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      {/* <!-- ============================================== -->
<!-- STEP 3: INTEGRATE SDK -->
<!-- ============================================== --> */}
      {currentStep === "integration" && (
        <div id="step-3-panel">
          <div className="mb-7">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4 shadow-inner ring-1 ring-emerald-400/20">
              <span className="material-symbols-outlined">key</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Your API key is ready
            </h2>
            <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
              Copy and securely store your key. You will not be able to view the
              full secret again after leaving this page.
            </p>
          </div>
          {/* <!-- Secret Key One-time Alert Box --> */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-5 mb-7 relative overflow-hidden transition-all hover:border-amber-500/50">
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400">
                  key
                </span>
                <span id="active-key-label">{apiKey?.name ?? "API key"}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>{" "}
                Shown once
              </span>
            </div>
            <div className="flex items-center gap-2">
              <code
                className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap rounded-xl bg-[#07090e] border border-[#2a344a] px-3.5 py-3 text-xs sm:text-sm font-mono text-indigo-300 select-all tracking-wide"
                id="api-key-code"
              >
                {apiKey?.key}
              </code>
              <button
                aria-label="Copy API Key"
                className="shrink-0 cursor-pointer inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/40 px-4 py-3 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 transition-all active:scale-95 relative"
                id="copy-key-btn"
                onClick={handleCopyKey}
                type="button"
              >
                <span className="material-symbols-outlined transition-transform">
                  content_copy
                </span>
                <span id="copy-text">{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
            <p className="text-xs text-amber-200/70 mt-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-amber-400 ">
                warning
              </span>
              Never commit this secret key to client-side repositories or public
              git branches.
            </p>
          </div>
          {/* <!-- SDK Integration Snippets --> */}
          <div className="mb-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">
                  Integrate the SDK
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Install the Aura / Observe SDK in your Node.js, Python, or
                  Next.js application.
                </p>
              </div>
              {/* <!-- Package Manager Selector --> */}
              <div className="flex items-center bg-[#07090e] border border-[#232c42] rounded-lg p-0.5 text-xs font-mono">
                {(["npm", "pnpm", "pip"] as const).map((tab) => (
                  <button
                    key={tab}
                    className={`px-2.5 py-1 cursor-pointer rounded transition-all ${
                      activeTab === tab
                        ? "bg-indigo-600 text-white font-medium"
                        : "text-slate-400 hover:text-white"
                    }`}
                    id={`tab-${tab}`}
                    onClick={() => setActiveTab(tab)}
                    type="button"
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            {/* <!-- Terminal block --> */}
            <div className="rounded-xl border border-[#232c42] bg-[#080b11] overflow-hidden group">
              <div className="flex items-center justify-between bg-[#111724] px-4 py-2 border-b border-[#232c42]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
                  </div>
                  <span className="text-xs font-mono font-medium text-slate-400 ml-2">
                    Terminal
                  </span>
                </div>
                <span
                  className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20"
                  id="pkg-tag"
                >
                  {activeTab}
                </span>
              </div>
              <div className="p-3.5 flex items-center justify-between">
                <code
                  className="text-xs font-mono text-emerald-300"
                  id="terminal-command"
                >
                  {installCommands[activeTab]}
                </code>
                <button
                  className="text-xs text-slate-400 hover:text-white font-mono px-2.5 py-1 rounded bg-[#161d2d] hover:bg-[#20293d] border border-transparent hover:border-slate-600 transition-all flex items-center gap-1.5"
                  id="btn-copy-install"
                  onClick={() => {
                    () => {};
                  }}
                  type="button"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    id="install-icon"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      height="14"
                      rx="2"
                      ry="2"
                      width="14"
                      x="8"
                      y="8"
                    ></rect>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                  </svg>
                  <span id="install-text">copy</span>
                </button>
              </div>
            </div>
            {/* <!-- .env snippet --> */}
            <div className="rounded-xl border border-[#232c42] bg-[#080b11] overflow-hidden group">
              <div className="flex items-center justify-between bg-[#111724] px-4 py-2 border-b border-[#232c42]">
                <span className="text-xs font-mono font-medium text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  .env.local
                </span>
                <span className="text-[11px] text-slate-500">
                  Environment variables
                </span>
              </div>
              <pre className="p-3.5 text-xs font-mono text-indigo-200 overflow-x-auto leading-relaxed">
                <code id="env-snippet-code">
                  CENTUMTRACE_API_KEY=aura_live_9f8d38102b4c7e6a5381d9f03c2e1b8a{" "}
                  {"\n"}
                  CENTUMTRACE_PROJECT_ID=prj_9a8f4c2e1b
                </code>
              </pre>
            </div>
            {/* <!-- TypeScript code snippet --> */}
            <div className="rounded-xl border border-[#232c42] bg-[#080b11] overflow-hidden">
              <div className="flex items-center justify-between bg-[#111724] px-4 py-2 border-b border-[#232c42]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span className="text-xs font-mono font-medium text-slate-300">
                    centumtrace.ts
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  TypeScript
                </span>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                <code>
                  <span className="text-violet-400">import</span> Aura{" "}
                  <span className="text-violet-400">from</span>{" "}
                  <span className="text-emerald-300">"@aura/sdk"</span>;{"\n\n"}
                  <span className="text-violet-400">export const</span> aura ={" "}
                  <span className="text-violet-400">new</span>{" "}
                  <span className="text-yellow-300">Aura</span>
                  {"({\n"}
                  {"  apiKey: process.env."}
                  <span className="text-indigo-300">CENTUMTRACE_API_KEY</span>
                  {"!,\n"}
                  {"  projectId: process.env."}
                  <span className="text-indigo-300">
                    CENTUMTRACE_PROJECT_ID
                  </span>
                  {"!,\n"}
                  {"});\n\n"}
                  <span className="text-slate-500">
                    {
                      "// Start capturing your LLM traces & latency automatically:\n"
                    }
                  </span>
                  <span className="text-violet-400">await</span> aura.
                  <span className="text-yellow-300">trace</span>
                  {"({\n"}
                  {"  name: "}
                  <span className="text-emerald-300">
                    "customer_support_query"
                  </span>
                  {",\n"}
                  {"  model: "}
                  <span className="text-emerald-300">"gpt-4"</span>
                  {",\n"}
                  {"});"}
                </code>
              </pre>
            </div>
          </div>
          {/* <!-- Bottom Action Buttons --> */}
          <div className="pt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 border-t border-[#1a2235]">
            {/* <button
              className="text-xs font-medium text-slate-400 hover:text-indigo-300 py-2.5 transition-colors text-center sm:text-left hover:underline"
              onClick={() => {}}
              type="button"
            >
              I'll integrate later
            </button> */}
            <button
              className="btn-lift cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30"
              onClick={handleContinue}
              type="button"
            >
              <span>Continue to Analytics</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingStepCard;
