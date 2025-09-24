import React from "react";
import Card from "../../components/Card";
import { formatDateISO } from "../../utils/format";
import { addDaysISO } from "../../utils/dates";

export default function TetanusPlan({ t, lang, decision, startDate }) {
  const tet = decision?.tetanus || { need: false, offsets: [] };

  const toneClass = tet.need
    ? "bg-red-50 border-red-200 text-red-900"
    : "bg-emerald-50 border-emerald-200 text-emerald-900";

  const dates = (tet.offsets || []).map((off) => addDaysISO(startDate, off));

  // เลือกข้อความอธิบายแผนด้วย i18n แทน tet.label ที่เป็นไทย
  // ถ้ามี tet.code จาก logic ให้ใช้ก่อน: "SERIES" | "BOOSTER" | "NONE"
  const planText = (() => {
    if (!tet.need) return t("labels.tetanusNone");
    if (tet.code === "SERIES") return t("labels.tetanusSeries");
    if (tet.code === "BOOSTER") return t("labels.tetanusBooster");

    // ไม่มี code ก็เดาจากจำนวนเข็ม
    const n = tet.offsets?.length || 0;
    if (n >= 3) return t("labels.tetanusSeries");
    if (n === 1) return t("labels.tetanusBooster");
    // กันพลาด
    return t("labels.tetanusPlan");
  })();

  return (
    <Card title={`💉 ${t("labels.tetanusPlan")}`}>
      <div className={`rounded-xl p-4 mb-3 border ${toneClass}`}>
        <p className="font-bold text-lg mb-2">
          {tet.need ? t("tetanus.needYes") : t("tetanus.needNo")}
        </p>

        <p className="text-sm font-medium">{planText}</p>

        {tet.need && startDate && dates.length > 0 && (
          <div className="rounded-2xl border p-4 bg-white/60 mt-3 text-sm">
            <p className="font-medium">{t("tetanus.apptTitle")}</p>
            <ul className="list-disc pl-5 mt-1">
              {dates.map((iso, i) => (
                <li key={i}>
                  {t("labels.doseLine", {
                    n: i + 1,
                    date: formatDateISO(iso, lang),
                  })}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
