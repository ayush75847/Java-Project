import { lazy, Suspense, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { getErrorMessage, getErrorStatus } from "../api/client";
import ImagePicker from "../components/ImagePicker";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { postService } from "../services/postService";
import { toPlainText } from "../utils/format";

// The editor is big: only download it when someone opens this page
const RichTextEditor = lazy(() => import("../components/RichTextEditor"));

const TITLE_MAX = 150; // same as @Size(max = 150) in PostRequest.java

const EMPTY_POST = { title: "", content: "", status: "ACTIVE", imageUrl: null };

// One page for both:  /write  (new post)  and  /posts/:id/edit  (edit your post)
export default function PostEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState(isEdit ? null : EMPTY_POST); // null = still loading
  const [imageFile, setImageFile] = useState(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [dirty, setDirty] = useState(false); // unsaved changes?

  const [errors, setErrors] = useState({});
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  // Edit mode: load the post, and make sure it's yours
  useEffect(() => {
    if (!isEdit) return;
    let ignore = false;
    postService
      .getPost(id)
      .then((post) => {
        if (ignore) return;
        if (post.author.id !== user.id) {
          setLoadError("You can only edit your own posts.");
          return;
        }
        setForm({
          title: post.title,
          content: post.content,
          status: post.status,
          imageUrl: post.imageUrl,
        });
      })
      .catch((err) => {
        if (ignore) return;
        setLoadError(
          getErrorStatus(err) === 404 ? "This post doesn't exist anymore." : getErrorMessage(err),
        );
      });
    return () => {
      ignore = true;
    };
  }, [id, isEdit, user.id]);

  // Closing the tab or refreshing with unsaved changes: the browser asks "Leave site?"
  useEffect(() => {
    if (!dirty) return;
    function warn(e) {
      e.preventDefault();
    }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
    setDirty(true);
  }

  function validate() {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Give your post a title";
    else if (form.title.trim().length > TITLE_MAX)
      newErrors.title = `Title must be ${TITLE_MAX} characters or less`;
    if (!toPlainText(form.content)) newErrors.content = "Write something first";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      // The error text sits next to the field, which may be scrolled out of view
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSaving(true);
    const body = { title: form.title.trim(), content: form.content, status: form.status };

    // 1. Save the text. If this fails, nothing was saved: say so and stay here.
    let saved;
    try {
      saved = isEdit ? await postService.update(id, body) : await postService.create(body);
    } catch (err) {
      toast.error("Your post was not saved", { description: getErrorMessage(err) });
      setSaving(false);
      return;
    }

    // 2. Then the image (it needs the post's id, so it can only happen after step 1)
    try {
      if (imageFile) await postService.uploadImage(saved.id, imageFile);
      else if (imageRemoved && form.imageUrl) await postService.removeImage(saved.id);
    } catch (err) {
      setDirty(false);
      setSaving(false);
      toast.warning("Post saved, but the image didn't work", {
        description: `${getErrorMessage(err)} You can try the image again here.`,
        duration: 8000,
      });
      if (!isEdit) {
        // The post exists now: continue on its edit page, so trying again doesn't create a copy
        navigate(`/posts/${saved.id}/edit`, { replace: true });
      }
      return;
    }

    setDirty(false);
    toast.success(
      isEdit ? "Changes saved" : saved.status === "ACTIVE" ? "Post published" : "Saved as a hidden draft",
      isEdit || saved.status === "ACTIVE" ? undefined : { description: "Only you and admins can see it." },
    );
    navigate(`/posts/${saved.id}`, { replace: isEdit });
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-ink">Can't edit this post</h1>
        <p className="text-ink-muted">{loadError}</p>
        <Link to="/" className="inline-block text-brand-400 hover:text-brand-300 hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  if (!form) return <EditorSkeleton />;

  const titleLength = form.title.trim().length;
  const submitLabel = isEdit
    ? "Save changes"
    : form.status === "ACTIVE"
      ? "Publish"
      : "Save as hidden";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">
            {isEdit ? "Edit post" : "Write a post"}
          </h1>
          <StatusToggle value={form.status} onChange={(s) => update("status", s)} />
        </div>


        {/* Title */}
        <div className="space-y-1.5">
          <label htmlFor="title" className="sr-only">
            Title
          </label>
          <textarea
            id="title"
            rows={1}
            value={form.title}
            onChange={(e) => update("title", e.target.value.replace(/\n/g, ""))}
            placeholder="Title"
            aria-invalid={!!errors.title}
            // field-sizing-content: the box grows when a long title wraps onto a 2nd line
            className={`field-sizing-content w-full resize-none border-0 border-b bg-transparent pb-3 text-3xl font-extrabold leading-tight tracking-tight text-ink placeholder:text-ink-subtle/60 outline-none transition sm:text-4xl ${
              errors.title ? "border-danger" : "border-line focus:border-brand-500"
            }`}
            autoFocus={!isEdit}
          />
          <div className="flex justify-between text-xs">
            <span className="text-danger">{errors.title}</span>
            <span className={titleLength > TITLE_MAX ? "text-danger" : "text-ink-subtle"}>
              {titleLength}/{TITLE_MAX}
            </span>
          </div>
        </div>

        <ImagePicker
          currentUrl={form.imageUrl}
          file={imageFile}
          removed={imageRemoved}
          onPick={(file) => {
            setImageFile(file);
            setImageRemoved(false);
            setDirty(true);
          }}
          onRemove={() => {
            setImageFile(null);
            setImageRemoved(true);
            setDirty(true);
          }}
        />

        {/* Content */}
        <div className="space-y-1.5">
          <span className="block text-sm font-medium text-ink">Story</span>
          <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-surface-overlay" />}>
            <RichTextEditor
              id="content"
              value={form.content}
              onChange={(html) => {
                // The editor reports its first value on load: that isn't a user change
                if (html !== form.content) update("content", html);
              }}
              invalid={!!errors.content}
            />
          </Suspense>
          {errors.content && <p className="text-xs text-danger">{errors.content}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-line pt-6">
          <Link
            to={isEdit ? `/posts/${id}` : "/"}
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-ink-muted transition hover:text-ink"
          >
            Cancel
          </Link>
          <Button type="submit" loading={saving}>
            {saving ? "Saving..." : submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Published (everyone sees it) / Hidden (only you and admins)
function StatusToggle({ value, onChange }) {
  const options = [
    { value: "ACTIVE", label: "Published" },
    { value: "INACTIVE", label: "Hidden" },
  ];
  return (
    <div role="radiogroup" aria-label="Who can see this post" className="flex rounded-lg border border-line-strong bg-surface-raised p-1 text-sm">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-md px-3 py-1.5 font-semibold transition focus-visible:outline-2 focus-visible:outline-brand-500 ${
            value === o.value
              ? "bg-brand-500 text-ink-inverse"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function EditorSkeleton() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse space-y-6 px-4 py-10" aria-busy="true" aria-label="Loading post">
      <div className="h-8 w-40 rounded bg-surface-overlay" />
      <div className="h-12 w-3/4 rounded bg-surface-overlay" />
      <div className="h-28 rounded-xl bg-surface-overlay" />
      <div className="h-96 rounded-xl bg-surface-overlay" />
    </div>
  );
}
