import React, { useMemo, useEffect, useState } from "react";
import Card from "../../components/Card";
import { formatDateISO } from "../../utils/format";

/** Build a GCal all-day event link (DTEND exclusive) */
const buildGCalUrl = (title, dateISO) => {
  const start = dateISO.replace(/-/g, "");
  const d = new Date(dateISO);
  d.setDate(d.getDate() + 1);
  const end = d.toISOString().slice(0, 10).replace(/-/g, "");
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&dates=${start}/${end}`;
};

/** Build a multi-VEVENT ICS string (all-day events) */
const buildICS = (events) => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const dtstamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(
    now.getUTCDate()
  )}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(
    now.getUTCSeconds()
  )}Z`;

  const vevents = events
    .map((ev, idx) => {
      const dtstart = ev.date.replace(/-/g, "");
      const d = new Date(ev.date);
      d.setDate(d.getDate() + 1);
      const dtend = d.toISOString().slice(0, 10).replace(/-/g, "");
      const uid = `dog-bite-me-${dtstart}-${idx}@app`;
      return [
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${dtstamp}`,
        `SUMMARY:${ev.title}`,
        `DTSTART;VALUE=DATE:${dtstart}`,
        `DTEND;VALUE=DATE:${dtend}`,
        "END:VEVENT",
      ].join("\r\n");
    })
    .join("\r\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//dog-bite-me//appointment helper//EN",
    "CALSCALE:GREGORIAN",
    vevents,
    "END:VCALENDAR",
    "",
  ].join("\r\n");
};

export default function IcsHelper({
  t,
  lang,
  scheduleDates = [],   // Rabies ISO dates: ["YYYY-MM-DD", ...]
  tetanusDates = [],     // Tetanus ISO dates: ["YYYY-MM-DD", ...]
}) {
  // "Dose 1" / "เข็มที่ 1" without trailing dash if any translation includes it
  const doseOnly = (n) =>
    t("labels.doseLine", { n, date: "" }).trim().replace(/—\s*$/, "");

  // Merge by date; one line and one VEVENT per calendar date
  const groupedByDate = useMemo(() => {
    const rabies = scheduleDates.map((date, i) => ({
      type: "rabies",
      date,
      title: `${t("labels.icsTitle")} — ${doseOnly(i + 1)}`,
      sortKey: i + 1,
    }));

    const tetx = tetanusDates.map((date, i) => ({
      type: "tetanus",
      date,
      title: `${t("labels.tetanusPlan")} — ${doseOnly(i + 1)}`,
      sortKey: i + 1,
    }));

    const map = new Map();
    for (const ev of [...rabies, ...tetx]) {
      const arr = map.get(ev.date) || [];
      arr.push(ev);
      map.set(ev.date, arr);
    }

    return Array.from(map.entries())
      .map(([date, items]) => {
        items.sort((a, b) => {
          if (a.sortKey !== b.sortKey) return a.sortKey - b.sortKey;
          if (a.type === b.type) return 0;
          return a.type === "rabies" ? -1 : 1;
        });
        const combinedTitle = items.map((i) => i.title).join("; ");
        return { date, title: combinedTitle };
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [scheduleDates, tetanusDates, t]);

  // Build ICS and manage blob URL
  const icsText = useMemo(() => buildICS(groupedByDate), [groupedByDate]);
  const [icsUrl, setIcsUrl] = useState(null);
  useEffect(() => {
    const url = URL.createObjectURL(
      new Blob([icsText], { type: "text/calendar;charset=utf-8" })
    );
    setIcsUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [icsText]);

  return (
    <Card>
      <p className="mb-3 text-sm text-gray-500">{t("ui.calendarSubtitle")}</p>

      <div className="mb-4">
        <a
          href={icsUrl || "#"}
          download="rabies_tetanus_schedule.ics"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm disabled:opacity-50"
          aria-disabled={!icsUrl}
          onClick={(e) => { if (!icsUrl) e.preventDefault(); }}
          title={t("ui.downloadICS")}
        >
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-slate-200 hover:bg-slate-300 active:scale-[0.98]">
  <img src="/icons/calendar.png" alt={t("ui.addToCalendar")} className="w-5 h-5" />
</span>

          {t("ui.downloadICS")}
        </a>
      </div>

      <ul className="space-y-3">
        {groupedByDate.map((ev) => (
          <li key={ev.date} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
            <span>{`${ev.title} — ${formatDateISO(ev.date, lang)}`}</span>
            <a
              href={buildGCalUrl(ev.title, ev.date)}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2"
              title={t("ui.addToCalendar")}
            >
              <img
                src="/icons/calendar.png"
                alt={t("ui.addToCalendar")}
                className="w-6 h-6 inline-block"
              />
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}
