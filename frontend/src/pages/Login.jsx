import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { getErrorMessage, getErrorStatus } from "../api/client";
import AuthCard from "../components/AuthCard";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import FormField from "../components/ui/FormField";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";
import { hasNoErrors, validateEmail } from "../utils/validators";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveLogin } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // If a protected page sent us here, go back there after login (used from step 9.4)
  const redirectTo = location.state?.from || "/";

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    const newErrors = {
      email: validateEmail(form.email),
      password: form.password ? "" : "Password is required",
    };
    setErrors(newErrors);
    if (!hasNoErrors(newErrors)) return;

    setLoading(true);
    const email = form.email.trim().toLowerCase();
    try {
      const { token, user } = await authService.login(email, form.password);
      saveLogin(token, user);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (getErrorStatus(err) === 403) {
        // Registered but never verified: send a fresh code and go to the code page.
        // If a code was sent less than a minute ago the backend says "wait": that's fine, it's still valid.
        await authService.resendOtp(email).catch(() => {});
        navigate(`/verify?email=${encodeURIComponent(email)}`);
        return;
      }
      setServerError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to your Inkly account"
      footer={
        <>
          New to Inkly?{" "}
          <Link
            to="/register"
            className="font-medium text-brand-400 hover:text-brand-300 hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Alert type="error">{serverError}</Alert>
        <FormField
          id="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />
        <Button type="submit" loading={loading} className="w-full">
          Log in
        </Button>
      </form>
    </AuthCard>
  );
}
