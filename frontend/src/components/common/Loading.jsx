import React from "react";

const Loading = ({ fullScreen = false }) => {
  const containerClass = fullScreen
    ? "min-h-screen flex items-center justify-center bg-dark"
    : "flex items-center justify-center py-8";

  return (
    <div className={containerClass}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
    </div>
  );
};

export default Loading;
