import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { getErrorMessage } from "../api/client";
import AuthCard from "../components/AuthCard";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import FormField from "../components/ui/FormField";
import { authService } from "../services/authService";
import {
  hasNoErrors,
  validateEmail,
  validatePassword,
  validateUsername,
} from "../utils/validators";
import GoogleButton from "../components/GoogleButton";
import Divider from "../components/ui/Divider";

const EMPTY_FORM = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // One handler for every input: uses the input's id/name to know which field changed
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function validate() {
    const newErrors = {
      username: validateUsername(form.username),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirmPassword:
        form.confirmPassword === form.password ? "" : "Passwords don't match",
    };
    setErrors(newErrors);
    return hasNoErrors(newErrors);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const email = form.email.trim().toLowerCase();
      await authService.register({
        username: form.username.trim(),
        email,
        password: form.password,
      });
      // Next step: enter the code we just emailed. The email travels in the URL so a refresh keeps it.
      navigate(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start writing on Inkly"
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-brand-400 hover:text-brand-300 hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <GoogleButton label="Sign up with Google" />
      <Divider />
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Alert type="error">{serverError}</Alert>
        <FormField
          id="username"
          label="Username"
          value={form.username}
          onChange={handleChange}
          error={errors.username}
          hint="3-20 letters, numbers or _"
          autoComplete="username"
        />
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
          hint="6-64 characters"
          autoComplete="new-password"
        />
        <FormField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />
        <Button type="submit" loading={loading} className="w-full">
          Sign up
        </Button>
      </form>
    </AuthCard>
  );
}
