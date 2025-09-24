// utils/print.js
import { formatDateISO } from "./format";

// เดิมของคุณ (คงไว้):
export const defaultPageStyle = `
  @page { margin: 16mm; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  pre { font-size: 14px; line-height: 1.7; }
`;

// ========== ใหม่: พิมพ์ผ่าน iframe ==========
export function printNode(node, title = "สรุปแผนการรักษา", extraStyle = defaultPageStyle) {
  if (!node) return false;
  // สร้าง iframe ซ่อน
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  // ดึงสไตล์ที่หน้าปัจจุบันใช้อยู่ (Tailwind/Fonts) ให้ติดไปด้วยเท่าที่จำเป็น
  const cssLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map(el => el.outerHTML)
    .join("\n");

  doc.write(`
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        ${cssLinks}
        <style>${extraStyle}</style>
      </head>
      <body>
        ${node.outerHTML}
      </body>
    </html>
  `);
  doc.close();

  // ให้เบราว์เซอร์วาดก่อนแล้วค่อยสั่ง print
  const win = iframe.contentWindow;
  const doPrint = () => {
    try { win.focus(); } catch {}
    win.print();
    // ลบ iframe หลังพิมพ์ (เผื่อบางเบราว์เซอร์ไม่ยิง onafterprint)
    setTimeout(() => document.body.removeChild(iframe), 1000);
  };

  // เผื่อโหลดช้า
  if (win.document.readyState === "complete") {
    setTimeout(doPrint, 50);
  } else {
    win.onload = () => setTimeout(doPrint, 50);
  }
  return true;
}

// คง util อื่นๆ ไว้ (เผื่อใช้ที่หน้าอื่น)
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
