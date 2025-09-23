// src/features/summary/HospitalSummary.jsx
import React, { useState, useEffect, useCallback } from "react";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import KeyRow from "../../components/KeyRow";
import { formatDateISO } from "../../utils/format";
import { printElementById } from "../../utils/print";

// ใช้ซ้ำทั้งในการ์ดและในโมดัล เพื่อไม่ต้องเขียนสองรอบ
function SummaryContent({
  t, lang,
  exposureCat, animalType, exposureDate, priorVaccination, immunocompromised,
  PRIOR_VAC, decision, regimenChoice, startDate, scheduleDates,
  containerId = "hospital-summary",
}) {
  return (
    <div id={containerId} className="rounded-2xl border bg-white p-5 sm:p-6">
      <div className="grid gap-4">
        <KeyRow
          k={t("fields.group", { n: "" }).replace("{n}", "").trim() || t("fields.group", { n: "" })}
          v={
            <Badge tone={exposureCat === "1" ? "green" : exposureCat === "2" ? "yellow" : "red"}>
              {t("fields.group", { n: exposureCat || "-" })}
            </Badge>
          }
        />
        <KeyRow k={t("fields.animalType")} v={t(`animals.${animalType}`)} />
        {exposureDate && <KeyRow k={t("fields.exposureDate")} v={formatDateISO(exposureDate, lang)} />}
        <KeyRow
          k={t("fields.priorVac")}
          v={PRIOR_VAC.find((p) => p.id === priorVaccination)?.label || "-"}
        />
        <KeyRow
          k={t("fields.immunocomp")}
          v={immunocompromised ? t("labels.immunocompYes") : t("labels.immunocompNo")}
        />
        {decision.needPEP && exposureCat !== "1" && (
          <>
            <KeyRow k={t("labels.plan")} v={decision.regimen?.label || regimenChoice?.label} />
            <KeyRow k="RIG" v={decision.needRIG ? t("messages.rigYes") : t("messages.rigNo")} />
            {startDate && (
              <KeyRow
                k={t("fields.realAppt", { date: "" }).replace("(start )", "").trim()}
                v={<span>{scheduleDates.map((s) => formatDateISO(s, lang)).join(", ")}</span>}
              />
            )}
          </>
        )}
        {exposureCat === "1" && <KeyRow k={t("labels.plan")} v={t("messages.cat1NoPEP")} />}
      </div>
    </div>
  );
}

export default function HospitalSummary({
  t, lang,
  exposureCat, animalType, exposureDate, priorVaccination, immunocompromised,
  PRIOR_VAC, decision, regimenChoice, startDate, scheduleDates, summaryText
}) {
  const [open, setOpen] = useState(false);

  // ปิดด้วย Esc
  const onKey = useCallback((e) => {
    if (e.key === "Escape") setOpen(false);
  }, []);
  useEffect(() => {
    if (!open) return;
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onKey]);

  return (
    <>
      <Card title={t("sections.hospSummary")} icon="📄">
        {/* เวอร์ชันการ์ดปกติ */}
        <SummaryContent
          t={t} lang={lang}
          exposureCat={exposureCat}
          animalType={animalType}
          exposureDate={exposureDate}
          priorVaccination={priorVaccination}
          immunocompromised={immunocompromised}
          PRIOR_VAC={PRIOR_VAC}
          decision={decision}
          regimenChoice={regimenChoice}
          startDate={startDate}
          scheduleDates={scheduleDates}
          containerId="hospital-summary"
        />

        {/* แถบปุ่ม: ไม่มี “บันทึกเป็นรูป” แล้ว, เพิ่ม “ขยาย” */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            className="px-4 py-2 rounded-xl bg-slate-900 text-white"
            onClick={() => navigator.clipboard.writeText(summaryText)}
          >
            {t("ui.copy")}
          </button>

          <button
            className="px-4 py-2 rounded-xl bg-rabies-600 hover:bg-rabies-700 text-white"
            onClick={() => printElementById("hospital-summary", t("sections.hospSummary"))}
            title="พิมพ์หรือบันทึกเป็น PDF"
          >
            🖨️ พิมพ์/บันทึกเป็น PDF
          </button>

          <button
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300"
            onClick={() => setOpen(true)}
            title="ขยายดูเต็มจอ"
          >
            🔎 ขยาย
          </button>
        </div>
      </Card>

      {/* Modal เต็มจอ */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-5xl max-h-[90vh] overflow-auto bg-white rounded-2xl shadow-2xl">
            {/* หัวโมดัล */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 sm:px-6 py-3 border-b bg-white/95 backdrop-blur">
              <h3 className="text-lg font-semibold text-slate-900">{t("sections.hospSummary")}</h3>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm"
                  onClick={() => printElementById("hospital-summary-full", t("sections.hospSummary"))}
                >
                  🖨️ พิมพ์/บันทึก PDF
                </button>
                <button
                  className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-sm"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  ✕ ปิด
                </button>
              </div>
            </div>

            {/* เนื้อหา: สรุปแบบใหญ่ เต็มจอ */}
            <div className="p-5 sm:p-6">
              <SummaryContent
                t={t} lang={lang}
                exposureCat={exposureCat}
                animalType={animalType}
                exposureDate={exposureDate}
                priorVaccination={priorVaccination}
                immunocompromised={immunocompromised}
                PRIOR_VAC={PRIOR_VAC}
                decision={decision}
                regimenChoice={regimenChoice}
                startDate={startDate}
                scheduleDates={scheduleDates}
                containerId="hospital-summary-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
