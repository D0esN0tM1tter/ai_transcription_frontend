import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Log a 404 error to the console for debugging purposes
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 p-4">
      <div className="text-center bg-white rounded-xl shadow-xl p-8 sm:p-12 max-w-md w-full border border-gray-200">
        <h1 className="text-7xl sm:text-8xl font-extrabold text-indigo-600 mb-6">
          404
        </h1>
        <p className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
          Oops! Page Not Found
        </p>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <a
          href="/"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Return to Homepage
        </a>
      </div>
    </div>
  );
};

export default NotFound;