import React from "react";
import { useI18n } from "./i18n.jsx";
import { formatDateISO } from "./utils/format.js";
import { addDaysISO } from "./utils/dates.js";
import { Analytics } from "@vercel/analytics/react";
import Shell from "./components/Shell";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import StickyNav from "./components/StickyNav.jsx";

import TriageCard from "./features/triage/TriageCard.jsx";
import WoundCare from "./features/wound/WoundCare.jsx";
import VaccinePlan from "./features/plan/VaccinePlan.jsx";
import TetanusPlan from "./features/plan/TetanusPlan.jsx";
import IcsHelper from "./features/ics/IcsHelper.jsx";
import HospitalSummary from "./features/summary/HospitalSummary.jsx";
import Services from "./features/services/Services.jsx";
import Refs from "./features/misc/Refs.jsx";
import Feedback from "./features/misc/Feedback.jsx";
// Back-compat wrapper if used elsewhere
import RefsFeedback from "./features/misc/RefsFeedback.jsx";

import usePepState from "./hooks/usePepState.js";
import useOptions from "./hooks/useOptions.js";
import { setPageProps } from "./utils/analytics";

// ---------- Plausible helpers (safe-guarded) ----------
function track(event, props = {}) {
  try {
    if (typeof window !== "undefined" && typeof window.plausible === "function") {
      window.plausible(event, { props });
    }
  } catch {}
}
function textOf(el) {
  if (!el) return "";
  const t = (el.getAttribute("data-track-label") || el.textContent || "").trim();
  return t.length > 80 ? t.slice(0, 77) + "..." : t;
}

// Small helper: collapsible wrapper using details/summary
function CollapseSection({ id, title, children, defaultOpen = false }) {
  // ติดตาม open/close ของแต่ละ section
  const onToggle = (e) => {
    const open = e.currentTarget.open;
    track("collapse_toggle", { id, open });
  };

  return (
    <section id={id} className="mt-6">
      <details
        className="group rounded-xl border border-slate-200 bg-white"
        {...(defaultOpen ? { open: true } : {})}
        onToggle={onToggle}
      >
        <summary
          className="flex items-center justify-between cursor-pointer select-none px-4 py-3 sm:px-5 sm:py-4 rounded-xl
                     list-none [&::-webkit-details-marker]:hidden"
          aria-controls={`${id}-content`}
          // ช่วยให้ global click trackerอ่าน label ได้แม่นขึ้น
          data-track-label={typeof title === "string" ? title : undefined}
        >
          <span className="text-lg sm:text-xl font-bold text-slate-800">
            {title}
          </span>
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-open:rotate-180 opacity-70"
            viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
          >
            <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z"/>
          </svg>
        </summary>
        <div id={`${id}-content`} className="px-4 pb-4 sm:px-5 sm:pb-5">
          {children}
        </div>
      </details>
    </section>
  );
}

export default function App() {
  const { lang, t } = useI18n();
  const o = useOptions(t);
  const s = usePepState(t, lang);

  // analytics: page props by language
  React.useEffect(() => {
    setPageProps({ lang });
  }, [lang]);

  // ---------- Global click tracking for all buttons/links ----------
  React.useEffect(() => {
    const handler = (e) => {
      // หา element ที่น่าจะเป็นปุ่ม/ลิงก์
      const el = e.target.closest('button, [role="button"], a[href]');
      if (!el) return;

      // หมวด/หน้าปัจจุบัน
      const section = e.target.closest("section")?.id || "";
      const tag = el.tagName.toLowerCase();
      const isLink = tag === "a";
      const href = isLink ? el.getAttribute("href") : undefined;
      const id = el.id || "";
      const name = el.getAttribute("name") || "";
      const aria = el.getAttribute("aria-label") || "";
      const label = textOf(el) || aria || name || id || (isLink ? href : tag);

      track("ui_click", { label, tag, href, id, name, aria, section, lang });
    };

    document.addEventListener("click", handler, { passive: true });
    return () => document.removeEventListener("click", handler);
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

  // Tetanus ISO dates from decision.tetanus.offsets
  const tet = s.decision?.tetanus || { need: false, offsets: [] };
  const tetanusDates =
    tet.need && s.startDate && Array.isArray(tet.offsets)
      ? tet.offsets.map((off) => addDaysISO(s.startDate, off))
      : [];

  // Show ICS if rabies plan exists OR there are tetanus appointments
  const showIcs =
    ((s.decision?.needPEP && s.exposureCat !== "1") || tetanusDates.length > 0);

  return (
    <Shell>
      <Header />
      <StickyNav t={t} />

      {/* RISK / TRIAGE */}
      <section id="risk">
        <TriageCard
          t={t}
          EXPOSURES={o.EXPOSURES}
          ANIMAL_OPTIONS={o.ANIMAL_OPTIONS}
          PRIOR_VAC={o.PRIOR_VAC}
          TETANUS_OPTS={o.TETANUS_OPTS}
          TETANUS_RECENT_OPTS={o.TETANUS_RECENT_OPTS}
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
      </section>

      {s.confirmedA && (
        <>
          {/* WOUND CARE */}
          <section id="wound">
            <WoundCare t={t} lang={lang} />
          </section>

          {/* VACCINE PLANS */}
          <section id="plan">
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
          </section>

          {/* CALENDAR / ICS */}
          {showIcs && (
            <CollapseSection id="calendar" title={`🗓️ ${t("sections.calendarTitle") || "เพิ่มในปฏิทิน"}`}>
              <IcsHelper
                t={t}
                lang={lang}
                scheduleDates={s.scheduleDates || []}  // rabies ISO dates
                tetanusDates={tetanusDates}           // tetanus ISO dates
              />
            </CollapseSection>
          )}

          {/* SUMMARY */}
          {/* SUMMARY (not collapsible) */}
<section id="summary" className="mt-6">
  <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
    <h2 className="text-lg sm:text-xl font-bold text-slate-800">
      {`🧾 ${t("sections.summaryTitle") || "ใบสรุปสำหรับไปหาหมอ"}`}
    </h2>
  </div>
  <div className="px-4 pb-4 sm:px-5 sm:pb-5">
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
  </div>
</section>


          {/* SERVICES: collapsible */}
          <CollapseSection id="services" title={`🗺️ ${t("sections.service") || "แผนที่ / Services"}`}>
            <Services t={t} />
          </CollapseSection>

          {/* REFS: collapsible */}
          <CollapseSection id="refs" title={`📚 ${t("sections.refs") || "อ้างอิง"}`}>
            <Refs t={t} />
          </CollapseSection>

          {/* FEEDBACK: collapsible */}
          <CollapseSection id="feedback" title={`💬 ${t("sections.feedback") || "Feedback"}`}>
            <Feedback t={t} />
          </CollapseSection>
        </>
      )}

      <Footer />
      <Analytics />
    </Shell>
  );
}
