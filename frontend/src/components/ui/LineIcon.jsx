// A simple outline icon (24x24, drawn with lines). Pass the drawing as children:
//   <LineIcon><circle cx="12" cy="12" r="3" /></LineIcon>
export default function LineIcon({ children, className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}
