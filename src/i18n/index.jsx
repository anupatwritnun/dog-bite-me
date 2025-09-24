// src/i18n/index.jsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Load all JSONs in /lang
const modules = import.meta.glob("./lang/*.json", { eager: true });
const DICTS = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => {
    const code = path.match(/\/(\w+)\.json$/)[1]; // "en","th","my",...
    return [code, mod.default];
  })
);

export const SUPPORTED_LOCALES = Object.keys(DICTS);

function normalizeLocale(code) {
  if (!code) return "en";
  const base = String(code).toLowerCase().split("-")[0];
  return SUPPORTED_LOCALES.includes(base) ? base : "en";
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
  return Object.entries(vars).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, String(v)), str);
}

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const urlLang = new URLSearchParams(window.location.search).get("lang");
  const initial = normalizeLocale(urlLang || localStorage.getItem("locale") || navigator.language);
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
      if (import.meta.env.DEV && out === key) console.warn(`[i18n] Missing key: ${key} (lang=${lang})`);
      return out;
    },
    [tBase, lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

// keep your helper
export function mapOptions(ids, baseKey, t) {
  return ids.map((id) => ({ id, label: t(`${baseKey}.${id}`) }));
}
