import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const ALLOWED_TAGS = new Set([
	"b", "strong", "i", "em", "u", "br", "p", "span",
	"ul", "ol", "li", "a",
]);

const ALLOWED_ATTRS = new Set(["href"]);

/**
 * Sanitizes untrusted HTML from the AniList API before rendering.
 * Allowlist approach: strips unknown tags & attributes, drops event handlers,
 * and blocks javascript:/data: URLs in href.
 *
 * ponytail: does not balance mismatched tags (browser auto-closes anyway),
 * upgrade path: use DOMPurify if richer markup ever needed.
 */
export function sanitizeHtml(input: string): string {
	const escape = (s: string) =>
		s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

	let out = "";
	let rest = input;

	while (rest.length > 0) {
		const open = rest.indexOf("<");

		// tail with no further tag: plain text
		if (open === -1) {
			out += rest;
			break;
		}

		// text before the tag
		out += rest.slice(0, open);
		rest = rest.slice(open);

		const match = /^<(\/?)([a-zA-Z0-9]+)((?:\s+[a-zA-Z0-9_-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>/.exec(
			rest,
		);

		// not a tag-looking construct: treat the '<' as literal text
		if (!match) {
			out += "&lt;";
			rest = rest.slice(1);
			continue;
		}

		const [, closing, name, attrs] = match;
		const tag = name.toLowerCase();
		rest = rest.slice(match[0].length);

		if (!ALLOWED_TAGS.has(tag)) continue; // drop disallowed tag, keep its text content
		if (closing) {
			out += `</${tag}>`;
		} else if (tag === "a") {
			// links must survive sanitization but with a safe href only
			const href = attrs.match(/href\s*=\s*(?:"([^"]*)"|'([^']*)')/);
			const url = href?.[1] ?? href?.[2] ?? "";
			out += `<a href="${escape(safeUrl(url))}" target="_blank" rel="noopener noreferrer">`;
		} else {
			out += `<${tag}>`;
		}
	}

	return out;
}

function safeUrl(url: string): string {
	const trimmed = url.trim();
	if (/^(https?:)?\/\//i.test(trimmed)) return trimmed;
	return "about:blank";
}
