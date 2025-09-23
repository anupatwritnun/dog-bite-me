// Map UI lang codes to BCP-47 locales
const localeMap = {
  th: "th-TH",
  en: "en-US",
  vi: "vi-VN",
  km: "km-KH",
  lo: "lo-LA",
  my: "my-MM",
};

/**
 * Format an ISO date string using the UI language.
 * @param {string} iso - e.g., "2025-09-23"
 * @param {string} lang - "th" | "en" | "vi" | "km" | "lo" | "my"
 * @param {{ buddhist?: boolean } & Intl.DateTimeFormatOptions} opts
 * @returns {string}
 */
export function formatDateISO(iso, lang, opts = {}) {
  if (!iso) return "";
  const d = new Date(iso);
  // Optional Buddhist Era for Thai if you really want 2568 to appear
  const locale =
    lang === "th" && opts.buddhist
      ? "th-TH-u-ca-buddhist"
      : localeMap[lang] || "en-US";

  const { buddhist, ...fmt } = opts;
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...fmt,
  };
  return new Intl.DateTimeFormat(locale, options).format(d);
}
