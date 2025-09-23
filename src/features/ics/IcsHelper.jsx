import React from "react";
import Card from "../../components/Card";
import { formatDateISO } from "../../utils/format";
import { makeICS } from "../../utils/ics";

export default function IcsHelper({
  t,
  lang,
  startDate,
  effectiveDays = [],
  scheduleDates = [],
}) {
  return (
    <Card
      title={t("sections.calendarTitle")}
      subtitle={t("ui.calendarSubtitle")}   // เพิ่ม subtitle ตามที่ขอ
      icon="📅"
    >
      {startDate ? (
        <>
          <ul className="list-disc pl-5 text-sm mt-2">
            {effectiveDays.map((d, i) => {
              const iso = scheduleDates[i]; // สมมติ mapping ตามตำแหน่ง
              const shown = iso || startDate; // เผื่อไม่มี ก็ fallback
              return (
                <li key={i}>
                  {t("labels.dayLine", { d, date: formatDateISO(shown, lang) })}
                </li>
              );
            })}
          </ul>
          <button
            className="mt-3 px-4 py-2 rounded-xl bg-slate-900 text-white"
            onClick={() =>
              scheduleDates.length &&
              makeICS(t("labels.icsTitle"), scheduleDates)
            }
          >
            {t("ui.downloadICS")}
          </button>
        </>
      ) : (
        <p className="text-sm text-slate-600">
          {/* ข้อความช่วยเดิมไว้ก่อน */}
          ตั้งวันเริ่มฉีด (Day 0) ด้านบนเพื่อคำนวณวันนัด
        </p>
      )}
    </Card>
  );
}
