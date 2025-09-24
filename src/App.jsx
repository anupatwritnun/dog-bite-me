import React from "react";
import { useI18n } from "./i18n.jsx";
import { formatDateISO } from "./utils/format.js";
import { Analytics } from "@vercel/analytics/react";
import Shell from "./components/Shell";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import TriageCard from "./features/triage/TriageCard.jsx";
import WoundCare from "./features/wound/WoundCare.jsx";
import VaccinePlan from "./features/plan/VaccinePlan.jsx";
import TetanusPlan from "./features/plan/TetanusPlan.jsx";
import IcsHelper from "./features/ics/IcsHelper.jsx";
import HospitalSummary from "./features/summary/HospitalSummary.jsx";
import Services from "./features/services/Services.jsx";
import RefsFeedback from "./features/misc/RefsFeedback.jsx";

import usePepState from "./hooks/usePepState.js";
import useOptions from "./hooks/useOptions.js";
import { setPageProps } from "./utils/analytics"; // << เพิ่ม

export default function App() {
  const { lang, t } = useI18n();
  const o = useOptions(t);
  const s = usePepState(t, lang);

  // อัปเดต page props ตามภาษา
  React.useEffect(() => {
    setPageProps({ lang });
  }, [lang]);

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
      s.startDate && s.startMode !== "custom" && (
        <p className="text-xs text-gray-500">{formatDateISO(s.startDate, lang)}</p>
      ),
  };

  const summaryText = s.buildSummary(o.OBS_OPTIONS, o.PRIOR_VAC);

  return (
    <Shell>
      <Header />

      <TriageCard
        t={t}
        EXPOSURES={o.EXPOSURES}
        ANIMAL_OPTIONS={o.ANIMAL_OPTIONS}
        PRIOR_VAC={o.PRIOR_VAC}
        TETANUS_OPTS={o.TETANUS_OPTS}                 // << ส่งเข้าไป
        TETANUS_RECENT_OPTS={o.TETANUS_RECENT_OPTS}   // << ส่งเข้าไป
        todayISO={s.todayISO}
        yesterdayISO={s.yesterdayISO}
        exposureCat={s.exposureCat}
        setExposureCat={s.setExposureCat}
        animalType={s.animalType}
        setAnimalType={s.setAnimalType}
        priorVaccination={s.priorVaccination}
        setPriorVaccination={s.setPriorVaccination}
        immunocompromised={s.immunocompromised}
        setImmunocompromised={s.setImmunocompromised}
        tetanusDoses={s.tetanusDoses}
        setTetanusDoses={s.setTetanusDoses}
        tetanusRecent={s.tetanusRecent}
        setTetanusRecent={s.setTetanusRecent}
        expMode={s.expMode}
        setExpMode={s.setExpMode}
        exposureDate={s.exposureDate}
        setExposureDate={s.setExposureDate}
        startMode={s.startMode}
        setStartMode={s.setStartMode}
        startDatePreview={startDatePreview}
        onConfirm={() => s.setConfirmedA(true)}
      />

      {s.confirmedA && (
        <>
          <WoundCare t={t} lang={lang} />

          <VaccinePlan
            t={t}
            lang={lang}
            exposureCat={s.exposureCat}
            priorVaccination={s.priorVaccination}
            decision={s.decision}
            regimenChoice={s.regimenChoice}
            setRegimenChoice={s.setRegimenChoice}
            startDate={s.startDate}
            effectiveDays={s.effectiveDays || []}
            addDaysISO={s.addDaysISO}
          />

          <TetanusPlan t={t} lang={lang} decision={s.decision} startDate={s.startDate} />

          {s.decision.needPEP && s.exposureCat !== "1" && (
            <IcsHelper
              t={t}
              lang={lang}
              startDate={s.startDate}
              effectiveDays={s.effectiveDays || []}
              scheduleDates={s.scheduleDates || []}
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
            TETANUS_OPTS={o.TETANUS_OPTS}
            TETANUS_RECENT_OPTS={o.TETANUS_RECENT_OPTS}
            tetanusDoses={s.tetanusDoses}
            tetanusRecent={s.tetanusRecent}
            decision={s.decision}
            startDate={s.startDate}
            scheduleDates={s.scheduleDates || []}
            summaryText={summaryText}
          />

          <Services t={t} />
         <RefsFeedback t={t} />
        </>
      )}

      <Footer />
      <Analytics />
    </Shell>
  );
}
