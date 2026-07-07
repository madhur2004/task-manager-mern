import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckSquare, LogIn } from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";
import { Input } from "../components/FormControls.jsx";
import { Spinner } from "../components/FeedbackStates.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      nextErrors.password = "Password is required";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      await login(email.trim(), password);

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 sm:mt-12 animate-slide-up">
      <div className="mb-8 text-center">
        <span className="inline-flex items-center justify-center w-12 h-12 mb-3 text-white bg-blue-600 shadow-md rounded-xl">
          <CheckSquare size={26} />
        </span>

        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>

        <p className="mt-2 text-sm text-gray-500">
          Sign in to continue managing your tasks.
        </p>
      </div>

      <div className="p-6 card">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            error={errors.email}
            disabled={submitting}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            error={errors.password}
            disabled={submitting}
            required
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              Remember me
            </label>
          </div>

          {formError && (
            <div
              className="px-3 py-2 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50"
              role="alert"
              aria-live="polite"
            >
              {formError}
            </div>
          )}

          <button
            type="submit"
            className="justify-center w-full btn-primary"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Spinner />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <LogIn size={16} />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
