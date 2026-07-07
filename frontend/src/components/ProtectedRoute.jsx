import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { LoadingScreen } from "./FeedbackStates.jsx";

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <LoadingScreen label="Checking your session..." />;
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
