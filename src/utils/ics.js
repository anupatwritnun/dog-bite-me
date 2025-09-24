// src/utils/ics.js

function escapeText(s) {
  return String(s)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

/**
 * สร้างไฟล์ .ics
 * @param {string} defaultTitle ชื่ออีเวนต์เริ่มต้น (จะใช้ถ้าไม่มี titlesPerDate หรือบางตัวเป็นค่าว่าง)
 * @param {string[]} isoDates  อาเรย์วันที่รูปแบบ YYYY-MM-DD
 * @param {string[]} [titlesPerDate]  อาเรย์ชื่ออีเวนต์ต่อรายการ (เช่น "นัดฉีดวัคซีนพิษสุนัขบ้า เข็มที่ 1")
 */
export function makeICS(defaultTitle, isoDates, titlesPerDate) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DogBiteMe//TH",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  isoDates.forEach((iso, idx) => {
    if (!iso) return;
    const ymd = iso.replaceAll("-", ""); // YYYYMMDD
    const title =
      (titlesPerDate && titlesPerDate[idx]) ? titlesPerDate[idx] : defaultTitle;

    // All-day event: DTSTART/DTEND เป็นวันเดียวกัน
    lines.push(
      "BEGIN:VEVENT",
      `UID:${ymd}-${idx}@dogbiteme`,
      `DTSTAMP:${ymd}T000000Z`,
      `DTSTART;VALUE=DATE:${ymd}`,
      `DTEND;VALUE=DATE:${ymd}`,
      `SUMMARY:${escapeText(title)}`,
      "END:VEVENT"
    );
  });

  lines.push("END:VCALENDAR");

  const blob = new Blob([lines.join("\r\n")], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "rabies-pep.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
