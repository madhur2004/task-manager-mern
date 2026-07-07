import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <p className="text-6xl font-bold text-gray-300">404</p>
      <h1 className="mt-2 text-xl font-semibold text-gray-800">
        Page not found
      </h1>
      <p className="max-w-sm mt-1 mb-6 text-sm text-gray-500">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className="btn-primary">
        <IoArrowBackCircleOutline size={25} />
      </Link>
    </div>
  );
}
