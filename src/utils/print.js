// utils/print.js
import { formatDateISO } from "./format";

/* ============== Base styles ============== */
export const defaultPageStyle = `
  @page { margin: 16mm; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  pre { font-size: 14px; line-height: 1.7; }
`;

// A5 portrait + margin เล็กลง
export const a5PageStyle = `
  @page { size: A5 portrait; margin: 10mm; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
`;

/* ============== Print via hidden iframe ============== */
export function printNode(node, title = "สรุปแผนการรักษา", extraStyle = defaultPageStyle) {
  if (!node) return false;
  const iframe = document.createElement("iframe");
  Object.assign(iframe.style, {
    position: "fixed", right: "0", bottom: "0", width: "0", height: "0", border: "0"
  });
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();

  const cssLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map(el => el.outerHTML)
    .join("\n");

  doc.write(`
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        ${cssLinks}
        <style>
          ${extraStyle}
          /* ตารางพิมพ์สำหรับ A5 */
          body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans Thai", "Noto Sans", "Helvetica Neue", Arial, "Liberation Sans", sans-serif; }
          .print-wrap { padding: 10px; }
          .print-title { text-align: center; font-weight: 800; margin: 0 0 10px; font-size: 15px; }
          .vax-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
          .vax-table th, .vax-table td {
            border: 1px solid #333;
            padding: 6px 8px;
            vertical-align: top;
            /* อนุญาตขึ้นบรรทัดใหม่/ตัดคำ */
            white-space: normal;
            word-break: break-word;
            overflow-wrap: anywhere;
            line-height: 1.35;
            font-size: 11.5px;
          }
          .vax-table th { font-weight: 700; text-align: left; background: #f3f6fb; }
          .vax-table td.blank { color: #999; }
          /* สัดส่วนคอลัมน์สำหรับ A5 */
          .cell-date { width: 26%; }
          .cell-type { width: 34%; }
          .cell-brand { width: 14%; }
          .cell-hosp { width: 16%; }
          .cell-sign { width: 10%; }
          .vax-table tbody tr { page-break-inside: avoid; }
        </style>
      </head>
      <body>
        ${node.outerHTML}
      </body>
    </html>
  `);
  doc.close();

  const win = iframe.contentWindow;
  const doPrint = () => {
    try { win.focus(); } catch {}
    win.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  };
  if (win.document.readyState === "complete") setTimeout(doPrint, 50);
  else win.onload = () => setTimeout(doPrint, 50);

  return true;
}

/* ============== Clipboard helper (เดิม) ============== */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

/* ============== Header helpers (multi-lang) ============== */
// ตัดวงเล็บปีกกาเผื่อบาง lib ใส่มา
const stripCurlies = (s) => (typeof s === "string" ? s.replace(/[{}]/g, "") : s);

// ดึงค่าจาก i18n แบบ "ดิบ" ถ้าไม่มีแปลให้เป็น null
function tRaw(t, key) {
  try {
    const out = t ? t(key) : null;
    if (out && typeof out === "string" && out !== key) return stripCurlies(out);
  } catch {}
  return null;
}

/**
 * กฎหัวตาราง:
 * - th: ไทยล้วน
 * - en: อังกฤษล้วน
 * - อื่นๆ:
 *    - ถ้ามีคำแปล "ภาษานั้นจริงๆ" → "ภาษานั้น (English)"
 *    - ถ้าไม่มีคำแปล หรือ i18n ดันส่ง "ไทย" มาเป็น fallback → ใช้ "English" ล้วน
 */
function fuseHeader(lang, localRaw, th, en) {
  if (lang === "th") return th;
  if (lang === "en") return en;
  if (!localRaw || localRaw === th) return en;
  return `${localRaw} (${en})`;
}

function getHeaderTexts(t, lang) {
  const th = {
    title: "ตารางฉีดวัคซีน",
    date: "วันที่",
    typeDose: "ชนิดวัคซีน-เข็ม",
    brand: "ยี่ห้อ/Lot.no.",
    hospital: "โรงพยาบาล",
    signature: "ลายเซ็น",
  };
  const en = {
    title: "Vaccination Schedule",
    date: "Date",
    typeDose: "Vaccine Type-Dose",
    brand: "Brand/Lot.no.",
    hospital: "Hospital",
    signature: "Signature",
  };

  // ค่าดิบจากไฟล์แปลของภาษาปัจจุบัน (null ถ้าไม่มี)
  const L = {
    title: tRaw(t, "print.schedule.title"),
    date: tRaw(t, "print.schedule.date"),
    typeDose: tRaw(t, "print.schedule.typeDose"),
    brand: tRaw(t, "print.schedule.brand"),
    hospital: tRaw(t, "print.schedule.hospital"),
    signature: tRaw(t, "print.schedule.signature"),
  };

  return {
    title: fuseHeader(lang, L.title, th.title, en.title),
    date: fuseHeader(lang, L.date, th.date, en.date),
    typeDose: fuseHeader(lang, L.typeDose, th.typeDose, en.typeDose),
    brand: fuseHeader(lang, L.brand, th.brand, en.brand),
    hospital: fuseHeader(lang, L.hospital, th.hospital, en.hospital),
    signature: fuseHeader(lang, L.signature, th.signature, en.signature),
  };
}


/* ============== Build rows ============== */
function groupByDate(rabiesDates = [], tetDates = []) {
  const map = new Map();
  rabiesDates.forEach((iso, idx) => {
    if (!map.has(iso)) map.set(iso, []);
    map.get(iso).push({ kind: "rabies", dose: idx + 1 });
  });
  tetDates.forEach((iso, idx) => {
    if (!map.has(iso)) map.set(iso, []);
    map.get(iso).push({ kind: "tetanus", dose: idx + 1 });
  });
  const days = Array.from(map.keys()).sort();
  return { days, map };
}

function typeDoseText(t, item) {
  return item.kind === "rabies"
    ? stripCurlies(t("summary.patient.rabiesDoseLine", { n: item.dose }))
    : stripCurlies(t("summary.patient.tetanusDoseLine", { n: item.dose }));
}

/* ============== Build printable node ============== */
export function buildScheduleTableNode({ t, lang, rabiesDates = [], tetDates = [], titleOverride } = {}) {
  const d = (iso) => formatDateISO(iso, lang);
  const headers = getHeaderTexts(t, lang);
  const { days, map } = groupByDate(rabiesDates, tetDates);

  const wrap = document.createElement("div");
  wrap.className = "print-wrap";

  const h1 = document.createElement("h1");
  h1.className = "print-title";
  h1.textContent = stripCurlies(titleOverride || headers.title);
  wrap.appendChild(h1);

  const table = document.createElement("table");
  table.className = "vax-table";

  const thead = document.createElement("thead");
  const trh = document.createElement("tr");
  [["cell-date", headers.date],
   ["cell-type", headers.typeDose],
   ["cell-brand", headers.brand],
   ["cell-hosp", headers.hospital],
   ["cell-sign", headers.signature]
  ].forEach(([cls, text]) => {
    const th = document.createElement("th");
    th.className = cls;
    th.textContent = text;
    trh.appendChild(th);
  });
  thead.appendChild(trh);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  if (days.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 5;
    td.textContent = tOr(t, "print.schedule.noRows", lang === "th" ? "ไม่มีรายการนัด" : "No appointments");
    tr.appendChild(td);
    tbody.appendChild(tr);
  } else {
    days.forEach((iso) => {
      const items = map.get(iso) || [];
      items.forEach((item) => {
        const tr = document.createElement("tr");

        const tdDate = document.createElement("td");
        tdDate.textContent = d(iso);
        tr.appendChild(tdDate);

        const tdType = document.createElement("td");
        tdType.textContent = typeDoseText(t, item);
        tr.appendChild(tdType);

        const tdBrand = document.createElement("td");
        tdBrand.className = "blank";
        tr.appendChild(tdBrand);

        const tdHosp = document.createElement("td");
        tdHosp.className = "blank";
        tr.appendChild(tdHosp);

        const tdSign = document.createElement("td");
        tdSign.className = "blank";
        tr.appendChild(tdSign);

        tbody.appendChild(tr);
      });
    });
  }

  table.appendChild(tbody);
  wrap.appendChild(table);
  return wrap;
}

/* ============== One-shot print API ============== */
export function printScheduleTable({ t, lang, rabiesDates = [], tetDates = [], title } = {}) {
  const node = buildScheduleTableNode({ t, lang, rabiesDates, tetDates, titleOverride: title });
  const paperTitle = lang === "th" ? "ตารางฉีดวัคซีน" : "Vaccination Schedule";
  return printNode(node, paperTitle, a5PageStyle);
}

/* ============== ของเดิม (ยังเผื่อใช้) ============== */
export function buildPrettySummary({
  t, lang, exposureCat, animalType, exposureDate,
  priorLabel, immunocompromised, rabiesDates,
  tetDoseLabel, tetRecentLabel, tetDates, decision, startDate,
}) {
  const d = (iso) => formatDateISO(iso, lang);
  const L = [];
  L.push(`สรุปแผนการรักษา`);
  L.push(`==================`);
  L.push(`• กลุ่ม: ${t("fields.group", { n: exposureCat || "-" })}`);
  L.push(`• ชนิดสัตว์: ${t(`animals.${animalType}`)}`);
  if (exposureDate) L.push(`• วันถูกกัด/ข่วน: ${d(exposureDate)}`);
  L.push(`• ประวัติ PEP: ${priorLabel}`);
  L.push(`• ภูมิคุ้มกันบกพร่อง: ${immunocompromised ? t("labels.immunocompYes") : t("labels.immunocompNo")}`);
  L.push(``);
  L.push(`วัคซีนพิษสุนัขบ้า`);
  L.push(`----------------`);
  if (exposureCat === "1") {
    L.push(`- ${t("messages.cat1NoPEP")}`);
  } else {
    L.push(`- แผน: ${decision.regimen?.label || "-"}`);
    L.push(`- RIG: ${decision.needRIG ? t("messages.rigYes") : t("messages.rigNo")}`);
    if (startDate && rabiesDates?.length) {
      L.push(`- นัด (เริ่ม ${d(startDate)}):`);
      rabiesDates.forEach((x, i) => L.push(`   • เข็มที่ ${i + 1}: ${d(x)}`));
    }
    if (decision.stopNote) L.push(`- หมายเหตุ: ${decision.stopNote}`);
  }
  L.push(``);
  L.push(`วัคซีนบาดทะยัก`);
  L.push(`--------------`);
  L.push(`- ประวัติ: ${tetDoseLabel}${tetRecentLabel && tetRecentLabel !== "-" ? ` • ${tetRecentLabel}` : ""}`);
  if (decision.tetanus?.need) {
    L.push(`- แผน: ${decision.tetanus.label}`);
    if (startDate && tetDates?.length) {
      L.push(`- นัด:`);
      tetDates.forEach((x, i) => L.push(`   • เข็มที่ ${i + 1}: ${d(x)}`));
    }
  } else {
    L.push(`- ${decision.tetanus?.label || t("labels.tetanusNone")}`);
  }
  return L.join("\n");
}
