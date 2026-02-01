const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-white/10 rounded-full" />
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-white rounded-full animate-spin" />
      </div>
      <p className="text-neutral-500 text-sm animate-pulse">Loading...</p>
    </div>
  );
};

export default Loader;
