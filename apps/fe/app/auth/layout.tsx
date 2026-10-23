const AuthLayout = ({ children }: LayoutProps<"/auth">) => {
  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen relative flex flex-col justify-between selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 dot-grid opacity-35"></div>
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-primary-container/20 rounded-full blur-[130px] animate-orb-1"></div>
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-secondary-container/20 rounded-full blur-[128px] animate-orb-2"></div>
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-tertiary-container/15 rounded-full blur-[130px] animate-orb-3"></div>
      </div>
      <header className="relative z-10 w-full entrance-fade delay-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <a
            className="flex items-center gap-space-sm group transition-transform duration-300 hover:scale-[1.02]"
            data-path="sign-in"
            href="#"
          >
            {/* <img
                alt="Aura Brand Logo"
                className="h-8 w-auto object-contain transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida/AEtjO1WfRtVduEPCjJH6x5O6BoFFarCMPUGwOhltq8GCkiQa5v3JmqY2fjjWOQgefCt9BdfLGF-lhhUhffAD96s2qmlMkaBErcjm_3_izYkCJqS_SdYCz4fIN34dH2Bgt4tgJdqzSuM9RgnrY6acC5SBjrADYLF1Nv_tULoNdTiVdN-98ObDAHcR41pC9gazh5_0oJC28eoNr69QNcvcInxYP10FgCRv0cwJz47W1CtUhiY5UWfsNaP-7DWPIZo"
              /> */}
            <span className="font-title-md text-title-md text-on-surface tracking-tight font-bold group-hover:text-primary transition-colors duration-200">
              Traceforge
            </span>
          </a>
          <a
            className="group inline-flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-all duration-200 py-space-xs px-space-sm rounded-lg hover:bg-surface-container-high/80 backdrop-blur-sm border border-transparent hover:border-outline-variant/40"
            href="#"
          >
            <span className="material-symbols-outlined text-[10px] transition-transform duration-200 group-hover:-translate-x-1">
              arrow_back
            </span>
            <span className="">Back to website</span>
          </a>
        </div>
      </header>
      {children}
      <footer className="relative z-10 w-full entrance-fade delay-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md font-label-sm text-label-sm text-on-surface-variant">
          <div className="flex items-center gap-space-xs">
            <span className="">
              © {new Date().getFullYear()} Traceforge Technologies, Inc. All rights reserved.
            </span>
          </div>
          <nav
            className="flex items-center gap-space-lg"
            data-active-classes="text-on-surface font-semibold"
          >
            <a
              className="text-on-surface-variant hover:text-on-surface transition-colors duration-200"
              data-path="terms-of-service"
              href="#"
            >
              Terms
            </a>
            <a
              className="text-on-surface-variant hover:text-on-surface transition-colors duration-200"
              data-path="privacy-policy"
              href="#"
            >
              Privacy
            </a>
            <a
              className="text-on-surface-variant hover:text-on-surface transition-colors duration-200"
              data-path="security"
              href="#"
            >
              Security
            </a>
            <a
              className="text-on-surface-variant hover:text-on-surface transition-colors duration-200"
              data-path="system-status"
              href="#"
            >
              Status
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
