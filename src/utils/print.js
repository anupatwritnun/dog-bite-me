// src/utils/print.js
// สร้าง iframe ชั่วคราว แล้วพิมพ์เฉพาะ element ที่ต้องการ
export function printElementById(elementId, title = "Hospital Summary") {
  const srcEl = document.getElementById(elementId);
  if (!srcEl) return;

  // รวมสไตล์จาก <link rel="stylesheet"> และ <style> ทั้งหมด
  const styleTags = Array.from(
    document.querySelectorAll('link[rel="stylesheet"], style')
  )
    .map((n) => n.outerHTML)
    .join("\n");

  const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<title>${title}</title>
${styleTags}
<style>
  @page { size: A4; margin: 14mm; }
  html, body { background: white !important; }
  #print-root { font-size: 12pt; color: #0f172a; }
  #print-root .rounded-2xl { border-radius: 14px; }
  #print-root .border { border-color: #cbd5e1 !important; } /* slate-300 */
  h1 { font-weight: 800; font-size: 18pt; margin: 0 0 12px 0; }
</style>
</head>
<body>
  <div id="print-root">
    <h1>${title}</h1>
    ${srcEl.outerHTML}
  </div>
</body>
</html>`;

  // สร้าง iframe
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  doc.open();
  doc.write(html);
  doc.close();

  // รอให้ style โหลดแล้วค่อยสั่งพิมพ์
  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } finally {
      setTimeout(() => document.body.removeChild(iframe), 100);
    }
  };
}
