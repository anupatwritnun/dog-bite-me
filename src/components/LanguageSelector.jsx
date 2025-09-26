import { useI18n, SUPPORTED_LOCALES } from "../i18n.jsx";

function LanguageSelect() {
  const { lang, setLang, getLangMeta } = useI18n();

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      className="border rounded-lg px-2 py-1"
    >
      {SUPPORTED_LOCALES.map((code) => {
        const { name, country, flag } = getLangMeta(code);
        return (
          <option key={code} value={code}>
            {flag} {name} {country ? `· ${country}` : ""}
          </option>
        );
      })}
    </select>
  );
}
