// Same rules as the backend, so users see mistakes before the request is even sent.
// The backend still checks everything: these are only for a nicer experience.
// Each function returns an error message, or "" when the value is fine.

export function validateUsername(value) {
  if (!value.trim()) return "Username is required";
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(value.trim()))
    return "3-20 letters, numbers or _";
  return "";
}

export function validateEmail(value) {
  if (!value.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
    return "Enter a valid email";
  return "";
}

export function validatePassword(value) {
  if (!value) return "Password is required";
  if (value.length < 6 || value.length > 64) return "Must be 6-64 characters";
  return "";
}

export function validateOtp(value) {
  if (!/^\d{6}$/.test(value)) return "Enter the 6-digit code";
  return "";
}

// True when every value in an errors object is empty
export function hasNoErrors(errors) {
  return Object.values(errors).every((message) => !message);
}
