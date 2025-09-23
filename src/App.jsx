import React from "react";
import { useI18n } from "./i18n.jsx";
import { formatDateISO } from "./utils/format.js";

// Components
import Shell from "./components/Shell";
import Badge from "./components/Badge";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

// Features
import LangSwitcher from "./features/LangSwitcher.jsx";
import TriageCard from "./features/triage/TriageCard.jsx";
import WoundCare from "./features/wound/WoundCare.jsx";
import VaccinePlan from "./features/plan/VaccinePlan.jsx";
import IcsHelper from "./features/ics/IcsHelper.jsx";
import HospitalSummary from "./features/summary/HospitalSummary.jsx";
import Services from "./features/services/Services.jsx";

// Hooks
import usePepState from "./hooks/usePepState.js";
import useOptions from "./hooks/useOptions.js";

export default function App() {
  const { lang, setLang, t } = useI18n();
  const o = useOptions(t);
  const s = usePepState(t, lang);

  const startDatePreview = {
    mode: s.startMode,
    customInput:
      s.startMode === "custom" && (
        <input
          type="date"
          value={s.startDate || ""}
          onChange={(e) => s.setStartDate(e.target.value)}
          className="w-full border rounded-xl p-2"
        />
      ),
    hint:
      s.startDate &&
      s.startMode !== "custom" && (
        <p className="text-xs text-gray-500">{formatDateISO(s.startDate, lang)}</p>
      ),
  };

  const summaryText = s.buildSummary(o.OBS_OPTIONS, o.PRIOR_VAC);

  return (
    <Shell>
      <LangSwitcher lang={lang} setLang={setLang} label={t("ui.language")} />
      <Header />

     <TriageCard
  t={t}
  EXPOSURES={o.EXPOSURES}
  ANIMAL_OPTIONS={o.ANIMAL_OPTIONS}
  todayISO={s.todayISO}
  yesterdayISO={s.yesterdayISO}
  exposureCat={s.exposureCat}
  setExposureCat={s.setExposureCat}
  animalType={s.animalType}
  setAnimalType={s.setAnimalType}
  expMode={s.expMode}
  setExpMode={s.setExpMode}
  exposureDate={s.exposureDate}
  setExposureDate={s.setExposureDate}
  startMode={s.startMode}
  setStartMode={s.setStartMode}
  startDatePreview={startDatePreview}
  onConfirm={() => s.setConfirmedA(true)}
  confirmed={s.confirmedA}
  onResetConfirm={() => s.setConfirmedA(false)}
/>



      {s.confirmedA && (
        <>
          <WoundCare t={t} />
          <VaccinePlan
            t={t}
            lang={lang}
            exposureCat={s.exposureCat}
            priorVaccination={s.priorVaccination}
            decision={s.decision}
            regimenChoice={s.regimenChoice}
            setRegimenChoice={s.setRegimenChoice}
            startDate={s.startDate}
            effectiveDays={s.effectiveDays}
            addDaysISO={s.addDaysISO}
          />
          {s.decision.needPEP && s.exposureCat !== "1" && (
            <IcsHelper
              t={t}
              lang={lang}
              startDate={s.startDate}
              effectiveDays={s.effectiveDays}
              scheduleDates={s.scheduleDates}
            />
          )}
          <HospitalSummary
            t={t}
            lang={lang}
            exposureCat={s.exposureCat}
            animalType={s.animalType}
            exposureDate={s.exposureDate}
            priorVaccination={s.priorVaccination}
            immunocompromised={s.immunocompromised}
            PRIOR_VAC={o.PRIOR_VAC}
            decision={s.decision}
            regimenChoice={s.regimenChoice}
            startDate={s.startDate}
            scheduleDates={s.scheduleDates}
            summaryText={summaryText}
          />
          <Services t={t} />
        </>
      )}

      <Footer />
    </Shell>
  );
}
