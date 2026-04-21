const Skeleton = () => {
  return (
    <div className="p-6 space-y-4">
      {/* Banner */}
      <div
        className="h-48 w-full rounded-xl bg-gray-800"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
          backgroundSize: "400px 100%",
          animation: "shimmer 1.5s infinite linear",
        }}
      />

      {/* Title */}
      <div className="h-6 w-1/2 bg-gray-800 rounded animate-pulse" />

      {/* Text */}
      <div className="h-4 w-full bg-gray-800 rounded animate-pulse" />
      <div className="h-4 w-5/6 bg-gray-800 rounded animate-pulse" />

      {/* Cards */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="h-32 bg-gray-800 rounded animate-pulse"></div>
        <div className="h-32 bg-gray-800 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default Skeleton;