const Loading = () => {
  return (
    <main className="fixed top-0 left-0 flex min-h-screen min-w-screen items-center justify-center bg-background/50 backdrop-blur px-6 py-10 text-background antialiased selection:bg-primary selection:text-primary-foreground">
      <div className="flex flex-col items-center justify-center space-y-8">
        <div
          aria-hidden="true"
          className="relative flex h-24 w-24 items-center justify-center sm:h-32 sm:w-32">
          <svg
            className="absolute inset-0 h-full w-full animate-spin animation-duration-[2s] text-foreground/50"
            fill="none"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeDasharray="20 10" strokeWidth="4" />
          </svg>

          <svg
            className="absolute inset-2 h-[calc(100%-16px)] w-[calc(100%-16px)] animate-[spin_4s_linear_infinite_reverse] text-foreground/30"
            fill="none"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeDasharray="10 30" strokeWidth="2" />
          </svg>

          <div className="absolute inset-0 flex animate-pulse items-center justify-center [filter:drop-shadow(0_0_10px_var(--color-primary))]/45">
            <svg
              className="h-10 w-10 text-primary sm:h-14 sm:w-14"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-3 text-center">
          <h1 className="font-heading text-xl font-bold uppercase tracking-[0.2em] text-primary sm:text-2xl animate-pulse">
            Sincronizando datos
          </h1>
        </div>
      </div>
    </main>
  );
};

export default Loading;
