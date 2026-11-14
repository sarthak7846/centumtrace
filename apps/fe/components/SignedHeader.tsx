"use client";

import { useRef, useEffect, useState } from "react";
import { signOutAction } from "@/app/auth/actions";

const SignedHeader = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="anim-header fixed top-0 left-64 right-0 h-16 bg-surface/85 backdrop-blur-xl border-b border-surface-container-high/40 z-40 flex items-center justify-end px-space-lg">
      {/* <!-- Interactive Search Bar --> */}
      {/* <div className="flex items-center gap-space-md flex-1 max-w-xl">
          <div className="relative w-full flex items-center group">
            <span className="material-symbols-outlined absolute left-3 text-outline text-[18px] group-focus-within:text-primary transition-colors duration-200">
              search
            </span>
            <input
              className="w-full h-9 pl-9 pr-14 rounded-lg bg-surface-container/60 hover:bg-surface-container text-on-surface placeholder-outline font-body-md text-body-md border border-outline-variant/30 focus:border-primary/60 focus:bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/25 transition-all duration-200"
              id="global-search"
              placeholder="Search traces, spans, run IDs..."
              type="text"
            />
            <kbd className="absolute right-2.5 flex items-center px-1.5 py-0.5 rounded bg-surface-container-high text-outline group-focus-within:text-primary border border-outline-variant/30 font-caption text-caption tracking-wider transition-colors">
              ⌘K
            </kbd>
          </div>
        </div> */}
      {/* <!-- Right Header Actions --> */}
      <div className="flex items-center gap-space-md">
        {/* <!-- Live Stream Active indicator with radar ping ring --> */}
        {/* <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-tertiary-container/15 border border-tertiary/30 text-tertiary font-label-sm text-label-sm shadow-sm cursor-default select-none">
            <div className="relative flex items-center justify-center w-2.5 h-2.5">
              <span className="radar-ring absolute inline-flex h-full w-full rounded-full bg-tertiary"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
            </div>
            <span className="font-medium">Live Stream Active</span>
          </div> */}
        {/* <!-- Docs link --> */}
        <a
          className="hidden sm:flex items-center gap-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60 px-2.5 py-1.5 rounded-lg transition-all duration-200 font-label-sm text-label-sm"
          href="#"
        >
          <span className="material-symbols-outlined text-[18px]">
            library_books
          </span>
          Docs
        </a>
        {/* <!-- Notification bell with badge --> */}
        <button
          className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 active:scale-95"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[20px]">
            notifications
          </span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error shadow-[0_0_6px_rgba(255,180,171,0.8)]"></span>
        </button>
        {/* <!-- Profile Avatar --> */}
        <div className="relative flex items-center pl-space-xs" ref={menuRef}>
          <button
            type="button"
            aria-expanded={open}
            aria-haspopup="true"
            aria-controls="user-dropdown-menu"
            className="relative cursor-pointer rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-primary/60 group transition-all duration-200 active:scale-95"
            id="user-menu-button"
            onClick={() => setOpen((prev) => !prev)}
          >
            <div className="relative">
              <img
                alt="Alex Chen - Workspace Admin"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/30 group-hover:ring-primary group-focus:ring-primary transition-all duration-200"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBexmCtFz_y9fXMf3gAyPAtk5mp-xmd_XNpidjqQAblAjz-OTVyzz43acJ25lam8eqc88T7h2Vt4KjmAmImQyY-u5R-RTQjzdPZvRnAc_dmvQI7YOk0B_3dEIhgwhmAuFknofe5TmI8lkIynWknF9hWcHYXHrHiSfOCKN3AI9_XUIzka7BHjbJILZpQNC4DkFn0cPTnsXkG8jJsj83-QJD-gMybzQv-Hk8IpOkjVUkzCLoUuM6UXej5Vw"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-surface"></span>
            </div>
          </button>
          {/* <!-- Profile Dropdown Menu --> */}
          {open && (
            <div
              id="user-dropdown-menu"
              aria-labelledby="user-menu-button"
              role="menu"
              className="absolute right-0 top-full mt-2.5 w-64 rounded-xl bg-surface-container-low/95 backdrop-blur-xl border border-surface-container-high/60 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7),0_0_24px_rgba(192,193,255,0.08)] py-1.5 z-50 origin-top-right animate-in fade-in-0 zoom-in-95"
            >
              {/* <!-- User Profile Header --> */}
              <div className="px-3.5 py-3 border-b border-surface-container-high/50 flex items-center gap-3">
                <div className="relative shrink-0">
                  <img
                    alt="Ricky"
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-primary/40"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBexmCtFz_y9fXMf3gAyPAtk5mp-xmd_XNpidjqQAblAjz-OTVyzz43acJ25lam8eqc88T7h2Vt4KjmAmImQyY-u5R-RTQjzdPZvRnAc_dmvQI7YOk0B_3dEIhgwhmAuFknofe5TmI8lkIynWknF9hWcHYXHrHiSfOCKN3AI9_XUIzka7BHjbJILZpQNC4DkFn0cPTnsXkG8jJsj83-QJD-gMybzQv-Hk8IpOkjVUkzCLoUuM6UXej5Vw"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-surface-container-low"></span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-label-md text-label-md font-semibold text-on-surface truncate">
                      Ricky
                    </span>
                    <span className="font-caption text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium border border-primary/20 shrink-0">
                      Admin
                    </span>
                  </div>
                  <span className="font-caption text-caption text-outline truncate">
                    ricky@centumtrace.ai
                  </span>
                </div>
              </div>
              {/* <!-- Menu Action Links --> */}
              <div className="p-1.5 flex flex-col gap-0.5">
                <a
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/70 transition-all duration-150 font-label-sm text-label-sm group"
                  href="#"
                  role="menuitem"
                >
                  <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary transition-colors">
                    account_circle
                  </span>
                  <span>Your Profile</span>
                </a>
                <a
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/70 transition-all duration-150 font-label-sm text-label-sm group"
                  href="#"
                  role="menuitem"
                >
                  <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary transition-colors">
                    settings
                  </span>
                  <span>Account Settings</span>
                </a>
                <a
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/70 transition-all duration-150 font-label-sm text-label-sm group"
                  href="#"
                  role="menuitem"
                >
                  <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-tertiary transition-colors">
                    key
                  </span>
                  <div className="flex items-center justify-between flex-1">
                    <span>API Keys &amp; Telemetry</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  </div>
                </a>
              </div>
              {/* <!-- Divider --> */}
              <div className="my-1 border-t border-surface-container-high/50 mx-1.5"></div>
              {/* <!-- Support Link --> */}
              <div className="p-1.5 flex flex-col gap-0.5">
                <a
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/70 transition-all duration-150 font-label-sm text-label-sm group"
                  href="#"
                  role="menuitem"
                >
                  <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary transition-colors">
                    help
                  </span>
                  <span>Documentation &amp; Support</span>
                </a>
              </div>
              {/* <!-- Divider --> */}
              <div className="my-1 border-t border-surface-container-high/50 mx-1.5"></div>
              {/* <!-- Sign Out Link --> */}
              <form className="p-1.5" action={signOutAction}>
                <button
                  className="flex items-center cursor-pointer w-full gap-2.5 px-2.5 py-2 rounded-lg text-error/90 hover:text-error hover:bg-error-container/20 transition-all duration-150 font-label-sm text-label-sm group"
                  type="submit"
                  role="menuitem"
                >
                  <span className="material-symbols-outlined text-[18px] text-error/80 group-hover:text-error group-hover:translate-x-0.5 transition-all">
                    logout
                  </span>
                  <span className="font-medium">Sign out</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default SignedHeader;
