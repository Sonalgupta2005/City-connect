import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="absolute top-0 left-0 w-full min-h-screen bg-gray-100 dark:bg-gray-900 z-20 flex items-center justify-center">
      <div className="text-center px-4">
        <i className="fas fa-map-marked-alt text-6xl text-gray-400 dark:text-gray-600 mb-4"></i>
        <h1 className="mb-4 text-4xl font-bold dark:text-white">404</h1>
        <p className="mb-4 text-xl text-gray-600 dark:text-gray-400">Oops! Page not found</p>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-500">
          The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          <i className="fas fa-home mr-2"></i>Return to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
