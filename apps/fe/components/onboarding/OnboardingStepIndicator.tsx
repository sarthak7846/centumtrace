

type OnboardingStepIndicatorProps = {
  steps: any[];
  currentStepIndex: number;
  onStepClick?: (index: number) => void;
};

const OnboardingStepIndicator = ({
  steps,
  currentStepIndex,
  onStepClick,
}: OnboardingStepIndicatorProps) => {
  return (
    <nav
      aria-label="Onboarding Progress"
      className="flex items-center justify-center mb-8 px-2 select-none"
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isActive = index === currentStepIndex;
        const isUpcoming = index > currentStepIndex;

        return (
          <div key={step.id} className="flex items-center">
            {/* Step */}
            <button
              type="button"
              aria-label={`Step ${index + 1}: ${step.label}`}
              aria-current={isActive ? "step" : undefined}
              disabled={isUpcoming}
              onClick={() => {
                if (isCompleted) {
                  onStepClick?.(index);
                }
              }}
              className={`group flex flex-col items-center gap-2
                focus:outline-none transition-transform
                ${isCompleted ? "cursor-pointer active:scale-95" : "cursor-default"}
              `}
            >
              {/* Step Badge */}
              <div
                className={`
                  h-10 w-10 rounded-full flex items-center justify-center
                  text-sm font-semibold border-2 transition-all duration-300

                  ${
                    isCompleted
                      ? "bg-emerald-600 border-emerald-400 text-white"
                      : isActive
                        ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/30 scale-105 ring-4 ring-indigo-500/20"
                        : "bg-[#0c101a] border-[#222d44] text-slate-400"
                  }
                `}
              >
                {isCompleted ? "✓" : index + 1}
              </div>

              {/* Step Label */}
              <span
                className={`
                  text-xs whitespace-nowrap transition-colors

                  ${
                    isActive
                      ? "font-semibold text-white"
                      : isCompleted
                        ? "font-medium text-emerald-400"
                        : "font-medium text-slate-400"
                  }
                `}
              >
                {step.label}
              </span>
            </button>

            {/* Progress Line */}
            {index !== steps.length - 1 && (
              <div className="w-14 sm:w-24 h-1 mx-2.5 -mt-5 bg-[#1b2234] rounded-full overflow-hidden">
                <div
                  className={`
                    h-full rounded-full transition-all duration-500
                    ${
                      isCompleted
                        ? "w-full bg-emerald-500"
                        : "w-0"
                    }
                  `}
                />
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default OnboardingStepIndicator;