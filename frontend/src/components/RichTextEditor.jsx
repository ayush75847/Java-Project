import { Editor } from "@tinymce/tinymce-react";
import "tinymce/tinymce";
import "tinymce/models/dom/model";
import "tinymce/themes/silver";
import "tinymce/icons/default";
import "tinymce/skins/ui/oxide-dark/skin.js";
import "tinymce/skins/ui/oxide-dark/content.js";
import "tinymce/skins/content/dark/content.js";
import "tinymce/plugins/autolink";
import "tinymce/plugins/autoresize";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/wordcount";

const CONTENT_STYLE = `
  body {
    background: #1f1f1f;
    color: #f5f5f4;
    font-family: ui-sans-serif, system-ui, sans-serif;
    font-size: 17px;
    line-height: 1.8;
    margin: 16px 20px;
  }
  a { color: #fb923c; }
  blockquote { border-left: 4px solid #f97316; margin-left: 0; padding-left: 16px; color: #a8a29e; font-style: italic; }
  pre { background: #141414; border: 1px solid #292524; border-radius: 10px; padding: 14px; font-size: 14px; }
  .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before { color: #8f8883; }
`;

// A controlled editor: give it `value` (HTML) and get every change in `onChange(html)`
export default function RichTextEditor({ id, value, onChange, invalid = false }) {
  return (
    <div
      className={`overflow-hidden rounded-xl border transition focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/30 ${
        invalid ? "border-danger" : "border-line-strong"
      }`}
    >
      <Editor
        id={id}
        licenseKey="gpl" // TinyMCE is free to self-host under the GPL
        value={value}
        onEditorChange={(html) => onChange(html)}
        init={{
          skin: "oxide-dark",
          content_css: "dark",
          content_style: CONTENT_STYLE,
          menubar: false,
          branding: false,
          promotion: false, // hides the "Upgrade" button
          statusbar: true,
          elementpath: false,
          plugins: "autolink autoresize link lists wordcount",
          toolbar:
            "undo redo | blocks | bold italic underline strikethrough | bullist numlist blockquote | link | removeformat",
          // Only the block types our post page has styles for
          block_formats:
            "Paragraph=p; Heading=h2; Subheading=h3; Quote=blockquote; Code block=pre",
          min_height: 380,
          max_height: 900,
          autoresize_bottom_margin: 24,
          placeholder: "Tell your story...",
          link_default_target: "_blank",
          link_assume_external_targets: "https",
          // Pasting from Word / websites: keep the text, drop their colours and fonts
          paste_as_text: false,
          invalid_styles: "color background background-color font-family font-size",
          // Narrow windows: buttons wrap onto a 2nd line instead of hiding behind "...".
          // (On touch phones TinyMCE uses its own swipeable toolbar instead.)
          toolbar_mode: "wrap",
          // tinymce-react only reports changes on "change keyup compositionend setcontent".
          // Some edits fire only "input" (autocorrect, emoji pickers, some phone keyboards),
          // so the last words before clicking Publish could be lost. Report those too.
          setup: (editor) => {
            editor.on("input", () => editor.dispatch("change"));
          },
        }}
      />
    </div>
  );
}
