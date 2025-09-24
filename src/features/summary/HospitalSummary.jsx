import React, { useState, useRef, useMemo, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import Card from "../../components/Card";
import KeyRow from "../../components/KeyRow";
import { formatDateISO } from "../../utils/format";
import { addDaysISO } from "../../utils/dates";

function Pill({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-emerald-50 text-emerald-800 border-emerald-200",
    amber: "bg-amber-50 text-amber-900 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-xs ${tones[tone] || tones.slate}`}>
      {children}
    </span>
  );
}

function buildPrettyText({
  t, lang, exposureCat, animalType, exposureDate,
  priorLabel, immunocompromised, rabiesDates,
  tetDoseLabel, tetRecentLabel, tetDates, decision, startDate
}) {
  const d = (iso) => formatDateISO(iso, lang);
  const lines = [];

  lines.push(`สรุปแผนการรักษา`);
  lines.push(`==================`);
  lines.push(`• กลุ่ม: ${t("fields.group", { n: exposureCat || "-" })}`);
  lines.push(`• ชนิดสัตว์: ${t(`animals.${animalType}`)}`);
  if (exposureDate) lines.push(`• วันถูกกัด/ข่วน: ${d(exposureDate)}`);
  lines.push(`• ประวัติ PEP: ${priorLabel}`);
  lines.push(`• ภูมิคุ้มกันบกพร่อง: ${immunocompromised ? t("labels.immunocompYes") : t("labels.immunocompNo")}`);

  lines.push(``);
  lines.push(`วัคซีนพิษสุนัขบ้า`);
  lines.push(`----------------`);
  if (exposureCat === "1") {
    lines.push(`- ${t("messages.cat1NoPEP")}`);
  } else {
    lines.push(`- แผน: ${decision.regimen?.label || "-"}`);
    lines.push(`- RIG: ${decision.needRIG ? t("messages.rigYes") : t("messages.rigNo")}`);
    if (startDate && rabiesDates.length) {
      lines.push(`- นัด (เริ่ม ${d(startDate)}):`);
      rabiesDates.forEach((x, i) => lines.push(`   • เข็มที่ ${i + 1}: ${d(x)}`));
    }
    if (decision.stopNote) lines.push(`- หมายเหตุ: ${decision.stopNote}`);
  }

  lines.push(``);
  lines.push(`วัคซีนบาดทะยัก`);
  lines.push(`--------------`);
  lines.push(`- ประวัติ: ${tetDoseLabel}${tetRecentLabel && tetRecentLabel !== "-" ? ` • ${tetRecentLabel}` : ""}`);
  if (decision.tetanus?.need) {
    lines.push(`- แผน: ${decision.tetanus.label}`);
    if (startDate && tetDates.length) {
      lines.push(`- นัด:`);
      tetDates.forEach((x, i) => lines.push(`   • เข็มที่ ${i + 1}: ${d(x)}`));
    }
  } else {
    lines.push(`- ${decision.tetanus?.label || t("labels.tetanusNone")}`);
  }

  return lines.join("\n");
}

export default function HospitalSummary({
  t, lang,
  exposureCat, animalType, exposureDate,
  priorVaccination, immunocompromised,
  PRIOR_VAC,
  TETANUS_OPTS, TETANUS_RECENT_OPTS,
  tetanusDoses, tetanusRecent,
  decision, startDate, scheduleDates, summaryText,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null); // {text: string}

  // labels
  const priorLabel = PRIOR_VAC.find((p) => p.id === priorVaccination)?.label || "-";
  const tetDoseLabel = TETANUS_OPTS.find((o) => o.id === tetanusDoses)?.label || "-";
  const tetRecentLabel = tetanusRecent
    ? TETANUS_RECENT_OPTS.find((o) => o.id === tetanusRecent)?.label || "-"
    : "-";

  // schedules
  const rabiesDates = scheduleDates || [];
  const tetDates = (decision.tetanus?.offsets || []).map((d) => addDaysISO(startDate, d));

  const prettyText = useMemo(
    () =>
      buildPrettyText({
        t, lang, exposureCat, animalType, exposureDate,
        priorLabel, immunocompromised, rabiesDates,
        tetDoseLabel, tetRecentLabel, tetDates, decision, startDate
      }),
    [
      t, lang, exposureCat, animalType, exposureDate,
      priorLabel, immunocompromised, rabiesDates,
      tetDoseLabel, tetRecentLabel, tetDates, decision, startDate
    ]
  );

  // กล่องที่ใช้สั่งพิมพ์ (จะพิมพ์เฉพาะ pre นี้)
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "สรุปแผนการรักษา",
    pageStyle: `
      @page { margin: 16mm; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      pre { font-size: 14px; line-height: 1.7; }
    `,
    // ให้โมดัลยังเปิดอยู่ระหว่างโชว์ dialog
    removeAfterPrint: false,
  });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prettyText);
      setToast({ text: "คัดลอกแล้ว" });
    } catch {
      const ta = document.createElement("textarea");
      ta.value = prettyText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setToast({ text: "คัดลอกแล้ว" });
    }
  };

  // ซ่อน toast อัตโนมัติ
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 1600);
    return () => clearTimeout(id);
  }, [toast]);

  const CardStructured = () => (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">🦠 {t("sections.planTitle")}</h3>
          {exposureCat && (
            <Pill tone={exposureCat === "1" ? "green" : exposureCat === "2" ? "amber" : "red"}>
              {t("fields.group", { n: exposureCat })}
            </Pill>
          )}
        </div>
        <KeyRow label={t("fields.animalType")} value={t(`animals.${animalType}`)} />
        {exposureDate && <KeyRow label={t("fields.exposureDate")} value={formatDateISO(exposureDate, lang)} />}
        <KeyRow label={t("fields.priorVac")} value={priorLabel} />
        <KeyRow label={t("fields.immunocomp")} value={immunocompromised ? t("labels.immunocompYes") : t("labels.immunocompNo")} />

        {exposureCat === "1" ? (
          <div className="mt-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm">
            {t("messages.cat1NoPEP")}
          </div>
        ) : (
          <>
            <p className="text-sm"><span className="font-medium">{t("labels.plan")}:</span> {decision.regimen?.label || "-"}</p>
            <p className="text-sm"><span className="font-medium">{t("labels.rig")}:</span> {decision.needRIG ? t("messages.rigYes") : t("messages.rigNo")}</p>
            {startDate && rabiesDates.length > 0 && (
              <ul className="list-disc ml-5 text-sm mt-1">
                {rabiesDates.map((d, i) => (
                  <li key={i}>{`พิษสุนัขบ้า เข็มที่ ${i + 1} — ${formatDateISO(d, lang)}`}</li>
                ))}
              </ul>
            )}
            {decision.stopNote && <div className="text-xs text-gray-600 mt-2">{decision.stopNote}</div>}
          </>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">💉 {t("sections.tetanusTitle")}</h3>
          <Pill>{tetDoseLabel}</Pill>
          {tetanusRecent && tetRecentLabel !== "-" && <Pill tone="amber">{tetRecentLabel}</Pill>}
        </div>
        {decision.tetanus?.need ? (
          <ul className="list-disc ml-5 text-sm mt-1">
            {tetDates.map((d, i) => (
              <li key={i}>{`บาดทะยัก เข็มที่ ${i + 1} — ${formatDateISO(d, lang)}`}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm mt-1">{decision.tetanus?.label || t("labels.tetanusNone")}</p>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Card view */}
      <Card title={t("sections.hospSummary")} icon="🧾">
        <CardStructured />
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
          >
            ขยายเพื่อดูและพิมพ์ ↗️
          </button>
        </div>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex flex-wrap gap-3 justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">สรุปแผนการรักษา</h2>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                >
                  คัดลอกข้อความ
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  พิมพ์ 🖨️
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  ปิด
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-y-auto">
              <div className="min-h-[300px]">
                <div className="border rounded-xl p-4 shadow-sm">
                  <CardStructured />
                </div>
              </div>

              <div className="min-h-[300px] relative">
                {/* ปุ่มคัดลอกซ้ำที่ลอยบนกล่อง */}
                <button
                  onClick={copyToClipboard}
                  className="absolute top-3 right-3 px-2.5 py-1 text-xs bg-white/80 backdrop-blur border border-slate-200 rounded-md hover:bg-white shadow-sm"
                  aria-label="คัดลอกข้อความ"
                >
                  คัดลอก
                </button>

                <pre
                  ref={printRef}
                  className="w-full h-[520px] lg:h-[560px] overflow-auto rounded-2xl p-5 shadow-inner
                             bg-gradient-to-br from-slate-50 via-white to-slate-50
                             border border-slate-200
                             text-[15px] leading-7 font-mono whitespace-pre-wrap text-slate-800"
                >
{prettyText}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60]">
          <div className="px-4 py-2 rounded-full shadow-lg bg-slate-900 text-white text-sm">
            {toast.text}
          </div>
        </div>
      )}
    </>
  );
}
