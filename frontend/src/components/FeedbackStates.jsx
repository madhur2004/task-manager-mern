import { memo } from "react";
import { AlertCircle, Inbox, Loader2, RefreshCw, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Spinner = memo(function Spinner({ size = 20, className = "" }) {
  return (
    <Loader2
      size={size}
      role="status"
      aria-label="Loading"
      className={`animate-spin ${className}`}
    />
  );
});

export const LoadingScreen = memo(function LoadingScreen({
  label = "Loading...",
  fullScreen = false,
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center animate-fade-in ${
        fullScreen ? "min-h-screen" : "py-16"
      }`}
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50">
        <Spinner size={30} className="text-blue-600" />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-gray-800">Please wait</h2>

      <p className="mt-2 text-sm text-gray-500">{label}</p>
    </div>
  );
});

export const ErrorState = memo(function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred.",
  onRetry,
  showHome = false,
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
        <AlertCircle size={30} className="text-red-600" />
      </div>

      <h2 className="mt-5 text-xl font-semibold text-gray-800">{title}</h2>

      <p className="max-w-md mt-2 text-sm leading-6 text-gray-500">{message}</p>

      <div className="flex gap-3 mt-6">
        {onRetry && (
          <button onClick={onRetry} className="btn-primary">
            <RefreshCw size={16} />
            Try Again
          </button>
        )}

        {showHome && (
          <button onClick={() => navigate("/")} className="btn-secondary">
            <Home size={16} />
            Dashboard
          </button>
        )}
      </div>
    </div>
  );
});

export const EmptyState = memo(function EmptyState({
  icon,
  title = "No Tasks Found",
  message = "Create your first task to stay organized.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="flex items-center justify-center w-20 h-20 text-blue-600 rounded-full bg-blue-50">
        {icon ?? <Inbox size={36} />}
      </div>

      <h2 className="mt-5 text-xl font-semibold text-gray-800">{title}</h2>

      <p className="max-w-md mt-2 text-sm leading-6 text-gray-500">{message}</p>

      {actionLabel && (
        <button onClick={onAction} className="mt-6 btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
});
