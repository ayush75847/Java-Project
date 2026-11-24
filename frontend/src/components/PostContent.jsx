import DOMPurify from "dompurify";

// Looks like HTML if it contains at least one tag, e.g. <p> or <strong>
const HAS_HTML = /<[a-z][\s\S]*>/i;

// Shows the body of a post.
// Post content is written by users, so it is NEVER put on the page as-is:
// DOMPurify removes anything dangerous (<script>, onclick=..., javascript: links)
// and keeps normal formatting (paragraphs, bold, lists, links...).
export default function PostContent({ content = "" }) {
  // Plain text (no tags): keep the user's line breaks
  if (!HAS_HTML.test(content)) {
    return (
      <div className="post-content whitespace-pre-line">{content}</div>
    );
  }

  const safeHtml = DOMPurify.sanitize(content, {
    USE_PROFILES: { html: true },
  });

  return (
    <div
      className="post-content"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
