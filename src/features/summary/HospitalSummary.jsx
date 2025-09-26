import React, { useState, useRef, useMemo, useEffect } from "react";
import { printScheduleTable } from "../../utils/print";
import Card from "../../components/Card";
import KeyRow from "../../components/KeyRow";
import { formatDateISO } from "../../utils/format";
import { addDaysISO } from "../../utils/dates";

// ---------- helpers: remove accidental curly braces from i18n ----------
const stripCurlies = (s) => (typeof s === "string" ? s.replace(/[{}]/g, "") : s);
const ttFactory = (tFn) => (key, params) => stripCurlies(tFn(key, params));

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

// ---------- pretty text (สำหรับคัดลอก/พิมพ์แบบข้อความ) ----------
function buildPrettyText({
  t, lang, exposureCat, animalType, exposureDate,
  priorLabel, immunocompromised, rabiesDates,
  tetDoseLabel, tetRecentLabel, tetDates, decision, startDate
}) {
  const d = (iso) => formatDateISO(iso, lang);
  const safeLen = (x) => String(x ?? "").length;
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

// ---------- Patient-facing summary helpers ----------
function buildPatientBlocks({ lang, startDate, rabiesDates, tetDates }) {
  const map = new Map();
  rabiesDates.forEach((iso, idx) => {
    if (!map.has(iso)) map.set(iso, []);
    map.get(iso).push({ kind: "rabies", dose: idx + 1 });
  });
  tetDates.forEach((iso, idx) => {
    if (!map.has(iso)) map.set(iso, []);
    map.get(iso).push({ kind: "tetanus", dose: idx + 1 });
  });
  const days = Array.from(map.keys()).sort();
  return { days, map };
}

// ---------- Component ----------
export default function HospitalSummary({
  t, lang,
  exposureCat, animalType, exposureDate,
  priorVaccination, immunocompromised,
  PRIOR_VAC,
  TETANUS_OPTS, TETANUS_RECENT_OPTS,
  tetanusDoses, tetanusRecent,
  decision, startDate, scheduleDates, summaryText,
}) {
  const [toast, setToast] = useState(null); // {text: string}

  // i18n “brace-free” helper
  const t2 = useMemo(() => ttFactory(t), [t]);

  // labels (แปลแล้ว มาจาก useOptions)
  const priorLabel = PRIOR_VAC.find((p) => p.id === priorVaccination)?.label || "-";
  const tetDoseLabel = TETANUS_OPTS.find((o) => o.id === tetanusDoses)?.label || "-";
  const tetRecentLabel = tetanusRecent
    ? TETANUS_RECENT_OPTS.find((o) => o.id === tetanusRecent)?.label || "-"
    : "-";

  // schedules
  // schedules
const rabiesDates = scheduleDates || [];
const tetDates = useMemo(() => {
  const offs = decision?.tetanus?.offsets;
  if (!Array.isArray(offs) || !startDate) return [];
  // ถ้าไม่ต้องฉีด ก็ไม่ต้องคำนวณ
  if (!decision?.tetanus?.need) return [];
  try {
    return offs.map((d) => addDaysISO(startDate, d)).filter(Boolean);
  } catch {
    return [];
  }
}, [decision?.tetanus, startDate]);


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

  // โซนสำหรับพิมพ์ตารางนัด
  const printRef = useRef(null);
  const handlePrint = React.useCallback(() => {
  try {
    window.plausible?.("print_schedule", { props: { section: "summary", lang } });
    printScheduleTable({
      t,
      lang,
      rabiesDates: scheduleDates || [],
      tetDates,
      title: lang === "th" ? "ตารางฉีดวัคซีน" : "Vaccination Schedule"
    });
  } catch (e) {
    console.error("print_schedule failed:", e);
  }
}, [t, lang, scheduleDates, tetDates]);


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

  // -------- Patient-facing subsection (multilang + brace-free) --------
  const PatientSummary = () => {
    if (exposureCat === "1") {
      return (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm">
          {t("messages.cat1NoPEP")}
        </div>
      );
    }

    const { days, map } = buildPatientBlocks({ lang, startDate, rabiesDates, tetDates });
    const d = (iso) => formatDateISO(iso, lang);

    const totalRabies = rabiesDates.length;
    const totalTet = tetDates.length;
    const totalAll = totalRabies + totalTet;
    const firstDate = startDate || days[0];

    const splitShotsText =
      totalRabies > 0 && totalTet > 0
        ? t2("summary.patient.splitShotsBoth", { rabies: totalRabies, tetanus: totalTet })
        : totalRabies > 0
          ? t2("summary.patient.splitShotsRabiesOnly", { rabies: totalRabies })
          : totalTet > 0
            ? t2("summary.patient.splitShotsTetanusOnly", { tetanus: totalTet })
            : "";

    return (
      <div className="space-y-3">
        <p className="text-sm sm:text-base">
          {t2("summary.patient.groupLine", { n: exposureCat || "-" })}{" "}
          {firstDate ? t2("summary.patient.firstVisit", { date: d(firstDate) }) : null}{" "}
          {totalAll > 0 ? t2("summary.patient.totalShots", { n: totalAll }) : null}{" "}
          {splitShotsText}
        </p>

        <div className="mt-2">
          <div className="text-sm font-medium mb-1">{t2("summary.patient.scheduleTitle")}</div>
          <ul className="space-y-2">
            {days.map((iso) => (
              <li key={iso} className="p-3 rounded-lg border border-slate-200 bg-white">
                <div className="font-semibold">{d(iso)}</div>
                <ul className="list-disc ml-5 mt-1 text-sm">
                  {map.get(iso).map((item, idx) => (
                    <li key={idx}>
                      {item.kind === "rabies"
                        ? t2("summary.patient.rabiesDoseLine", { n: item.dose })
                        : t2("summary.patient.tetanusDoseLine", { n: item.dose })}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  // -------- Doctor-facing subsection (form, multilang + brace-free) --------
  const DoctorSummaryForm = () => {
    const d = (iso) => formatDateISO(iso, lang);
    const isCat1 = exposureCat === "1";

    const regimenLabel = labelForRegimen(t, decision.regimen || decision.suggestedRegimen);
    const animalText = stripCurlies(t(`animals.${animalType}`));

    // Rabies lines: แสดงเฉพาะถ้าไม่ใช่ Cat 1
    const rabiesLines = !isCat1 && rabiesDates.length
      ? rabiesDates.map((iso, i) => t2("summary.doctor.rabiesDoseLine", { n: i + 1, date: d(iso) })).join("\n")
      : "";

    // Tetanus: ข้ามถ้า Cat 1 หรือ code เป็น SKIP_CAT1
    const skipTet = isCat1 || decision?.tetanus?.code === "SKIP_CAT1";
    const firstTet = (tetDates && tetDates[0]) ? d(tetDates[0]) : "";
    const tetBoosterLine = firstTet
      ? t2("summary.doctor.tetBoosterWithDate", { date: firstTet })
      : t2("summary.doctor.tetBoosterNoDate");

    return (
      <div className="space-y-4 text-sm">
        {/* ข้อมูลเบื้องต้น */}
        <div>
          <div className="text-base sm:text-lg font-bold mb-1">
            {t2("summary.doctor.basicsTitle")}
          </div>
          <div className="whitespace-pre-wrap">
            {[
              t2("summary.doctor.catLine", { n: exposureCat || "-" }),
              t2("summary.doctor.animalLine", { animal: animalText }),
              exposureDate ? t2("summary.doctor.exposureDateLine", { date: d(exposureDate) }) : null,
              t2("summary.doctor.priorLine", { prior: priorLabel }),
              t2("summary.doctor.immLine", { imm: immunocompromised ? t("labels.immunocompYes") : t("labels.immunocompNo") }),
            ].filter(Boolean).join("\n")}
          </div>
        </div>

        {/* แผนวัคซีนพิษสุนัขบ้า */}
<div>
  <div className="text-base sm:text-lg font-bold mb-1">
    {isCat1
      ? `💉 ${t2("summary.doctor.rabiesNoPEPTitle") || "แผนวัคซีนพิษสุนัขบ้า (ไม่ต้องฉีด)"}`
      : `💉 ${t2("summary.doctor.rabiesPlanTitle", { regimen: regimenLabel })}`
    }
  </div>
  <div className="whitespace-pre-wrap">
    {isCat1
      ? (t2("summary.doctor.rabiesNoPEP") || "กลุ่ม 1: ไม่ต้องฉีดวัคซีน/RIG")
      : (rabiesLines || (t2("summary.doctor.noRabiesDoses") || "-"))
    }
  </div>
</div>


        {/* RIG */}
        <div>
          <div className="text-base sm:text-lg font-bold mb-1">{t2("summary.doctor.rigTitle")}</div>
          <div>
            {isCat1
              ? (t2("summary.doctor.rigNo") || "ไม่แนะนำ")
              : (decision.needRIG ? t2("summary.doctor.rigYes", { n: exposureCat || "-" }) : t2("summary.doctor.rigNo"))
            }
          </div>
        </div>

        {/* Tetanus */}
<div>
  <div className="text-base sm:text-lg font-bold mb-1">{t2("summary.doctor.tetanusTitle")}</div>

  {skipTet ? (
    <div>{t2("summary.doctor.tetSkipCat1") || "กลุ่ม 1: ไม่จำเป็นต้องฉีดบาดทะยัก"}</div>
  ) : decision?.tetanus?.need ? (
    <div className="whitespace-pre-wrap">
      {decision.tetanus.code === "SERIES" ? (
        [
          t2("summary.doctor.tetSeriesLine1"),
          t2("summary.doctor.tetSeriesLine2"),
          (tetDates && tetDates.length
            ? tetDates.map((iso, i) => t2("labels.doseLine", { n: i + 1, date: d(iso) })).join("\n")
            : null),
        ].filter(Boolean).join("\n")
      ) : (
        (firstTet
          ? t2("summary.doctor.tetBoosterWithDate", { date: firstTet })
          : t2("summary.doctor.tetBoosterNoDate"))
      )}
    </div>
  ) : (
    <div>{t2("labels.tetanusNone") || "ไม่จำเป็นต้องฉีดเพิ่มเติม"}</div>
  )}
</div>

      </div>
    );
  };

  // ---------- UI ----------
  return (
    <>
      {/* Card view: รวม 2 ซับเซคชันแบบ collapsible */}
      <Card>
        <div className="space-y-4">
          {/* Patient collapsible */}
          <details
            className="group rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
            open
          >
            <summary
              className="flex items-center justify-between cursor-pointer select-none px-4 py-3 sm:px-5 sm:py-4
                         list-none [&::-webkit-details-marker]:hidden"
              data-track-label="summary_patient_toggle"
            >
              <span className="text-lg sm:text-xl font-bold text-slate-800">
                👤 {t("sections.patientSummary") || "สำหรับคนไข้"}
              </span>
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-open:rotate-180 opacity-70"
                viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
              >
                <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z"/>
              </svg>
            </summary>
            <div className="border-t border-slate-200 bg-slate-50/60 group-open:bg-slate-50">
              <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                <PatientSummary />
              </div>
            </div>
          </details>

          {/* Doctor collapsible */}
          <details
            className="group rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
          >
            <summary
              className="flex items-center justify-between cursor-pointer select-none px-4 py-3 sm:px-5 sm:py-4
                         list-none [&::-webkit-details-marker]:hidden"
              data-track-label="summary_doctor_toggle"
            >
              <span className="text-lg sm:text-xl font-bold text-slate-800">
                👨‍⚕️ {t("sections.doctorSummary") || "สำหรับแพทย์"}
              </span>
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-open:rotate-180 opacity-70"
                viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
              >
                <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z"/>
              </svg>
            </summary>
            <div className="border-t border-slate-200 bg-slate-50/60 group-open:bg-slate-50">
              <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                <DoctorSummaryForm />
              </div>
            </div>
          </details>
        </div>

        {/* ปุ่มด้านล่าง: ไม่มี “ขยาย” อีกต่อไป เหลือแค่ปริ้น */}
        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={() => {
              try { window.plausible?.("print_schedule", { props: { lang } }); } catch {}
              handlePrint();
            }}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 w-full"
            data-track-label="summary_print"
            aria-label={t("ui.printSchedule") || (lang === "th" ? "พิมพ์ตารางนัด" : "Print schedule")}
          >
            {t("ui.printSchedule") || (lang === "th" ? "พิมพ์ตารางนัด" : "Print schedule")}
          </button>
        </div>
      </Card>

      {/* พื้นที่ซ่อนสำหรับพิมพ์ตารางนัด */}
      <PrintableSchedule
        ref={printRef}
        t={t2}
        lang={lang}
        startDate={startDate}
        rabiesDates={rabiesDates}
        tetDates={tetDates}
      />

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

// ---------- Printable component (hidden on screen, visible on print) ----------
const PrintableSchedule = React.forwardRef(function PrintableSchedule(props, ref) {
  const { t, lang, startDate, rabiesDates = [], tetDates = [] } = props;
  const d = (iso) => formatDateISO(iso, lang);

  // สร้างบล็อกวัน/โดสเหมือนฝั่งผู้ป่วย
  const { days, map } = buildPatientBlocks({ lang, startDate, rabiesDates, tetDates });

  return (
    <div ref={ref} className="hidden print:block">
      <div style={{ padding: 20 }}>
        <h1>{t("summary.patient.scheduleTitle")}</h1>
        <div>
          {days.length === 0 && <div>{t("labels.noSchedule") || "ไม่มีตารางนัด"}</div>}
          {days.map((iso) => (
            <div key={iso} style={{ marginBottom: 10 }}>
              <h2>{d(iso)}</h2>
              <ul>
                {map.get(iso).map((item, idx) => (
                  <li key={idx}>
                    {item.kind === "rabies"
                      ? t("summary.patient.rabiesDoseLine", { n: item.dose })
                      : t("summary.patient.tetanusDoseLine", { n: item.dose })}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
