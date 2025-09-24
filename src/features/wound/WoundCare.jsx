import React from "react";
import Card from "../../components/Card";
import woundImgTh from "../../assets/woundcare.jpg";
import woundImgEn from "../../assets/woundcare_eng.jpg";

export default function WoundCare({ t, lang }) {
  // ถ้าไม่ใช่ภาษาไทย ใช้รูปภาษาอังกฤษ
  const woundImg = lang === "th" ? woundImgTh : woundImgEn;

  return (
    <Card title={t("sections.washTitle")} icon="🩹" tone="info">
      <div className="text-sm space-y-3 bg-sky-50 border border-sky-200 rounded-xl p-4 text-sky-900">
        <p>{t("wound.text")}</p>

        <div className="mt-3">
          <img
            src={woundImg}
            alt={t("sections.washTitle")}
            className="w-full max-h-[460px] object-cover rounded-xl border border-sky-200 shadow-sm"
            loading="lazy"
          />
        </div>

        <div className="flex gap-2">
          <a
            href={woundImg}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-white border text-sm"
          >
            {t("wound.openFull")} ↗
          </a>
          <a
            href={woundImg}
            download
            className="px-3 py-1.5 rounded-lg bg-white border text-sm"
          >
            {t("wound.download")}
          </a>
        </div>
      </div>
    </Card>
  );
}
