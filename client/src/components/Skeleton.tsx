const Skeleton = () => {
  return (
    <div className="gyano-page-shell space-y-5 p-6">
      <div
        className="h-48 w-full rounded-3xl bg-slate-200 dark:bg-white/10"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)",
          backgroundSize: "400px 100%",
          animation: "shimmer 1.5s infinite linear",
        }}
      />

      <div className="h-6 w-1/2 animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />

      <div className="h-4 w-full animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />
      <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="h-32 animate-pulse rounded-3xl bg-slate-200 dark:bg-white/10"></div>
        <div className="h-32 animate-pulse rounded-3xl bg-slate-200 dark:bg-white/10"></div>
      </div>
    </div>
  );
};

export default Skeleton;
