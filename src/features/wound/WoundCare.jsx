import React from "react";
import Card from "../../components/Card";
import woundImg from "../../assets/woundcare.jpg"; // <- ดึงจาก src/assets

export default function WoundCare({ t }) {
  const openFull = () => {
    // เปิดแท็บใหม่แบบกัน window.opener
    window.open(woundImg, "_blank", "noopener,noreferrer");
  };

  return (
    <Card title={t("sections.washTitle")} icon="🩹" tone="info">
      <div className="text-sm space-y-3 bg-sky-50 border border-sky-200 rounded-xl p-4 text-sky-900">
        <p>
          ล้างแผลด้วยน้ำสะอาด ฟอกด้วยสบู่หลายครั้งทันที ล้างทุกแผลให้ลึกถึงก้นแผลอย่างน้อย 15 นาที
          หลีกเลี่ยงการถูแรงจนแผลช้ำ จากนั้นเช็ดแผลด้วยน้ำยาฆ่าเชื้อ เช่น
          <em> povidone iodine</em> หรือ <em>hibitane in water</em> หากไม่มีให้ใช้
          <em> 70% alcohol</em>
        </p>

        {/* คลิกรูปเพื่อเปิดขนาดเต็มในแท็บใหม่ */}
        <button onClick={openFull} className="block w-full text-left">
          <img
            src={woundImg}
            alt="ตัวอย่างขั้นตอนการล้างแผลจากการถูกสัตว์กัด/ข่วน"
            className="w-full max-h-[420px] object-cover rounded-xl border border-sky-200 shadow-sm"
            loading="lazy"
          />
        </button>

        <div className="flex gap-2">
          <button
            onClick={openFull}
            className="px-3 py-1.5 text-xs rounded-md border border-sky-300 bg-white hover:bg-sky-50"
          >
            เปิดรูปขนาดเต็ม ↗
          </button>
          <a
            href={woundImg}
            download="woundcare.jpg"
            className="px-3 py-1.5 text-xs rounded-md border border-slate-300 bg-white hover:bg-slate-50"
          >
            ดาวน์โหลดรูป
          </a>
        </div>
      </div>
    </Card>
  );
}
