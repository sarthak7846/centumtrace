import { MdCheck } from "react-icons/md";

const SignupForm = ({
  isSignUp,
  pending,
  action,
  checkPasswordStrength,
  togglePasswordVisibility,
}: {
  isSignUp: boolean;
  pending: boolean;
  action: (payload: FormData) => void;
  checkPasswordStrength: (val: string) => void;
  togglePasswordVisibility: () => void;
}) => {
  return (
    <form
      className="flex flex-col gap-space-md entrance-fade delay-4"
      id="signupForm"
      action={action}
    >
      {/* <!-- Full Name --> */}
      {isSignUp && (
        <div className="flex flex-col gap-1.5 group/field">
          <label
            className="font-label-md text-label-md text-on-surface flex items-center justify-between transition-colors duration-200 group-focus-within/field:text-primary"
            htmlFor="fullName"
          >
            <span className="">Full Name</span>
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-outline text-[18px] pointer-events-none transition-colors duration-200 group-focus-within/field:text-primary">
              person
            </span>
            <input
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-container text-on-surface placeholder:text-outline/60 font-body-md text-body-md border border-transparent focus:border-primary/60 focus:outline-none focus:bg-surface-container-high focus:ring-4 focus:ring-primary/10 transition-all duration-200 shadow-inner"
              id="fullName"
              name="name"
              placeholder="Sarah Jenkins"
              required
              type="text"
            />
          </div>
        </div>
      )}
      {/* <!-- Work Email --> */}
      <div className="flex flex-col gap-1.5 group/field">
        <label
          className="font-label-md text-label-md text-on-surface flex items-center justify-between transition-colors duration-200 group-focus-within/field:text-primary"
          htmlFor="workEmail"
        >
          <span className="">Work Email</span>
        </label>
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3.5 text-outline text-[18px] pointer-events-none transition-colors duration-200 group-focus-within/field:text-primary">
            mail
          </span>
          <input
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-container text-on-surface placeholder:text-outline/60 font-body-md text-body-md border border-transparent focus:border-primary/60 focus:outline-none focus:bg-surface-container-high focus:ring-4 focus:ring-primary/10 transition-all duration-200 shadow-inner"
            id="workEmail"
            name="email"
            placeholder="sarah@company.com"
            required
            type="email"
          />
        </div>
      </div>
      {/* <!-- Password + Strength Meter --> */}
      <div className="flex flex-col gap-1.5 group/field">
        <label
          className="font-label-md text-label-md text-on-surface flex items-center justify-between transition-colors duration-200 group-focus-within/field:text-primary"
          htmlFor="password"
        >
          <span className="">Password</span>
          <span
            className="font-caption text-caption text-on-surface-variant transition-all duration-300 font-medium"
            id="strengthLabel"
          >
            Must be strong
          </span>
        </label>
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3.5 text-outline text-[18px] pointer-events-none transition-colors duration-200 group-focus-within/field:text-primary">
            lock
          </span>
          <input
            className="w-full h-11 pl-10 pr-11 rounded-xl bg-surface-container text-on-surface placeholder:text-outline/60 font-body-md text-body-md border border-transparent focus:border-primary/60 focus:outline-none focus:bg-surface-container-high focus:ring-4 focus:ring-primary/10 transition-all duration-200 shadow-inner"
            id="password"
            onChange={(e) => checkPasswordStrength(e.target.value)}
            placeholder="••••••••••••"
            required
            name="password"
            type="password"
          />
          <button
            aria-label="Toggle password view"
            className="absolute right-3 text-outline flex items-center hover:text-on-surface transition-transform duration-200 hover:scale-110 active:scale-95"
            onClick={togglePasswordVisibility}
            type="button"
          >
            <span
              className="material-symbols-outlined text-[18px] transition-all duration-200"
              id="passwordEye"
            >
              visibility
            </span>
          </button>
        </div>
        {/* <!-- 4-Segment Strength Bars --> */}
        <div className="grid grid-cols-4 gap-1.5 mt-1">
          <div
            className="h-1 rounded-full bg-surface-variant transition-all duration-500 ease-out"
            id="str-1"
          ></div>
          <div
            className="h-1 rounded-full bg-surface-variant transition-all duration-500 ease-out"
            id="str-2"
          ></div>
          <div
            className="h-1 rounded-full bg-surface-variant transition-all duration-500 ease-out"
            id="str-3"
          ></div>
          <div
            className="h-1 rounded-full bg-surface-variant transition-all duration-500 ease-out"
            id="str-4"
          ></div>
        </div>
        <span className="font-caption text-caption text-on-surface-variant mt-0.5">
          Recommended: 8+ chars, 1 number, 1 special symbol
        </span>
      </div>
      {/* <!-- Agreement Checkbox --> */}
      <div className="flex items-start gap-space-sm pt-1">
        <div className="relative flex items-center mt-0.5">
          <input
            className="peer sr-only"
            id="termsCheckbox"
            required
            type="checkbox"
            onChange={(e) => {
              const icon = document.getElementById("termsCheckIcon");
              if (icon) {
                icon.style.display = e.target.checked ? "block" : "none";
              }
            }}
          />
          <div
            className="checkbox-box w-4 h-4 rounded bg-surface-container border border-outline-variant/60 cursor-pointer peer-checked:bg-primary peer-checked:border-primary peer-checked:text-on-primary-container transition-all duration-200 flex items-center justify-center text-on-primary hover:border-primary"
            onClick={() => {
              document.getElementById("termsCheckbox")?.click();
            }}
          >
            <MdCheck />
          </div>
        </div>
        <label
          className="font-caption text-caption text-on-surface-variant cursor-pointer select-none leading-relaxed transition-colors hover:text-on-surface"
          htmlFor="termsCheckbox"
        >
          I agree to Aura's{" "}
          <a
            className="text-primary hover:underline hover:text-primary-fixed"
            href="#"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            className="text-primary hover:underline hover:text-primary-fixed"
            href="#"
          >
            Privacy Policy
          </a>
          , including automated provisioning emails.
        </label>
      </div>
      {/* <!-- Primary CTA --> */}
      <button
        className="btn-ripple-container disabled:opacity-70 relative overflow-hidden w-full h-11 mt-space-xs rounded-xl bg-linear-to-r from-primary-container via-primary-container cursor-pointer to-secondary-container text-on-primary font-label-md text-label-md font-bold tracking-tight shadow-lg shadow-primary-container/25 hover:shadow-primary-container/45 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-space-xs group"
        id="submitBtn"
        type="submit"
        disabled={pending}
      >
        {/* <!-- Continuous soft shine pass on hover --> */}
        <div className="absolute inset-0 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] pointer-events-none"></div>

        {pending ? (
          <span
            className="flex items-center gap-2 relative z-10 transition-transform duration-200 group-hover:translate-x-0.5"
            id="btnText"
          >
            <span className="">Setting up workspace</span>
            <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:translate-x-1.5">
              progress_activity
            </span>
          </span>
        ) : (
          <span
            className="flex items-center gap-2 relative z-10 transition-transform duration-200 group-hover:translate-x-0.5"
            id="btnText"
          >
            <span className="">Create Free Account</span>
            <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:translate-x-1.5">
              arrow_forward
            </span>
          </span>
        )}
      </button>
    </form>
  );
};

export default SignupForm;
