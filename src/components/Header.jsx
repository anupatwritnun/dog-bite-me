import React from "react";
import { useI18n } from "../i18n.jsx";
import ShareBar from "./ShareBar.jsx";

export default function Header() {
  const { t, lang, setLang } = useI18n();

  return (
    <header className="w-full pt-8 pb-6">
      {/* language selector top-right */}
      <div className="flex items-start justify-end">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="border rounded-xl px-3 py-1.5 text-sm bg-white shadow-sm"
          title={t("ui.language")}
        >
          <option value="th">{t("ui.thai")}</option>
          <option value="en">{t("ui.english")}</option>
          <option value="vi">{t("ui.vietnamese")}</option>
          <option value="km">{t("ui.khmer")}</option>
          <option value="lo">{t("ui.lao")}</option>
          <option value="my">{t("ui.myanmar")}</option>
           <option value="ja">{t("ui.japanese")}</option>
           <option value="ch">{t("ui.chinese")}</option>
        </select>
      </div>

      {/* center title + subtitle */}
      <div className="mt-2 text-center">
        <div className="inline-flex items-center gap-3">
          <span className="text-4xl">🐶</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Dog Bite Me!
          </h1>
        </div>

        <p className="mt-2 text-slate-600">
          {t("header.subtitle") ||
            "ช่วยประเมินความเสี่ยง วางแผนวัคซีน และขั้นตอนดูแลเมื่อถูกสัตว์กัด/ข่วน"}
        </p>

        {/* share bar */}
        <div className="mt-4 flex justify-center">
          <ShareBar />
        </div>
      </div>
    </header>
  );
}
