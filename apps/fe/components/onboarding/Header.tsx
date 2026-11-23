const Header = () => {
  return (
    <header className="h-16 border-b border-[#1b2234] bg-[#0a0d14]/85 backdrop-blur-md flex items-center justify-between px-6 lg:px-12 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-1 ring-white/20 transition-transform hover:scale-105">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="9"></circle>
            <path d="M12 3a9 9 0 0 1 9 9"></path>
          </svg>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg tracking-tight bg-linear-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Aura
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            v2.4
          </span>
        </div>
      </div>
      {/* <!-- Stepper progress mini badge with radar effect --> */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium bg-[#111726] border border-[#212d47] px-3 py-1.5 rounded-full shadow-inner">
          <div className="relative flex items-center justify-center w-2 h-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 radar-pulse"></span>
            <span className="relative inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <span className="text-slate-300">Workspace Onboarding</span>
        </div>
        <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>
        {/* <a className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-300 transition-colors" href="#documentation" onClick="showToast('Navigating to Documentation...')">
        Documentation ↗
      </a> */}
      </div>
    </header>
  );
};

export default Header;
