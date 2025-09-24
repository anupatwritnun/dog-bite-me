// src/components/LanguageSelector.jsx
import { useI18n } from "../i18n";

const LABELS = { en: "EN", th: "ไทย", my: "မြန်" }; // extend later

export default function LanguageSelector() {
  const { lang, setLang } = useI18n();
  const opts = Object.keys(LABELS);
  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      className="border rounded px-2 py-1 text-sm"
      aria-label="Language"
    >
      {opts.map((l) => (
        <option key={l} value={l}>
          {LABELS[l]}
        </option>
      ))}
    </select>
  );
}
