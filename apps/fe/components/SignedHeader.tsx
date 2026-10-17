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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="border-sidebar-border bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-10 flex h-14 shrink-0 items-center justify-end border-b px-6 backdrop-blur">
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="ring-sidebar-ring flex cursor-pointer items-center gap-2 rounded-full outline-none focus-visible:ring-2"
          aria-expanded={open}
          aria-haspopup="true"
        >
          <span className="bg-sidebar-accent text-sidebar-accent-foreground ring-sidebar-border flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium ring-1">
            U
          </span>
          <span className="text-muted-foreground hidden text-sm sm:inline">Account</span>
        </button>

        {open && (
          <div className="border-sidebar-border bg-popover animate-in fade-in-0 zoom-in-95 absolute top-full right-0 z-20 mt-2 w-48 origin-top-right rounded-xl border py-1 shadow-lg">
            <form action={signOutAction}>
              <button
                type="submit"
                className="text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default SignedHeader;
