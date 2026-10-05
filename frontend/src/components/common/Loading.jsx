const Loading = ({ fullScreen = false }) => {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={
        fullScreen
          ? "min-h-screen flex items-center justify-center"
          : "flex items-center justify-center p-8"
      }
    >
      <div className="size-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loading;