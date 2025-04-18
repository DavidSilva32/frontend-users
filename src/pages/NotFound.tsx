import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <div className="text-7xl mb-4">😕</div>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
        404 - Page Not Found
      </h1>
      <p className="text-gray-600 text-base sm:text-lg mb-6 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/login")}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        Back to Login
      </button>
    </div>
  );
}
