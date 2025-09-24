import React, { useMemo } from "react";
import Card from "../../components/Card";
import { addDaysISO } from "../../utils/dates";
import { formatDateISO } from "../../utils/format";

// same helper, แค่รับ title/date ที่ถูกแปลจากข้างนอก
const generateGoogleCalendarUrl = (event) => {
  const startDate = event.date.replace(/-/g, "");
  const d = new Date(event.date);
  d.setDate(d.getDate() + 1);
  const endDate = d.toISOString().slice(0, 10).replace(/-/g, "");
  const encodedTitle = encodeURIComponent(event.title);
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&dates=${startDate}/${endDate}`;
};

export default function IcsHelper({ t, lang, startDate, scheduleDates, decision }) {
  // ฟังก์ชันเล็กๆ ไว้สร้างชื่ออีเวนต์ตามภาษา โดยไม่ต้องเพิ่มคีย์ใหม่ใน JSON
  const doseOnly = (n) =>
    t("labels.doseLine", { n, date: "" }).trim().replace(/—\s*$/, ""); // "Dose 1" / "เข็มที่ 1"

  const allEvents = useMemo(() => {
    const rabiesEvents = (scheduleDates || []).map((date, i) => ({
      key: `rabies-${i}`,
      // "Rabies vaccination appointments — Dose 1"
      title: `${t("labels.icsTitle")} — ${doseOnly(i + 1)}`,
      date,
    }));

    const tetanusOffsets = decision?.tetanus?.offsets || [];
    const tetanusEvents = tetanusOffsets.map((off, i) => ({
      key: `tetanus-${i}`,
      // "Tetanus — Dose 1"
      title: `${t("labels.tetanusPlan")} — ${doseOnly(i + 1)}`,
      date: addDaysISO(startDate, off),
    }));

    return [...rabiesEvents, ...tetanusEvents];
  }, [scheduleDates, decision, startDate, t]);

  return (
    <Card title={`${t("sections.calendarTitle")}`} icon="🗓️">
      <p className="mb-4 text-sm text-gray-500">{t("ui.calendarSubtitle")}</p>

      <ul className="space-y-3">
        {allEvents.map((event) => (
          <li
            key={event.key}
            className="flex justify-between items-center bg-slate-50 p-3 rounded-lg"
          >
            <span>
              {`${event.title} — ${formatDateISO(event.date, lang)}`}
            </span>

            <a
              href={generateGoogleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2"
              title={t("ui.addToCalendar")}
            >
              <img
                src="/icons/calendar.png" // public/icons/calendar.png
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
