/**
 * Fetches a URL and extracts clean article text.
 * Two strategies racing in parallel: direct fetch + Jina Reader.
 */

// ── Types ──

export interface FetchResult {
  success: boolean;
  text: string;
  title?: string;
  error?: string;
}

// ── Constants ──

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const FETCH_TIMEOUT = 7_000;
const JINA_TIMEOUT = 8_000;
const MAX_TEXT_LENGTH = 80_000;
const MIN_USEFUL_LENGTH = 100;

const STRIP_CONTENT_TAGS = [
  "script",
  "style",
  "noscript",
  "iframe",
  "svg",
  "nav",
  "footer",
  "aside",
  "figcaption",
] as const;

// ── HTML → Text helpers ──

function stripTagsWithContent(html: string): string {
  let result = html;
  for (const tag of STRIP_CONTENT_TAGS) {
    result = result.replace(
      new RegExp(`<${tag}[\\s>][\\s\\S]*?</${tag}>`, "gi"),
      " "
    );
    result = result.replace(new RegExp(`<${tag}[^>]*/?>`, "gi"), " ");
  }
  return result;
}

function tagsToText(html: string): string {
  let text = html;
  text = text.replace(
    /<\/?(p|div|section|article|blockquote|h[1-6]|ul|ol|dl|table|tr|pre|hr)[^>]*>/gi,
    "\n\n"
  );
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/?(li|dt|dd|td|th)[^>]*>/gi, "\n");
  text = text.replace(/<[^>]+>/g, " ");
  return text;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x2F;/g, "/")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&ndash;/g, "\u2013")
    .replace(/&hellip;/g, "\u2026")
    .replace(/&[rl]squo;/g, "'")
    .replace(/&[rl]dquo;/g, '"')
    .replace(/&copy;/g, "\u00A9")
    .replace(/&reg;/g, "\u00AE")
    .replace(/&trade;/g, "\u2122")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
}

function cleanWhitespace(text: string): string {
  return text
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function htmlToText(html: string): string {
  const cleaned = stripTagsWithContent(html);
  const asText = tagsToText(cleaned);
  const decoded = decodeEntities(asText);
  return cleanWhitespace(decoded);
}

// ── Content extraction ──

function extractArticleContent(html: string): string {
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch) {
    const text = htmlToText(articleMatch[1]);
    if (text.length >= MIN_USEFUL_LENGTH) return text;
  }

  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) {
    const text = htmlToText(mainMatch[1]);
    if (text.length >= MIN_USEFUL_LENGTH) return text;
  }

  const classPatterns = [
    /class="[^"]*(?:article|post|entry)[_-]?(?:content|body|text)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /class="[^"]*(?:story|news)[_-]?(?:content|body|text)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /class="[^"]*content[_-]?(?:area|main|wrapper|body)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /id="(?:article|content|story|main)[_-]?(?:body|content|text)?"[^>]*>([\s\S]*?)<\/div>/i,
  ];

  for (const pattern of classPatterns) {
    const match = html.match(pattern);
    if (match) {
      const text = htmlToText(match[1]);
      if (text.length >= MIN_USEFUL_LENGTH) return text;
    }
  }

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return htmlToText(bodyMatch[1]);

  return htmlToText(html);
}

function extractTitle(html: string): string | undefined {
  const ogMatch = html.match(
    /<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i
  );
  if (ogMatch?.[1]) return decodeEntities(ogMatch[1]).trim();

  const ogMatchAlt = html.match(
    /<meta[^>]*content="([^"]*)"[^>]*property="og:title"[^>]*>/i
  );
  if (ogMatchAlt?.[1]) return decodeEntities(ogMatchAlt[1]).trim();

  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (titleMatch?.[1]) return decodeEntities(titleMatch[1]).trim();

  return undefined;
}

// ── Strategy 1: Direct Fetch ──

async function fetchDirect(parsedUrl: URL): Promise<FetchResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    const response = await fetch(parsedUrl.toString(), {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
        "Cache-Control": "no-cache",
      },
      redirect: "follow",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { success: false, text: "", error: `HTTP ${response.status}` };
    }

    const html = await response.text();
    const title = extractTitle(html);
    const articleText = extractArticleContent(html);

    if (!articleText || articleText.length < MIN_USEFUL_LENGTH) {
      return { success: false, text: "", error: "direct-insufficient" };
    }

    const finalText =
      articleText.length > MAX_TEXT_LENGTH
        ? articleText.slice(0, MAX_TEXT_LENGTH) + "\n\n[Truncated]"
        : articleText;

    return { success: true, text: finalText, title };
  } catch (err) {
    const msg =
      err instanceof Error && err.name === "AbortError"
        ? "Timeout"
        : err instanceof Error
          ? err.message
          : "Unknown error";
    return { success: false, text: "", error: `direct: ${msg}` };
  }
}

// ── Strategy 2: Jina Reader API ──

function cleanJinaMarkdown(raw: string): {
  title: string | undefined;
  text: string;
} {
  const lines = raw.split("\n");
  let title: string | undefined;
  let contentStartIndex = 0;

  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    if (lines[i].startsWith("Title:")) {
      title = lines[i].replace("Title:", "").trim();
    }
    if (lines[i].startsWith("Markdown Content:")) {
      contentStartIndex = i + 1;
      break;
    }
  }

  const contentLines = lines.slice(contentStartIndex);

  const filtered = contentLines.filter((line) => {
    const trimmed = line.trim();
    if (!trimmed) return true;
    if (/^#{1,6}\s/.test(trimmed)) return true;
    if (trimmed.length > 60) return true;
    if (/^\[.*\]\(.*\)$/.test(trimmed) && trimmed.length < 60) return false;
    if (/^\*\s+\[.*\]\(.*\)$/.test(trimmed)) return false;
    return true;
  });

  const text = filtered
    .join("\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();

  return { title, text };
}

async function fetchViaJina(parsedUrl: URL): Promise<FetchResult> {
  try {
    const jinaUrl = `https://r.jina.ai/${parsedUrl.toString()}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), JINA_TIMEOUT);

    const response = await fetch(jinaUrl, {
      signal: controller.signal,
      headers: { Accept: "text/markdown" },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { success: false, text: "", error: `Jina HTTP ${response.status}` };
    }

    const raw = await response.text();
    if (!raw || raw.length < MIN_USEFUL_LENGTH) {
      return { success: false, text: "", error: "Jina empty" };
    }

    const { title, text } = cleanJinaMarkdown(raw);

    if (!text || text.length < MIN_USEFUL_LENGTH) {
      return { success: false, text: "", error: "Jina cleaned empty" };
    }

    const finalText =
      text.length > MAX_TEXT_LENGTH
        ? text.slice(0, MAX_TEXT_LENGTH) + "\n\n[Truncated]"
        : text;

    return { success: true, text: finalText, title };
  } catch (err) {
    const msg =
      err instanceof Error && err.name === "AbortError"
        ? "Jina timeout"
        : err instanceof Error
          ? err.message
          : "Unknown error";
    return { success: false, text: "", error: msg };
  }
}

// ── Helpers ──

function requireUseful(promise: Promise<FetchResult>): Promise<FetchResult> {
  return promise.then((r) => {
    if (r.success && r.text.length >= MIN_USEFUL_LENGTH) return r;
    return Promise.reject(r);
  });
}

// ── Main ──

export async function fetchSourceUrl(url: string): Promise<FetchResult> {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return { success: false, text: "", error: "Invalid URL protocol" };
    }
  } catch {
    return { success: false, text: "", error: "Invalid URL format" };
  }

  // Race both strategies — first success wins
  try {
    return await Promise.any([
      requireUseful(fetchDirect(parsedUrl)),
      requireUseful(fetchViaJina(parsedUrl)),
    ]);
  } catch {
    // Both failed
  }

  // Fallback: Jina partial result
  const jinaResult = await fetchViaJina(parsedUrl);
  if (jinaResult.text.length > 0) {
    return {
      success: true,
      text: jinaResult.text,
      title: jinaResult.title,
      error: "Partial content extracted",
    };
  }

  return {
    success: false,
    text: "",
    error: "Could not extract content — site may be bot-protected. Paste source text manually.",
  };
}
