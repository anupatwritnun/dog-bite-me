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
  // สร้างชื่ออีเวนต์แบบ "นัดฉีดวัคซีนพิษสุนัขบ้า เข็มที่ X"
  const doseTitle = (i) =>
    (t("labels.doseTitle", { n: i + 1 }) ||
      `นัดฉีดวัคซีนพิษสุนัขบ้า เข็มที่ ${i + 1}`);

  // Google Calendar link (all-day)
  const toGCalDay = (iso) => iso?.replaceAll("-", ""); // YYYYMMDD
  const gcalHrefFor = (iso, i) =>
    `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      doseTitle(i)
    )}&dates=${toGCalDay(iso)}/${toGCalDay(iso)}&sf=true&output=xml`;

  // รายชื่อ title สำหรับแต่ละเข็ม เพื่อใส่ไปกับ .ics
  const titlesPerDate = scheduleDates.map((_, i) => doseTitle(i));

  const addToCalLabel = t("ui.addToCalendar") || "เพิ่มในปฏิทิน";

  return (
    <Card
      title={t("sections.calendarTitle")}
      subtitle={t("ui.calendarSubtitle")}
      icon="📅"
    >
      {startDate ? (
        <>
          {/* รายการวันนัด + ไอคอนเพิ่มลง GCal ทีละนัด */}
          <ul className="pl-5 text-sm mt-2 space-y-1">
            {effectiveDays.map((d, i) => {
              const iso = scheduleDates[i] || startDate; // fallback
              return (
                <li key={i} className="list-disc flex items-center gap-2">
                  <span>
                    {t("labels.dayLine", { d, date: formatDateISO(iso, lang) })}
                  </span>
                  <a
                    href={gcalHrefFor(iso, i)}
                    target="_blank"
                    rel="noreferrer"
                    title={addToCalLabel}
                    aria-label={addToCalLabel}
                    className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-slate-200 bg-white hover:bg-slate-50"
                  >
                    <img
                      src="/icons/calendar.png"   // ใส่ไอคอนไว้ที่ public/icons/calendar.png
                      alt={addToCalLabel}
                      className="w-4 h-4"
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          {/* ปุ่มเพิ่มทุกนัดแบบ .ics (ใช้ชื่อแยกตามเข็ม) */}
          <div className="mt-3 flex items-center gap-3">
            <button
              className="px-4 py-2 rounded-xl bg-slate-900 text-white"
              onClick={() =>
                scheduleDates.length &&
                makeICS(
                  t("labels.icsTitle") || "นัดฉีดวัคซีนพิษสุนัขบ้า",
                  scheduleDates,
                  titlesPerDate
                )
              }
            >
              {t("ui.downloadICS")}
            </button>
          </div>

          {/* ข้อความอธิบายสั้นตามที่ขอ */}
          <p className="mt-2 text-xs text-slate-600">
            ต้องการเพิ่มทุกนัดในครั้งเดียว ให้ดาวน์โหลดไฟล์ .ics แล้วเปิดด้วย Google
            Calendar (ด้านบน) <span className="whitespace-nowrap">
            ลิงก์ไอคอน{" "}
            <img src="/icons/calendar.png" alt="" className="inline w-4 h-4 -mt-0.5" />
            </span>{" "}
            หลังแต่ละวันเป็นการเพิ่มทีละนัด
          </p>
        </>
      ) : (
        <p className="text-sm text-slate-600">
          ตั้งวันเริ่มฉีด (Day 0) ด้านบนเพื่อคำนวณวันนัด
        </p>
      )}
    </Card>
  );
}
