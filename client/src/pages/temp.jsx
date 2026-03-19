import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-center">
      <h1 className="text-6xl font-bold text-black">404</h1>

      <p className="mt-4 text-lg text-gray-600">
        Oops! The page you're looking for doesn't exist.
      </p>

      <Link
        to="/"
        className="mt-6 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;