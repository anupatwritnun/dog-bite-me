import React, { useState, useRef, useMemo, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import Card from "../../components/Card";
import KeyRow from "../../components/KeyRow";
import { formatDateISO } from "../../utils/format";
import { addDaysISO } from "../../utils/dates";

// สร้างข้อความแผน tetanus จาก i18n (ใช้ code ถ้ามี ไม่งั้นเดาจากจำนวนเข็ม)
function tetanusPlanText(t, tet) {
  if (!tet?.need) return t("labels.tetanusNone");
  if (tet.code === "SERIES") return t("labels.tetanusSeries");
  if (tet.code === "BOOSTER") return t("labels.tetanusBooster");
  const n = tet?.offsets?.length || 0;
  if (n >= 3) return t("labels.tetanusSeries");
  if (n === 1) return t("labels.tetanusBooster");
  return t("labels.tetanusPlan");
}

// แปลง regimen object -> label ตามภาษา (ไม่ใช้ r.label ที่เป็นไทย)
function labelForRegimen(t, regimen) {
  if (!regimen) return "-";
  const days = (regimen.days || []).join(",");
  return t(`plan.regimens.${regimen.id}`, { days });
}

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

// ---------- pretty text (สำหรับคัดลอก/พิมพ์) ----------
function buildPrettyText({
  t, lang, exposureCat, animalType, exposureDate,
  priorLabel, immunocompromised, rabiesDates,
  tetDoseLabel, tetRecentLabel, tetDates, decision, startDate
}) {
  const d = (iso) => formatDateISO(iso, lang);
  const safeLen = (x) => String(x ?? "").length; // กันพังถ้า key หาย
  const lines = [];

  const hospTitle = t("sections.hospSummary");
  lines.push(hospTitle);
  lines.push("=".repeat(safeLen(hospTitle)));

  lines.push(`• ${t("fields.group", { n: exposureCat || "-" })}`);
  lines.push(`• ${t("fields.animalType")}: ${t(`animals.${animalType}`)}`);
  if (exposureDate) lines.push(`• ${t("fields.exposureDate")}: ${d(exposureDate)}`);
  lines.push(`• ${t("fields.priorVac")}: ${priorLabel}`);
  lines.push(`• ${t("fields.immunocomp")}: ${immunocompromised ? t("labels.immunocompYes") : t("labels.immunocompNo")}`);

  lines.push("");
  const planTitle = t("sections.planTitle");
  lines.push(planTitle);
  lines.push("-".repeat(safeLen(planTitle)));

  if (exposureCat === "1") {
    lines.push(`- ${t("messages.cat1NoPEP")}`);
  } else {
    lines.push(`- ${t("labels.plan")}: ${labelForRegimen(t, decision.regimen || decision.suggestedRegimen)}`);
    lines.push(`- ${t("labels.rig")}: ${decision.needRIG ? t("messages.rigYes") : t("messages.rigNo")}`);
    if (startDate && rabiesDates.length) {
      lines.push(`- ${t("labels.realAppt", { date: d(startDate) })}`);
      rabiesDates.forEach((x, i) =>
        lines.push(`   • ${t("labels.doseLine", { n: i + 1, date: d(x) })}`)
      );
    }
    if (decision.stopNote) lines.push(`- ${t("messages.stopIfObs10d")}`);
  }

  lines.push("");
  const tetTitle = t("labels.tetanusPlan");
  lines.push(tetTitle);
  lines.push("-".repeat(safeLen(tetTitle)));

  lines.push(
    `- ${t("fields.tetanusDoses")}: ${tetDoseLabel}${
      tetRecentLabel && tetRecentLabel !== "-" ? ` • ${tetRecentLabel}` : ""
    }`
  );

  if (decision.tetanus?.need) {
    lines.push(`- ${tetanusPlanText(t, decision.tetanus)}`);
    if (startDate && tetDates.length) {
      lines.push(`- ${t("tetanus.apptTitle")}`);
      tetDates.forEach((x, i) =>
        lines.push(`   • ${t("labels.doseLine", { n: i + 1, date: d(x) })}`)
      );
    }
  } else {
    lines.push(`- ${tetanusPlanText(t, decision.tetanus)}`);
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

  // labels (แปลแล้ว มาจาก useOptions)
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

  // พิมพ์เฉพาะ <pre>
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: t("sections.hospSummary"),
    pageStyle: `
      @page { margin: 16mm; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      pre { font-size: 14px; line-height: 1.7; }
    `,
  });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prettyText);
      setToast({ text: t("ui.copy") });
    } catch {
      const ta = document.createElement("textarea");
      ta.value = prettyText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setToast({ text: t("ui.copy") });
    }
  };

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
        <KeyRow
          label={t("fields.immunocomp")}
          value={immunocompromised ? t("labels.immunocompYes") : t("labels.immunocompNo")}
        />

        {exposureCat === "1" ? (
          <div className="mt-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm">
            {t("messages.cat1NoPEP")}
          </div>
        ) : (
          <>
            <p className="text-sm">
              <span className="font-medium">{t("labels.plan")}:</span>{" "}
              {labelForRegimen(t, decision.regimen || decision.suggestedRegimen)}
            </p>
            <p className="text-sm">
              <span className="font-medium">{t("labels.rig")}:</span>{" "}
              {decision.needRIG ? t("messages.rigYes") : t("messages.rigNo")}
            </p>
            {startDate && rabiesDates.length > 0 && (
              <ul className="list-disc ml-5 text-sm mt-1">
                {rabiesDates.map((d, i) => (
                  <li key={i}>
                    {t("labels.doseLine", { n: i + 1, date: formatDateISO(d, lang) })}
                  </li>
                ))}
              </ul>
            )}
            {decision.stopNote && (
              <div className="text-xs text-gray-600 mt-2">{t("messages.stopIfObs10d")}</div>
            )}
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
          <>
            <p className="text-sm mt-1">{tetanusPlanText(t, decision.tetanus)}</p>
            <ul className="list-disc ml-5 text-sm mt-1">
              {tetDates.map((d, i) => (
                <li key={i}>
                  {t("labels.doseLine", { n: i + 1, date: formatDateISO(d, lang) })}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-sm mt-1">{tetanusPlanText(t, decision.tetanus)}</p>
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
            {t("ui.expandPrint")}
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
              <h2 className="text-lg font-bold">{t("sections.hospSummary")}</h2>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                >
                  {t("ui.copy")}
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {t("ui.print")} 🖨️
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  {t("ui.close")}
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
                  aria-label={t("ui.copy")}
                >
                  {t("ui.copy")}
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
