import Loading from "@/assets/loading/loading";

const LoadingScreen = () => {
  return (
    <div className="relative min-h-[200px] w-full">
      <div className="bg-muted fixed top-0 left-0 z-50 h-1 w-full overflow-hidden">
        <div className="bg-primary animate-progress-bar h-full" />
      </div>
      <div className="flex min-h-[calc(100vh-10rem)] animate-pulse items-center justify-center">
        <Loading className="h-60 w-60" />
      </div>
    </div>
  );
};

export default LoadingScreen;
