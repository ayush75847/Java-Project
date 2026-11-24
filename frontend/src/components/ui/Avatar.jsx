const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-20 w-20 text-2xl",
};

// Round picture of a user. No picture yet? Show the first letter of the username.
export default function Avatar({ user, size = "md", className = "" }) {
  const name = user?.username || "?";

  if (user?.profileImage) {
    return (
      <img
        src={user.profileImage}
        alt=""
        className={`shrink-0 rounded-full object-cover ${SIZES[size]} ${className}`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-brand-500/15 font-bold uppercase text-brand-400 ring-1 ring-brand-500/30 ${SIZES[size]} ${className}`}
    >
      {name.charAt(0)}
    </span>
  );
}
