let _h2cPromise;
export function ensureHtml2Canvas() {
  if (!_h2cPromise) {
    _h2cPromise = new Promise((resolve, reject) => {
      if (window.html2canvas) return resolve(window.html2canvas);
      const s = document.createElement("script");
      s.src =
        "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
      s.async = true;
      s.onload = () => resolve(window.html2canvas);
      s.onerror = () => reject(new Error("โหลด html2canvas ไม่สำเร็จ"));
      document.head.appendChild(s);
    });
  }
  return _h2cPromise;
}

export async function saveElementAsImage(
  elementId,
  filename = "hospital-summary.png"
) {
  const h2c = await ensureHtml2Canvas();
  const el = document.getElementById(elementId);
  if (!el) {
    alert("ไม่พบส่วนที่ต้องการบันทึก");
    return;
  }
  const canvas = await h2c(el, {
    backgroundColor: "#ffffff",
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
    windowWidth: document.documentElement.clientWidth,
  });
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
