import { useEffect, useMemo, useState } from "react";
import { todayISO, yesterdayISO, tomorrowISO, addDaysISO } from "../utils/dates";
import { decide } from "../logic/decision";
import { formatDateISO } from "../utils/format";

export default function usePepState(t, lang) {
  // Inputs
  const [exposureCat, setExposureCat] = useState("");
  const [animalType, setAnimalType] = useState("dog");
  const [animalObservable10d, setAnimalObservable10d] = useState("yes");
  const [priorVaccination, setPriorVaccination] = useState("never");
  const [immunocompromised, setImmunocompromised] = useState(false);

  // Tetanus inputs (ยังไม่ใช้คำนวนในที่นี้ แตะต่อ logic ได้)
  const [tetanusDoses, setTetanusDoses] = useState(">=3");
  const [tetanusRecent, setTetanusRecent] = useState("<5y");

  // Dates
  const [expMode, setExpMode] = useState("today");
  const [exposureDate, setExposureDate] = useState(todayISO());
  const [startMode, setStartMode] = useState("same"); // same | tomorrow | custom
  const [startDate, setStartDate] = useState(todayISO());

  useEffect(() => {
    if (startMode === "same") setStartDate(exposureDate);
    else if (startMode === "tomorrow") setStartDate(tomorrowISO());
  }, [startMode, exposureDate]);

  // Flow
  const [confirmedA, setConfirmedA] = useState(false);

  // User-chosen regimen (IM/ID)
  const [regimenChoice, setRegimenChoice] = useState(null);

  // Decision input snapshot
  const state = useMemo(
    () => ({
      exposureCat,
      animalType,
      animalObservable10d,
      priorVaccination,
      immunocompromised,
      exposureDate,
      startDate,
      tetanusDoses,
      tetanusRecent,
    }),
    [
      exposureCat,
      animalType,
      animalObservable10d,
      priorVaccination,
      immunocompromised,
      exposureDate,
      startDate,
      tetanusDoses,
      tetanusRecent,
    ]
  );

  const decision = useMemo(() => decide(state), [JSON.stringify(state)]);

  // Resolve regimen to display/use
  const effectiveRegimen =
    regimenChoice || decision.regimen || decision.suggestedRegimen || null;

  const effectiveDays = effectiveRegimen?.days || [];
  const scheduleDates = useMemo(
    () => (effectiveDays || []).map((d) => addDaysISO(startDate, d)).filter(Boolean),
    [effectiveDays, startDate]
  );

  // Summary text (for clipboard)
  const buildSummary = (OBS_OPTIONS, PRIOR_VAC) => {
    const lines = [];
    lines.push(`${t("fields.group", { n: exposureCat || "-" })}, ${t(`animals.${animalType}`)}`);
    if (exposureDate) lines.push(`${t("fields.exposureDate")}: ${formatDateISO(exposureDate, lang)}`);
    lines.push(`${t("labels.animalObs10d")}: ${OBS_OPTIONS.find(o => o.id === animalObservable10d)?.label || "-"}`);
    lines.push(`${t("fields.priorVac")}: ${PRIOR_VAC.find(p => p.id === priorVaccination)?.label || "-"}`);
    lines.push(`${t("fields.immunocomp")}: ${immunocompromised ? t("labels.immunocompYes") : t("labels.immunocompNo")}`);
    if (!decision.needPEP) {
      lines.push(t("messages.summaryPEPNo"));
    } else {
      const planLabel = effectiveRegimen?.label || decision.regimen?.label || decision.suggestedRegimen?.label || "";
      lines.push(`${t("labels.plan")}: ${planLabel}`);
      lines.push(`${t("labels.rig")}: ${decision.needRIG ? t("messages.rigYes") : t("messages.rigNo")}`);
      if (startDate && scheduleDates.length) {
        lines.push(
          `${t("fields.realAppt", { date: formatDateISO(startDate, lang) })}: ` +
          scheduleDates.map(s => formatDateISO(s, lang)).join(", ")
        );
      }
      if (decision.stopNote) lines.push(`Note: ${decision.stopNote}`);
    }
    return lines.join("\n");
  };

  return {
    // state
    exposureCat, setExposureCat,
    animalType, setAnimalType,
    animalObservable10d, setAnimalObservable10d,
    priorVaccination, setPriorVaccination,
    immunocompromised, setImmunocompromised,
    tetanusDoses, setTetanusDoses,
    tetanusRecent, setTetanusRecent,
    expMode, setExpMode,
    exposureDate, setExposureDate,
    startMode, setStartMode,
    startDate, setStartDate,
    confirmedA, setConfirmedA,
    regimenChoice, setRegimenChoice,

    // derived
    decision, effectiveRegimen, effectiveDays, scheduleDates,

    // utils
    todayISO, yesterdayISO, tomorrowISO, addDaysISO, buildSummary,
  };
}
