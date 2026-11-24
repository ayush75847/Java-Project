import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { getErrorMessage } from "../api/client";
import Alert from "../components/ui/Alert";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useAuth } from "../hooks/useAuth";
import { adminService } from "../services/adminService";
import { postService } from "../services/postService";
import { formatDate } from "../utils/format";

const TABS = [
  { value: "users", label: "Users" },
  { value: "posts", label: "Posts" },
];

// /admin: manage users (roles) and moderate posts. Only ADMINs reach this page
// (ProtectedRoute adminOnly), and the backend checks the role again on every request.
export default function AdminDashboard() {
  const { user: me } = useAuth();
  // The tab lives in the URL (?tab=posts), so a refresh or a shared link keeps it
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") === "posts" ? "posts" : "users";

  const [users, setUsers] = useState(null);
  const [posts, setPosts] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [search, setSearch] = useState("");

  // What the "Are you sure?" popup is about:
  // { type: "role", user, newRole }  or  { type: "delete", post }
  const [pending, setPending] = useState(null);
  const [working, setWorking] = useState(false);
  const [actionError, setActionError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let ignore = false;
    Promise.all([adminService.getUsers(), adminService.getPosts()])
      .then(([usersData, postsData]) => {
        if (ignore) return;
        setUsers(usersData);
        setPosts(postsData);
      })
      .catch((err) => !ignore && setLoadError(getErrorMessage(err)));
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  function switchTab(value) {
    setSearchParams(value === "users" ? {} : { tab: value }, { replace: true });
    setSearch("");
    setSuccess(""); // messages belong to the tab they came from
    setActionError("");
  }

  async function confirmPending() {
    setWorking(true);
    setActionError("");
    setSuccess("");
    try {
      if (pending.type === "role") {
        const updated = await adminService.changeRole(pending.user.id, pending.newRole);
        setUsers((list) => list.map((u) => (u.id === updated.id ? updated : u)));
        setSuccess(
          updated.role === "ADMIN"
            ? `${updated.username} is now an admin`
            : `${updated.username} is no longer an admin`,
        );
      } else {
        await postService.remove(pending.post.id);
        setPosts((list) => list.filter((p) => p.id !== pending.post.id));
        setSuccess(`Deleted "${pending.post.title}"`);
      }
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setWorking(false);
      setPending(null);
    }
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-10">
        <Alert type="error">{loadError}</Alert>
        <Button
          variant="secondary"
          onClick={() => {
            setLoadError("");
            setReloadKey((k) => k + 1);
          }}
        >
          Try again
        </Button>
      </div>
    );
  }

  const loaded = users !== null && posts !== null;
  const query = search.trim().toLowerCase();
  const shownUsers = users?.filter(
    (u) => u.username.includes(query) || u.email.toLowerCase().includes(query),
  );
  const shownPosts = posts?.filter(
    (p) =>
      p.title.toLowerCase().includes(query) ||
      p.author.username.toLowerCase().includes(query),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">Admin dashboard</h1>
      <p className="mt-1 text-sm text-ink-muted">Manage roles and moderate posts.</p>

      {/* Numbers at a glance */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Users" value={users?.length} />
        <Stat label="Admins" value={users?.filter((u) => u.role === "ADMIN").length} />
        <Stat label="Posts" value={posts?.length} />
        <Stat label="Hidden posts" value={posts?.filter((p) => p.status === "INACTIVE").length} />
      </div>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-3 border-b border-line">
        <div role="tablist" aria-label="Admin sections" className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={tab === t.value}
              onClick={() => switchTab(t.value)}
              className={`-mb-px border-b-2 px-3 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-brand-500 ${
                tab === t.value
                  ? "border-brand-500 text-ink"
                  : "border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={tab === "users" ? "Search name or email" : "Search title or author"}
          aria-label="Search"
          className="mb-2 w-full rounded-lg border border-line-strong bg-surface-overlay px-3 py-2 text-sm text-ink placeholder:text-ink-subtle outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 sm:w-64"
        />
      </div>

      <div className="mt-4 space-y-3">
        <Alert type="success">{success}</Alert>
        <Alert type="error">{actionError}</Alert>
      </div>

      <div className="mt-4">
        {!loaded ? (
          <TableSkeleton />
        ) : tab === "users" ? (
          <UsersTable
            users={shownUsers}
            meId={me.id}
            onChangeRole={(user, newRole) => setPending({ type: "role", user, newRole })}
          />
        ) : (
          <PostsTable posts={shownPosts} onDelete={(post) => setPending({ type: "delete", post })} />
        )}
      </div>

      <ConfirmDialog
        open={pending !== null}
        loading={working}
        onConfirm={confirmPending}
        onCancel={() => setPending(null)}
        {...dialogText(pending)}
      />
    </div>
  );
}

// Title, text and button of the popup, depending on what's being confirmed
function dialogText(pending) {
  if (!pending) return { title: "" };
  if (pending.type === "delete") {
    return {
      title: "Delete this post?",
      confirmLabel: "Delete",
      danger: true,
      children: `"${pending.post.title}" by ${pending.post.author.username} will be gone for good. This can't be undone.`,
    };
  }
  const promote = pending.newRole === "ADMIN";
  return {
    title: promote ? `Make ${pending.user.username} an admin?` : `Remove ${pending.user.username}'s admin role?`,
    confirmLabel: promote ? "Make admin" : "Remove admin",
    danger: !promote,
    children: promote
      ? "They will be able to see every post, delete any post, and change other users' roles."
      : "They will become a normal user right away.",
  };
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-line bg-surface-raised px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle">{label}</p>
      <p className="mt-1 text-2xl font-bold text-ink">{value ?? "–"}</p>
    </div>
  );
}

// Wide tables scroll sideways inside their box on phones (the page itself never does)
function TableBox({ children }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface-raised">
      <table className="w-full min-w-[640px] text-left text-sm">{children}</table>
    </div>
  );
}

const TH = "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-subtle";
const TD = "px-4 py-3 align-middle";

function UsersTable({ users, meId, onChangeRole }) {
  if (users.length === 0) return <NoResults />;
  return (
    <TableBox>
      <thead className="border-b border-line">
        <tr>
          <th className={TH}>User</th>
          <th className={TH}>Sign-in</th>
          <th className={TH}>Role</th>
          <th className={TH}>Joined</th>
          <th className={`${TH} text-right`}>Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line">
        {users.map((u) => {
          const isMe = u.id === meId;
          const isAdmin = u.role === "ADMIN";
          return (
            <tr key={u.id}>
              <td className={TD}>
                <Link to={`/users/${u.id}`} className="group flex items-center gap-3">
                  <Avatar user={u} size="sm" />
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-ink group-hover:text-brand-400">
                      {u.username}
                      {isMe && <span className="ml-1.5 font-normal text-ink-subtle">(you)</span>}
                    </span>
                    <span className="block truncate text-xs text-ink-subtle">{u.email}</span>
                  </span>
                </Link>
              </td>
              <td className={TD}>
                <span className="text-ink-muted">{u.provider === "GOOGLE" ? "Google" : "Email"}</span>
                {!u.verified && (
                  <Badge tone="warn" className="ml-2">
                    Not verified
                  </Badge>
                )}
              </td>
              <td className={TD}>
                {isAdmin ? <Badge tone="brand">Admin</Badge> : <Badge>User</Badge>}
              </td>
              <td className={`${TD} whitespace-nowrap text-ink-muted`}>{formatDate(u.createdAt)}</td>
              <td className={`${TD} text-right`}>
                {isMe ? (
                  <span className="text-xs text-ink-subtle">Can't change your own role</span>
                ) : (
                  <Button
                    variant={isAdmin ? "danger" : "secondary"}
                    className="px-3! py-1.5! whitespace-nowrap"
                    onClick={() => onChangeRole(u, isAdmin ? "USER" : "ADMIN")}
                  >
                    {isAdmin ? "Remove admin" : "Make admin"}
                  </Button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </TableBox>
  );
}

function PostsTable({ posts, onDelete }) {
  if (posts.length === 0) return <NoResults />;
  return (
    <TableBox>
      <thead className="border-b border-line">
        <tr>
          <th className={TH}>Post</th>
          <th className={TH}>Author</th>
          <th className={TH}>Status</th>
          <th className={TH}>Created</th>
          <th className={`${TH} text-right`}>Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line">
        {posts.map((p) => (
          <tr key={p.id}>
            <td className={`${TD} max-w-xs`}>
              <Link
                to={`/posts/${p.id}`}
                className="block truncate font-semibold text-ink hover:text-brand-400"
              >
                {p.title}
              </Link>
            </td>
            <td className={TD}>
              <Link to={`/users/${p.author.id}`} className="text-ink-muted hover:text-brand-400">
                {p.author.username}
              </Link>
            </td>
            <td className={TD}>
              {p.status === "ACTIVE" ? <Badge tone="success">Published</Badge> : <Badge>Hidden</Badge>}
            </td>
            <td className={`${TD} whitespace-nowrap text-ink-muted`}>{formatDate(p.createdAt)}</td>
            <td className={`${TD} text-right`}>
              <Button
                variant="danger"
                className="px-3! py-1.5!"
                onClick={() => onDelete(p)}
                aria-label={`Delete "${p.title}"`}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </TableBox>
  );
}

const BADGE_TONES = {
  neutral: "border-line-strong text-ink-muted",
  brand: "border-brand-500/40 bg-brand-500/10 text-brand-400",
  success: "border-success/40 bg-success/10 text-success",
  warn: "border-danger/40 bg-danger/10 text-danger",
};

function Badge({ tone = "neutral", className = "", children }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium ${BADGE_TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

function NoResults() {
  return <p className="py-12 text-center text-sm text-ink-muted">Nothing matches your search.</p>;
}

function TableSkeleton() {
  return (
    <div
      className="animate-pulse space-y-3 rounded-2xl border border-line bg-surface-raised p-5"
      aria-busy="true"
      aria-label="Loading"
    >
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-surface-overlay" />
          <div className="h-3 flex-1 rounded bg-surface-overlay" />
          <div className="h-3 w-20 rounded bg-surface-overlay" />
        </div>
      ))}
    </div>
  );
}
