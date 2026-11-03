import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { getErrorMessage, getErrorStatus } from "../api/client";
import AuthCard from "../components/AuthCard";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import FormField from "../components/ui/FormField";
import { useAuth } from "../hooks/useAuth";
import { useCountdown } from "../hooks/useCountdown";
import { authService } from "../services/authService";
import { validateOtp } from "../utils/validators";

const RESEND_WAIT_SECONDS = 60; // same as the backend

export default function VerifyOtp() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const navigate = useNavigate();
  const { saveLogin } = useAuth();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  // A code was just sent when we arrive here, so start with the cooldown running
  const [secondsLeft, setSecondsLeft] = useCountdown(RESEND_WAIT_SECONDS);

  // Opened /verify without an email: nothing to verify
  if (!email) {
    return (
      <AuthCard
        title="Verify your email"
        subtitle="We don't know which email to verify."
      >
        <Link
          to="/register"
          className="block text-center font-medium text-brand-400 hover:text-brand-300 hover:underline"
        >
          Go to sign up
        </Link>
      </AuthCard>
    );
  }

  async function handleVerify(e) {
    e.preventDefault();
    setInfo("");
    const codeError = validateOtp(code);
    if (codeError) return setError(codeError);

    setLoading(true);
    setError("");
    try {
      const { token, user } = await authService.verifyOtp(email, code);
      saveLogin(token, user); // verified = logged in straight away
      navigate("/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err)); // e.g. "Wrong code (3 attempts left)"
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setError("");
    setInfo("");
    try {
      await authService.resendOtp(email);
      setInfo("A new code is on its way.");
      setCode("");
    } catch (err) {
      setError(getErrorMessage(err));
      if (getErrorStatus(err) !== 429) return; // only restart the timer for "please wait"
    } finally {
      setResending(false);
    }
    setSecondsLeft(RESEND_WAIT_SECONDS);
  }

  return (
    <AuthCard
      title="Check your email"
      subtitle={
        <>
          We sent a 6-digit code to{" "}
          <span className="font-medium text-ink">{email}</span>
        </>
      }
      footer={
        <>
          Wrong email?{" "}
          <Link
            to="/register"
            className="font-medium text-brand-400 hover:text-brand-300 hover:underline"
          >
            Sign up again
          </Link>
        </>
      }
    >
      <form onSubmit={handleVerify} className="space-y-4" noValidate>
        <Alert type="error">{error}</Alert>
        <Alert type="success">{info}</Alert>
        <FormField
          id="code"
          label="Verification code"
          value={code}
          // keep digits only, max 6
          onChange={(e) =>
            setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="123456"
          autoFocus
        />
        <Button type="submit" loading={loading} className="w-full">
          Verify
        </Button>
      </form>

      <div className="text-center text-sm text-ink-muted">
        Didn&apos;t get it?{" "}
        <Button
          variant="link"
          onClick={handleResend}
          loading={resending}
          disabled={secondsLeft > 0}
        >
          {secondsLeft > 0 ? `Resend code (${secondsLeft}s)` : "Resend code"}
        </Button>
      </div>
    </AuthCard>
  );
}
