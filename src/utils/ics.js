export function makeICS(title, dateISOs) {
  if (!dateISOs?.length) return;
  const pad = (n) => String(n).padStart(2, "0");
  const fmt = (iso) => {
    const d = new Date(iso);
    return (
      d.getUTCFullYear() +
      pad(d.getUTCMonth() + 1) +
      pad(d.getUTCDate()) +
      "T" +
      pad(d.getUTCHours()) +
      pad(d.getUTCMinutes()) +
      "00Z"
    );
  };
  const now = fmt(new Date().toISOString());
  const uid = Math.random().toString(36).slice(2) + "@dogbiteme";
  const events = dateISOs
    .map(
      (iso, i) =>
        `BEGIN:VEVENT\nUID:${uid}-${i}\nDTSTAMP:${now}\nDTSTART:${fmt(
          iso
        )}\nDURATION:PT30M\nSUMMARY:${title}\nEND:VEVENT`
    )
    .join("\n");
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//DogBiteMe//TH//\n${events}\nEND:VCALENDAR`;
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pep_schedule.ics";
  a.click();
  URL.revokeObjectURL(url);
}
