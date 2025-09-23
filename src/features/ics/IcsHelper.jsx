import React from "react";
import Card from "../../components/Card";
import { formatDateISO } from "../../utils/format";
import { makeICS } from "../../utils/ics";

export default function IcsHelper({ t, lang, startDate, effectiveDays, scheduleDates }) {
  if (!startDate) return null;
  return (
    <Card title={t("sections.calendarTitle")} icon="📅">
      <ul className="list-disc pl-5 text-sm mt-2">
        {(effectiveDays || []).map((d, i) => {
          const s = scheduleDates[i];
          return <li key={i}>{t("labels.dayLine", { d, date: formatDateISO(s, lang) })}</li>;
        })}
      </ul>
      <button
        className="mt-3 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
        onClick={() => scheduleDates.length && makeICS(t("labels.icsTitle"), scheduleDates)}
      >
        {t("ui.downloadICS")}
      </button>
    </Card>
  );
}
