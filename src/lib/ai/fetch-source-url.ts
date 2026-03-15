/**
 * Fetches a URL and extracts clean article text from HTML.
 * Uses native fetch() + regex-based HTML parsing — zero dependencies.
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

const FETCH_TIMEOUT = 7_000; // Vercel hobby has 10s limit — keep under
const MAX_TEXT_LENGTH = 80_000;
const MIN_USEFUL_LENGTH = 100;

/** Tags whose content should be removed entirely */
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

/** Remove tags AND their inner content */
function stripTagsWithContent(html: string): string {
  let result = html;
  for (const tag of STRIP_CONTENT_TAGS) {
    // Handle both self-closing and paired tags
    result = result.replace(
      new RegExp(`<${tag}[\\s>][\\s\\S]*?</${tag}>`, "gi"),
      " "
    );
    result = result.replace(new RegExp(`<${tag}[^>]*/?>`, "gi"), " ");
  }
  return result;
}

/** Convert block-level elements to newlines, then strip remaining tags */
function tagsToText(html: string): string {
  let text = html;

  // Block elements → double newline
  text = text.replace(
    /<\/?(p|div|section|article|blockquote|h[1-6]|ul|ol|dl|table|tr|pre|hr)[^>]*>/gi,
    "\n\n"
  );

  // Inline breaks
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/?(li|dt|dd|td|th)[^>]*>/gi, "\n");

  // Strip remaining HTML tags
  text = text.replace(/<[^>]+>/g, " ");

  return text;
}

/** Decode common HTML entities */
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

/** Collapse whitespace into a readable format */
function cleanWhitespace(text: string): string {
  return text
    .replace(/[ \t]+/g, " ") // horizontal whitespace → single space
    .replace(/\n[ \t]+/g, "\n") // trim leading spaces on each line
    .replace(/[ \t]+\n/g, "\n") // trim trailing spaces on each line
    .replace(/\n{3,}/g, "\n\n") // max two consecutive newlines
    .trim();
}

/** Full pipeline: HTML string → clean text */
function htmlToText(html: string): string {
  const cleaned = stripTagsWithContent(html);
  const asText = tagsToText(cleaned);
  const decoded = decodeEntities(asText);
  return cleanWhitespace(decoded);
}

// ── Content extraction strategies ──

/** Try to extract content from common article containers */
function extractArticleContent(html: string): string {
  // Strategy 1: <article> tag (most news sites)
  const articleMatch = html.match(
    /<article[^>]*>([\s\S]*?)<\/article>/i
  );
  if (articleMatch) {
    const text = htmlToText(articleMatch[1]);
    if (text.length >= MIN_USEFUL_LENGTH) return text;
  }

  // Strategy 2: [role="main"] or <main>
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) {
    const text = htmlToText(mainMatch[1]);
    if (text.length >= MIN_USEFUL_LENGTH) return text;
  }

  // Strategy 3: Common content class patterns
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

  // Strategy 4: Fallback to <body>
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    return htmlToText(bodyMatch[1]);
  }

  // Last resort: process entire input
  return htmlToText(html);
}

/** Extract page title from meta tags or <title> */
function extractTitle(html: string): string | undefined {
  // og:title (most reliable for articles)
  const ogMatch = html.match(
    /<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i
  );
  if (ogMatch?.[1]) return decodeEntities(ogMatch[1]).trim();

  // Reverse attribute order (content before property)
  const ogMatchAlt = html.match(
    /<meta[^>]*content="([^"]*)"[^>]*property="og:title"[^>]*>/i
  );
  if (ogMatchAlt?.[1]) return decodeEntities(ogMatchAlt[1]).trim();

  // <title> tag
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (titleMatch?.[1]) return decodeEntities(titleMatch[1]).trim();

  return undefined;
}

/** Extract meta description */
function extractDescription(html: string): string | undefined {
  const ogDesc = html.match(
    /<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i
  );
  if (ogDesc?.[1]) return decodeEntities(ogDesc[1]).trim();

  const ogDescAlt = html.match(
    /<meta[^>]*content="([^"]*)"[^>]*property="og:description"[^>]*>/i
  );
  if (ogDescAlt?.[1]) return decodeEntities(ogDescAlt[1]).trim();

  const metaDesc = html.match(
    /<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i
  );
  if (metaDesc?.[1]) return decodeEntities(metaDesc[1]).trim();

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
      return {
        success: false,
        text: "",
        error: `HTTP ${response.status}: Sayfa yüklenemedi`,
      };
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml+xml") &&
      !contentType.includes("text/plain")
    ) {
      return {
        success: false,
        text: "",
        error: `Desteklenmeyen içerik türü: ${contentType.split(";")[0]}`,
      };
    }

    const html = await response.text();
    const title = extractTitle(html);
    const description = extractDescription(html);
    const articleText = extractArticleContent(html);

    // Build final text with metadata context
    const parts: string[] = [];
    if (title) parts.push(`Başlık: ${title}`);
    if (description) parts.push(`Açıklama: ${description}`);
    if (articleText) parts.push(`\nİçerik:\n${articleText}`);

    const fullText = parts.join("\n");

    if (!articleText || articleText.length < MIN_USEFUL_LENGTH) {
      return {
        success: false,
        text: fullText,
        title,
        error: "direct-insufficient",
      };
    }

    // Truncate very long content
    const finalText =
      fullText.length > MAX_TEXT_LENGTH
        ? fullText.slice(0, MAX_TEXT_LENGTH) + "\n\n[İçerik kısaltıldı]"
        : fullText;

    return { success: true, text: finalText, title };
  } catch (err) {
    const msg =
      err instanceof Error && err.name === "AbortError"
        ? "Zaman aşımı"
        : err instanceof Error
          ? err.message
          : "Bilinmeyen hata";
    return { success: false, text: "", error: `direct-fail: ${msg}` };
  }
}

// ── Strategy 2: Jina Reader API (handles JS rendering, paywalls) ──

const JINA_TIMEOUT = 8_000; // Vercel hobby has 10s limit — keep under

/** Light cleaning of Jina markdown — keep article content, strip only obvious noise */
function cleanJinaMarkdown(raw: string): {
  title: string | undefined;
  text: string;
} {
  const lines = raw.split("\n");

  // Extract metadata from Jina headers
  let title: string | undefined;
  let contentStartIndex = 0;

  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = lines[i];
    if (line.startsWith("Title:")) {
      title = line.replace("Title:", "").trim();
    }
    if (line.startsWith("Markdown Content:")) {
      contentStartIndex = i + 1;
      break;
    }
  }

  // Work with content after Jina metadata headers
  const contentLines = lines.slice(contentStartIndex);

  // Light filter: remove lines that are clearly navigation/menu noise
  const filtered = contentLines.filter((line) => {
    const trimmed = line.trim();

    // Keep empty lines (paragraph separation)
    if (!trimmed) return true;

    // Keep headings (article structure)
    if (/^#{1,6}\s/.test(trimmed)) return true;
    if (/^=+$/.test(trimmed) || /^-+$/.test(trimmed)) return true;

    // Keep substantial lines (likely article content)
    if (trimmed.length > 60) return true;

    // Remove pure navigation links: lines that are ONLY a markdown link
    if (/^\[.*\]\(.*\)$/.test(trimmed) && trimmed.length < 60) return false;

    // Remove bullet-only navigation (short list items that are just links)
    if (/^\*\s+\[.*\]\(.*\)$/.test(trimmed)) return false;

    // Keep everything else — GPT-4o can handle noise
    return true;
  });

  // Strip obvious footer sections
  let endIdx = filtered.length;
  for (let i = filtered.length - 1; i > 0; i--) {
    const lower = filtered[i].trim().toLowerCase();
    if (
      lower.includes("terms of service") ||
      lower.includes("privacy policy") ||
      lower.includes("© 20") ||
      lower.includes("cookie preferences")
    ) {
      endIdx = i;
      break;
    }
  }

  const text = filtered
    .slice(0, endIdx)
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
      headers: {
        Accept: "text/markdown",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        text: "",
        error: `Jina HTTP ${response.status}`,
      };
    }

    const raw = await response.text();

    if (!raw || raw.length < MIN_USEFUL_LENGTH) {
      return {
        success: false,
        text: "",
        error: "Jina Reader da içerik çıkaramadı",
      };
    }

    const { title, text } = cleanJinaMarkdown(raw);

    if (!text || text.length < MIN_USEFUL_LENGTH) {
      return {
        success: false,
        text: "",
        error: "Jina Reader'dan içerik temizlenemedi",
      };
    }

    const finalText =
      text.length > MAX_TEXT_LENGTH
        ? text.slice(0, MAX_TEXT_LENGTH) + "\n\n[İçerik kısaltıldı]"
        : text;

    return { success: true, text: finalText, title };
  } catch (err) {
    const msg =
      err instanceof Error && err.name === "AbortError"
        ? "Jina zaman aşımı"
        : err instanceof Error
          ? err.message
          : "Bilinmeyen hata";
    return { success: false, text: "", error: msg };
  }
}

// ── Helpers ──

/** Wraps a fetch result into a Promise that rejects if content is insufficient */
function requireUseful(promise: Promise<FetchResult>): Promise<FetchResult> {
  return promise.then((r) => {
    if (r.success && r.text.length >= MIN_USEFUL_LENGTH) return r;
    return Promise.reject(r);
  });
}

// ── Main Function (parallel race) ──

export async function fetchSourceUrl(url: string): Promise<FetchResult> {
  // Validate URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return { success: false, text: "", error: "Geçersiz URL protokolü" };
    }
  } catch {
    return { success: false, text: "", error: "Geçersiz URL formatı" };
  }

  // Race both strategies in parallel — first successful one wins
  try {
    const result = await Promise.any([
      requireUseful(fetchDirect(parsedUrl)),
      requireUseful(fetchViaJina(parsedUrl)),
    ]);
    return result;
  } catch {
    // Both failed — try to return best partial result
  }

  // Fallback: run Jina alone (it's more reliable for news sites)
  const jinaResult = await fetchViaJina(parsedUrl);
  if (jinaResult.text.length > 0) {
    return {
      success: true,
      text: jinaResult.text,
      title: jinaResult.title,
      error:
        "Sayfa içeriği kısmen çıkarıldı — kaynak metni kontrol edin.",
    };
  }

  return {
    success: false,
    text: "",
    error:
      "İçerik çıkarılamadı — sayfa bot korumalı veya paywall arkasında olabilir. Kaynak metni manuel yapıştırın.",
  };
}
