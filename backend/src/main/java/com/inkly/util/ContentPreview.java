package com.inkly.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Helpers for post content (which is HTML from the editor).
 *
 * Visitors who are not logged in only get a short preview of a post. The preview is
 * built HERE, on the server, so the full text never leaves the backend for them:
 * hiding it only in React would be easy to get around by calling the API directly.
 */
public final class ContentPreview {

    /** About two short paragraphs. */
    public static final int PREVIEW_WORDS = 60;

    private static final int WORDS_PER_MINUTE = 200;

    private ContentPreview() {
    }

    /** "<p>Hello <b>you</b></p>" -> "Hello you" (tags removed, common entities decoded, spaces tidied). */
    public static String toPlainText(String html) {
        if (html == null) {
            return "";
        }
        String text = html
                .replaceAll("(?is)<(script|style)[^>]*>.*?</\\1>", " ") // never keep code from these
                // Block tags separate words: "<p>end.</p><p>Next" -> "end. Next"
                .replaceAll("(?i)</?(p|div|h[1-6]|li|ul|ol|blockquote|pre|br|hr|tr|td|th|table)\\b[^>]*>", " ")
                // Inline tags don't: "<strong>bold</strong>, text" -> "bold, text" (no space before the comma)
                .replaceAll("<[^>]*>", "")
                .replace("&nbsp;", " ")
                .replace("&lt;", "<")
                .replace("&gt;", ">")
                .replace("&quot;", "\"")
                .replace("&#39;", "'")
                .replace("&amp;", "&"); // last, so "&amp;lt;" stays "&lt;"
        return text.replaceAll("\\s+", " ").trim();
    }

    /** Reading time of the FULL post, so a preview still says "5 min read". */
    public static int readingMinutes(String html) {
        String text = toPlainText(html);
        int words = text.isEmpty() ? 0 : text.split(" ").length;
        return Math.max(1, Math.round(words / (float) WORDS_PER_MINUTE));
    }

    /** True if the post is longer than the preview, i.e. there is more to read after logging in. */
    public static boolean isLongerThanPreview(String html) {
        String text = toPlainText(html);
        return !text.isEmpty() && text.split(" ").length > PREVIEW_WORDS;
    }

    // One block of the post: a paragraph, heading, list item, quote or code block
    private static final Pattern BLOCK = Pattern.compile(
            "<(p|h[1-6]|li|blockquote|pre)\\b[^>]*>(.*?)</\\1>",
            Pattern.CASE_INSENSITIVE | Pattern.DOTALL);

    /**
     * The first PREVIEW_WORDS words of the post, keeping its paragraphs and headings
     * (so a heading doesn't run into the next sentence), ending with "…" where it was cut.
     * Only plain text survives: every block is rebuilt as a fresh, escaped tag.
     */
    public static String preview(String html) {
        List<String[]> blocks = new ArrayList<>(); // {tag, text}
        String cleaned = html == null ? "" : html.replaceAll("(?is)<(script|style)[^>]*>.*?</\\1>", " ");
        Matcher m = BLOCK.matcher(cleaned);
        while (m.find()) {
            String tag = m.group(1).toLowerCase();
            String outTag = tag.matches("h[12]") ? "h2" : tag.matches("h[3-6]") ? "h3" : "p";
            String text = toPlainText(m.group(2));
            if (!text.isEmpty()) {
                blocks.add(new String[] { outTag, text });
            }
        }
        if (blocks.isEmpty()) { // plain text without any tags
            blocks.add(new String[] { "p", toPlainText(cleaned) });
        }

        StringBuilder out = new StringBuilder();
        int wordsLeft = PREVIEW_WORDS;
        for (int i = 0; i < blocks.size() && wordsLeft > 0; i++) {
            String tag = blocks.get(i)[0];
            String[] words = blocks.get(i)[1].split(" ");
            int take = Math.min(words.length, wordsLeft);
            wordsLeft -= take;
            // "…" when this block was cut, or when the preview ends here but the post goes on
            boolean moreAfter = take < words.length || (wordsLeft == 0 && i < blocks.size() - 1);
            String text = String.join(" ", Arrays.copyOf(words, take)) + (moreAfter ? "…" : "");
            out.append('<').append(tag).append('>').append(escapeHtml(text)).append("</").append(tag).append('>');
        }
        return out.toString();
    }

    private static String escapeHtml(String text) {
        return text.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
