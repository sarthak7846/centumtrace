"use client";

import { authAction } from "../actions";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import SignupForm from "@/components/auth/SignupForm";
import SigninForm from "@/components/auth/SigninForm";

type AuthFormProps = {
  mode: "signin" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isSignUp = mode === "signup";
  const [state, action, pending] = useActionState(
    authAction.bind(null, mode),
    null,
  );

  useEffect(() => {
    if (!state?.message) return;

    if (state.success) {
      toast.success(state.message);

      setTimeout(() => {
        router.push("/auth/signin");
      }, 1000);

      return;
    }

    toast.error(state.message);
  }, [state]);

  const togglePasswordVisibility = () => {
    const input: HTMLInputElement | null = document.getElementById(
      "password",
    ) as HTMLInputElement;
    const icon = document.getElementById("passwordEye");
    if (!input || !icon) return;

    // Smooth rotation pop
    icon.style.transform = "scale(0.7)";
    setTimeout(() => {
      if (input.type === "password") {
        input.type = "text";
        icon.textContent = "visibility_off";
      } else {
        input.type = "password";
        icon.textContent = "visibility";
      }
      icon.style.transform = "scale(1)";
    }, 120);
  };

  const checkPasswordStrength = (val: string) => {
    const bars = [
      document.getElementById("str-1"),
      document.getElementById("str-2"),
      document.getElementById("str-3"),
      document.getElementById("str-4"),
    ];
    const label = document.getElementById("strengthLabel");
    if (!bars[0] || !label) return;

    let score = 0;
    if (val.length >= 6) score++;
    if (val.length >= 8 && /[0-9]/.test(val)) score++;
    if (val.length >= 10 && /[A-Z]/.test(val) && /[0-9]/.test(val)) score++;
    if (val.length >= 10 && /[^A-Za-z0-9]/.test(val)) score++;

    const states = [
      { text: "Too short", color: "bg-error shadow-sm shadow-error/40" },
      {
        text: "Fair",
        color: "bg-error-container shadow-sm shadow-error-container/40",
      },
      {
        text: "Good",
        color: "bg-primary-container shadow-sm shadow-primary-container/40",
      },
      {
        text: "Very Strong",
        color: "bg-tertiary shadow-sm shadow-tertiary/40",
      },
    ];

    bars.forEach((b, i) => {
      b!.className =
        "h-1 rounded-full transition-all duration-500 ease-out " +
        (i < score ? states[score - 1].color : "bg-surface-variant");
    });

    if (score === 0) {
      label.textContent = "Must be strong";
      label.className =
        "font-caption text-caption text-on-surface-variant transition-colors duration-300 font-medium";
    } else {
      label.textContent = states[score - 1].text;
      label.className =
        score < 2
          ? "font-caption text-caption text-error transition-colors duration-300 font-semibold"
          : "font-caption text-caption text-primary transition-colors duration-300 font-semibold";
    }
  };

  return (
    <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-6 lg:px-12 py-space-lg">
      <div className="flex flex-col w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start py-space-sm lg:py-space-md">
          {/* <!-- Left Column: Registration Panel --> */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center w-full max-w-xl mx-auto lg:mx-0">
            {/* <!-- Header Group --> */}
            <div className="flex flex-col gap-space-xs mb-space-lg entrance-fade delay-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/30 border border-secondary/20 shadow-sm w-fit transition-transform duration-200 hover:scale-105">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"
                  style={{ animation: "badgePulse 2s infinite" }}
                ></span>
                <span className="font-caption text-caption text-secondary tracking-wide uppercase font-semibold">
                  Full Tracing Suite Access • 14-Day Trial
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1 bg-linear-to-r from-on-surface via-on-surface to-on-surface-variant bg-clip-text">
                {mode === "signin"
                  ? "Welcome back"
                  : "Start your AI observability trial"}
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                No credit card required. Connect your OpenAI, Anthropic, or
                custom endpoints in 2 minutes.
              </p>
            </div>
            {/* <!-- Social Sign-up Row --> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mb-space-md entrance-fade delay-3">
              {/* <!-- Google --> */}
              <button
                className="relative group flex items-center justify-center gap-space-sm h-11 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 hover:border-primary/50 transition-all duration-200 shadow-sm hover:-translate-y-0.5 active:scale-[0.98] overflow-hidden"
                type="button"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
                <FcGoogle className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />

                <span className="font-label-md text-label-md text-on-surface font-medium">
                  Google
                </span>
              </button>
              {/* <!-- GitHub --> */}
              <button
                className="relative group flex items-center justify-center gap-space-sm h-11 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 hover:border-primary/50 transition-all duration-200 shadow-sm hover:-translate-y-0.5 active:scale-[0.98] overflow-hidden"
                type="button"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
                <FaGithub className="w-4 h-4 fill-current text-on-surface shrink-0 transition-transform duration-200 group-hover:scale-110" />
                <span className="font-label-md text-label-md text-on-surface font-medium">
                  GitHub
                </span>
              </button>
            </div>
            {/* <!-- Divider --> */}
            <div className="relative flex items-center justify-center my-space-sm mb-space-md entrance-fade delay-3">
              <div className="w-full h-px bg-surface-variant"></div>
              <span className="absolute px-3 font-caption text-caption text-on-surface-variant bg-background uppercase tracking-wider">
                or register with email
              </span>
            </div>
            {/* <!-- Signup Form --> */}
            {isSignUp ? (
              <SignupForm
                isSignUp={isSignUp}
                pending={pending}
                action={action}
                checkPasswordStrength={checkPasswordStrength}
                togglePasswordVisibility={togglePasswordVisibility}
              />
            ) : (
              <SigninForm
                pending={pending}
                action={action}
                togglePasswordVisibility={togglePasswordVisibility}
              />
            )}
            {/* <!-- Bottom Switch to Sign-in --> */}
            <div className="mt-space-md text-center entrance-fade delay-5">
              <p className="font-body-md text-body-md text-on-surface-variant">
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}
                <a
                  className="text-primary font-semibold hover:underline hover:text-primary-fixed ml-1 transition-colors duration-150 inline-flex items-center gap-1 group/signin"
                  data-path="sign-in"
                  href={isSignUp ? "/auth/signin" : "/auth/signup"}
                >
                  {isSignUp ? "Sign in" : "Sign up"}
                  <span className="material-symbols-outlined text-[14px] transition-transform duration-200 group-hover/signin:translate-x-0.5">
                    arrow_forward
                  </span>
                </a>
              </p>
            </div>
          </div>
          {/* <!-- Right Column: Benefits, Metrics & Testimonial Showcase --> */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col gap-space-lg w-full">
            {/* <!-- Main Showcase Container --> */}
            <div className="relative rounded-2xl bg-surface-container-low/90 backdrop-blur-xl border border-outline-variant/30 p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-500 hover:border-primary/40 entrance-fade delay-3">
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary-container/20 rounded-full blur-3xl pointer-events-none animate-orb-1"></div>
              <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-tertiary-container/15 rounded-full blur-3xl pointer-events-none animate-orb-3"></div>
              <div className="relative z-10 flex flex-col gap-space-lg">
                <div className="flex flex-col gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-container/25 border border-secondary/20 shadow-sm w-fit transition-transform duration-200 hover:scale-105">
                    <span className="text-tertiary font-bold animate-pulse">
                      ✦
                    </span>
                    <span className="font-label-sm text-label-sm text-secondary-fixed font-semibold tracking-wide">
                      Built for Engineering Teams
                    </span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight bg-linear-to-r from-on-surface via-on-surface to-on-surface-variant bg-clip-text">
                    Full visibility into your AI stack
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Trace every request, catch latency spikes, and monitor model
                    performance in real time.
                  </p>
                </div>
                {/* <!-- Interactive Feature Checklist Items with Hover Glows --> */}
                <div className="flex flex-col gap-space-sm pt-2">
                  <div className="group/item flex items-center gap-3 p-3 rounded-xl bg-surface-container/60 hover:bg-surface-container border border-transparent hover:border-primary/30 transition-all duration-300 hover:translate-x-1 hover:shadow-lg hover:shadow-primary/5 cursor-default entrance-fade delay-4">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-linear-to-tr from-primary to-tertiary flex items-center justify-center text-on-primary shadow-sm transition-transform duration-300 group-hover/item:scale-110 group-hover/item:rotate-6">
                      <span className="material-symbols-outlined text-[15px] font-bold">
                        check
                      </span>
                    </div>
                    <span className="font-title-md text-title-md text-on-surface text-[15px] font-semibold transition-colors duration-200 group-hover/item:text-primary-fixed">
                      Instant trace latency &amp; error logging
                    </span>
                  </div>
                  <div className="group/item flex items-center gap-3 p-3 rounded-xl bg-surface-container/60 hover:bg-surface-container border border-transparent hover:border-primary/30 transition-all duration-300 hover:translate-x-1 hover:shadow-lg hover:shadow-primary/5 cursor-default entrance-fade delay-5">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-linear-to-tr from-primary to-tertiary flex items-center justify-center text-on-primary shadow-sm transition-transform duration-300 group-hover/item:scale-110 group-hover/item:rotate-6">
                      <span className="material-symbols-outlined text-[15px] font-bold">
                        check
                      </span>
                    </div>
                    <span className="font-title-md text-title-md text-on-surface text-[15px] font-semibold transition-colors duration-200 group-hover/item:text-primary-fixed">
                      Automated prompt evaluation &amp; guardrails
                    </span>
                  </div>
                  <div className="group/item flex items-center gap-3 p-3 rounded-xl bg-surface-container/60 hover:bg-surface-container border border-transparent hover:border-primary/30 transition-all duration-300 hover:translate-x-1 hover:shadow-lg hover:shadow-primary/5 cursor-default entrance-fade delay-6">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-linear-to-tr from-primary to-tertiary flex items-center justify-center text-on-primary shadow-sm transition-transform duration-300 group-hover/item:scale-110 group-hover/item:rotate-6">
                      <span className="material-symbols-outlined text-[15px] font-bold">
                        check
                      </span>
                    </div>
                    <span className="font-title-md text-title-md text-on-surface text-[15px] font-semibold transition-colors duration-200 group-hover/item:text-primary-fixed">
                      Token usage &amp; cost optimization
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- Social Proof Metrics Bar with Interactive Cards & Animated Reveal --> */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-surface-container-low/60 border border-outline-variant/30 backdrop-blur text-center entrance-fade delay-7">
              <div className="group/stat p-2 rounded-lg transition-all duration-300 hover:bg-surface-container/60 hover:scale-[1.03]">
                <span
                  className="counter font-headline-md text-headline-md text-primary font-bold block transition-transform duration-300 group-hover/stat:scale-105"
                  data-suffix="%"
                  data-target="99.99"
                >
                  99.99%
                </span>
                <p className="font-caption text-caption text-on-surface-variant uppercase tracking-wider mt-0.5 group-hover/stat:text-on-surface transition-colors">
                  Trace Reliability
                </p>
              </div>
              <div className="group/stat p-2 rounded-lg transition-all duration-300 hover:bg-surface-container/60 hover:scale-[1.03]">
                <span
                  className="counter font-headline-md text-headline-md text-secondary font-bold block transition-transform duration-300 group-hover/stat:scale-105"
                  data-prefix=""
                  data-suffix="B+"
                  data-target="4.2"
                >
                  4.2B+
                </span>
                <p className="font-caption text-caption text-on-surface-variant uppercase tracking-wider mt-0.5 group-hover/stat:text-on-surface transition-colors">
                  Tokens Traced
                </p>
              </div>
              <div className="group/stat p-2 rounded-lg transition-all duration-300 hover:bg-surface-container/60 hover:scale-[1.03]">
                <span
                  className="counter font-headline-md text-headline-md text-tertiary font-bold block transition-transform duration-300 group-hover/stat:scale-105"
                  data-prefix="&lt; "
                  data-suffix="ms"
                  data-target="2"
                >
                  &lt; 2ms
                </span>
                <p className="font-caption text-caption text-on-surface-variant uppercase tracking-wider mt-0.5 group-hover/stat:text-on-surface transition-colors">
                  Tracing Overhead
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
