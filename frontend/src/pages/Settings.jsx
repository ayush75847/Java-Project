import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { getErrorMessage, getErrorStatus } from "../api/client";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import FormField from "../components/ui/FormField";
import { useAuth } from "../hooks/useAuth";
import { userService } from "../services/userService";
import { validateUsername } from "../utils/validators";

const BIO_MAX = 300; // same as @Size(max = 300) in UpdateProfileRequest.java

// /settings: change your own username and bio
export default function Settings() {
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    username: user.username,
    bio: user.bio || "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Only send what really changed (the backend lowercases usernames, so we compare that way)
  const changes = {};
  if (form.username.trim().toLowerCase() !== user.username) {
    changes.username = form.username.trim();
  }
  if (form.bio.trim() !== (user.bio || "")) {
    changes.bio = form.bio.trim(); // "" clears the bio
  }
  const hasChanges = Object.keys(changes).length > 0;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {
      username: validateUsername(form.username),
      bio: form.bio.trim().length > BIO_MAX ? `Bio must be ${BIO_MAX} characters or less` : "",
    };
    setErrors(newErrors);
    if (newErrors.username || newErrors.bio) return;
    if (!hasChanges) return;

    setSaving(true);
    try {
      const updated = await userService.updateMe(changes);
      setUser(updated); // the navbar, menu and pages show the new name right away
      setForm({ username: updated.username, bio: updated.bio || "" });
      toast.success("Profile updated");
    } catch (err) {
      if (getErrorStatus(err) === 409) {
        // "Username already taken" belongs next to the username field
        setErrors({ ...newErrors, username: getErrorMessage(err) });
      } else {
        toast.error("Couldn't update your profile", { description: getErrorMessage(err) });
      }
    } finally {
      setSaving(false);
    }
  }

  const bioLength = form.bio.trim().length;

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">Settings</h1>
      <p className="mt-1 text-sm text-ink-muted">
        This is what other people see on your profile.
      </p>

      <div className="mt-8 rounded-2xl border border-line bg-surface-raised p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-4">
          <Avatar user={user} size="lg" />
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-ink">{user.username}</p>
            <p className="truncate text-sm text-ink-subtle">{user.email}</p>
            <Link
              to={`/users/${user.id}`}
              className="text-sm text-brand-400 hover:text-brand-300 hover:underline"
            >
              View my profile
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          <FormField
            id="username"
            label="Username"
            value={form.username}
            onChange={handleChange}
            error={errors.username}
            hint="3-20 letters, numbers or _ (saved in lowercase)"
            autoComplete="username"
          />

          <div className="space-y-1.5">
            <label htmlFor="bio" className="block text-sm font-medium text-ink">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={form.bio}
              onChange={handleChange}
              placeholder="A few words about you"
              aria-invalid={!!errors.bio}
              className={`w-full resize-y rounded-lg border bg-surface-overlay px-3 py-2.5 text-sm text-ink placeholder:text-ink-subtle outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 ${
                errors.bio ? "border-danger" : "border-line-strong"
              }`}
            />
            <div className="flex justify-between text-xs">
              <span className="text-danger">{errors.bio}</span>
              <span className={bioLength > BIO_MAX ? "text-danger" : "text-ink-subtle"}>
                {bioLength}/{BIO_MAX}
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" loading={saving} disabled={!hasChanges}>
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
