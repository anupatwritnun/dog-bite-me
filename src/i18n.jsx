import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// ------------ load JSON dicts ------------
const modules = import.meta.glob("./i18n/lang/*.json", { eager: true });
const DICTS = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => {
    const code = path.match(/\/(\w+)\.json$/)[1]; // "en","th","my",...
    return [code, mod.default];
  })
);

export const SUPPORTED_LOCALES = Object.keys(DICTS);

// ------------ keep old option IDs ------------
export const EXPO_IDS = ["1", "2", "3"];
export const OBS_IDS = ["yes", "no", "unknown"];
export const PRIOR_IDS = ["never", "<=6m", ">6m"];
export const TETANUS_DOSE_IDS = ["0", "1", "2", "3"];
export const TETANUS_RECENT_IDS = ["<=5y", ">5y"];

// ------------ helpers ------------
function normalizeLocale(code) {
  if (!code) return "en";
  const base = String(code).toLowerCase().split("-")[0];
  return SUPPORTED_LOCALES.includes(base) ? base : "th";
}

function deepGet(obj, path) {
  const parts = path.split(".");
  let cur = obj;
  for (const k of parts) {
    if (cur && typeof cur === "object" && k in cur) cur = cur[k];
    else return undefined;
  }
  return typeof cur === "string" ? cur : undefined;
}

function interpolate(str, vars) {
  if (!vars || typeof str !== "string") return str;
  return Object.entries(vars).reduce(
    (s, [k, v]) => s.replaceAll(`{${k}}`, String(v)),
    str
  );
}

// keep your existing helper signature
export function mapOptions(ids, baseKey, t) {
  return ids.map((id) => ({ id, label: t(`${baseKey}.${id}`) }));
}

// ------------ context ------------
const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const urlLang = new URLSearchParams(window.location.search).get("lang");
  const initial = normalizeLocale(
    urlLang || localStorage.getItem("locale") || navigator.language
  );
  const [lang, setLang] = useState(initial);

  useEffect(() => {
    localStorage.setItem("locale", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const dict = useMemo(() => DICTS[lang] || DICTS.en, [lang]);

  const tBase = useCallback(
    (key, vars) => {
      const raw = deepGet(dict, key) ?? deepGet(DICTS.en, key) ?? key;
      return interpolate(raw, vars);
    },
    [dict]
  );

  const t = useCallback(
    (key, vars) => {
      const out = tBase(key, vars);
      if (import.meta.env.DEV && out === key) {
        console.warn(`[i18n] Missing key: ${key} (lang=${lang})`);
      }
      return out;
    },
    [tBase, lang]
  );

  // -------- language meta helper --------
  const getLangMeta = useCallback(
    (code) => {
      const key = `common.languages.${code}`;
      const name = deepGet(dict, `${key}.name`) ?? code;
      const country = deepGet(dict, `${key}.country`) ?? "";
      const flag = deepGet(dict, `${key}.flag`) ?? "🌐";
      return { code, name, country, flag };
    },
    [dict]
  );

  const value = useMemo(
    () => ({ lang, setLang, t, getLangMeta }),
    [lang, t, getLangMeta]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
