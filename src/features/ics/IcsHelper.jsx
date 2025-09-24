import React from "react";
import Card from "../../components/Card";
import { formatDateISO } from "../../utils/format.js";
import { makeICS } from "../../utils/ics.js";

export default function IcsHelper({
  t,
  lang,
  startDate,
  effectiveDays = [],
  scheduleDates = [],
}) {
  // Build a Google Calendar all-day event link for the first date
  const firstISO = scheduleDates?.[0];
  const toGCalDay = (iso) => iso?.replaceAll("-", ""); // YYYYMMDD
  const gcalHref = firstISO
    ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        t("labels.icsTitle")
      )}&dates=${toGCalDay(firstISO)}/${toGCalDay(firstISO)}&details=${encodeURIComponent(
        "PEP schedule"
      )}&sf=true&output=xml`
    : null;

  return (
    <Card
      title={t("sections.calendarTitle")}
      subtitle={t("ui.calendarSubtitle")}
      icon="📅"
    >
      {startDate ? (
        <>
          <ul className="list-disc pl-5 text-sm mt-2">
            {effectiveDays.map((d, i) => {
              const iso = scheduleDates[i] || startDate; // fallback
              return (
                <li key={i}>
                  {t("labels.dayLine", { d, date: formatDateISO(iso, lang) })}
                </li>
              );
            })}
          </ul>

          <div className="mt-3 flex items-center gap-3">
            <button
              className="px-4 py-2 rounded-xl bg-slate-900 text-white"
              onClick={() =>
                scheduleDates.length &&
                makeICS(t("labels.icsTitle"), scheduleDates)
              }
            >
              {t("ui.downloadICS")}
            </button>

            {gcalHref && (
              <a
                href={gcalHref}
                target="_blank"
                rel="noreferrer"
                className="text-sm underline text-slate-700 hover:text-slate-900"
                aria-label="Open in Google Calendar"
                title="Open in Google Calendar"
              >
                {t("ui.openInGCal") || "Open in Google Calendar"}
              </a>
            )}
          </div>
        </>
      ) : (
        <p className="text-sm text-slate-600">
          ตั้งวันเริ่มฉีด (Day 0) ด้านบนเพื่อคำนวณวันนัด
        </p>
      )}
    </Card>
  );
}
