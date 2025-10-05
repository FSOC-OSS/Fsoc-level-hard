import React from "react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen theme-screen flex items-center justify-center p-6">
      <div className="app-card rounded-xl p-8 text-center max-w-md w-full">
        <h2 className="text-2xl font-bold mb-3">404 - Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300">The page you are looking for does not exist.</p>
      </div>
    </div>
  );
};

export default NotFoundPage;
