import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

// UI Components
import Button from "../components/ui/Button";

// Assets
import logoSolid from "../assets/logo_solid.svg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState(""); // For validation

  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic frontend validation
    if (!email) {
      setValidationError("Email is required.");
      return;
    }
    if (!password) {
      setValidationError("Password is required.");
      return;
    }

    try {
      const didLogin = await login({ email, password });
      if (!didLogin) {
        return;
      }

      navigate("/");
    } catch (err) {
      console.error("Login Error in component:", err);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-base-bg p-5 font-sans">
      <div className="w-full max-w-[420px] rounded-[16px] bg-white p-10 shadow-card">
        <div className="mb-8 flex flex-col items-center justify-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-red">
            <img src={logoSolid} alt="Psyckie Logo" className="h-8 w-8" />
          </div>
          <h2 className="text-[28px] font-serif font-bold text-base-text text-center leading-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-[15px] text-base-muted text-center">
            Sign in to continue your review progress.
          </p>
        </div>

        {(error || validationError) && (
          <div className="mb-4 rounded-md bg-brand-soft p-4 text-sm text-brand-dark">
            {error || validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-[14px] font-semibold text-base-text mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setValidationError(""); // Clear error on change
              }}
              className="w-full rounded-[8px] border border-base-border px-4 py-3 text-[14px] font-medium text-base-text placeholder:text-base-muted/70 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="password"
                className="block text-[14px] font-semibold text-base-text"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[13px] font-medium text-brand-red hover:text-brand-dark"
              >
                Forgot?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setValidationError(""); // Clear error on change
              }}
              className="w-full rounded-[8px] border border-base-border px-4 py-3 text-[14px] font-medium text-base-text placeholder:text-base-muted/70 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-8 text-center text-[14px] text-base-muted font-medium">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-bold text-brand-red hover:text-brand-dark transition-colors"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
