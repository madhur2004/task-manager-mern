import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckSquare, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { Input } from "../components/FormControls.jsx";
import { Spinner } from "../components/FeedbackStates.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = "Name is required";
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Enter a valid email";
    if (!password) next.password = "Password is required";
    else if (password.length < 6)
      next.password = "Password must be at least 6 characters";
    if (!confirm) next.confirm = "Please confirm your password";
    else if (confirm !== password) next.confirm = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate("/", { replace: true });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Registration failed");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 sm:mt-12 animate-slide-up">
      <div className="mb-8 text-center">
        <span className="inline-flex items-center justify-center w-12 h-12 mb-3 text-white bg-blue-600 rounded-xl">
          <CheckSquare size={26} />
        </span>
        <h1 className="text-2xl font-semibold text-gray-900">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Start organizing your work in seconds
        </p>
      </div>

      <div className="p-6 card">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            error={errors.name}
            required
            disabled={submitting}
            autoComplete="name"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            error={errors.email}
            required
            disabled={submitting}
            autoComplete="email"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            error={errors.password}
            required
            disabled={submitting}
            autoComplete="new-password"
          />
          <Input
            label="Confirm Password"
            name="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-enter your password"
            error={errors.confirm}
            required
            disabled={submitting}
            autoComplete="new-password"
          />

          {formError && (
            <div className="px-3 py-2 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
              {formError}
            </div>
          )}

          <button
            type="submit"
            className="justify-center w-full btn-primary"
            disabled={submitting}
          >
            {submitting ? <Spinner /> : <UserPlus size={16} />}
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
