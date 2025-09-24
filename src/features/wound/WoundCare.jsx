import React from "react";
import Card from "../../components/Card";

export default function WoundCare({ t }) {
  return (
    <Card title={t("sections.washTitle")} icon="🩹" tone="info">
      <div className="text-sm space-y-3 bg-sky-50 border border-sky-200 rounded-xl p-4 text-sky-900">
        <p>
          ล้างแผลด้วยน้ำสะอาด ฟอกด้วยสบู่หลายครั้งทันที ล้างทุกแผลให้ลึกถึงก้นแผลอย่างน้อย 15 นาที
          หลีกเลี่ยงการถูแรงจนแผลช้ำ จากนั้นเช็ดแผลด้วยน้ำยาฆ่าเชื้อ เช่น
          <em> povidone iodine</em> หรือ <em>hibitane in water</em> หากไม่มีให้ใช้
          <em> 70% alcohol</em>
        </p>

        {/* รูปภาพสาธิต แทนวิดีโอ YouTube */}
        <a href="/woundcare.jpg" target="_blank" rel="noreferrer" className="block">
          <img
            src="/woundcare.jpg"
            alt="ตัวอย่างขั้นตอนการล้างแผลจากการถูกสัตว์กัด/ข่วน"
            className="w-full max-h-[420px] object-cover rounded-xl border border-sky-200 shadow-sm"
            loading="lazy"
          />
        </a>

        <p className="text-xs text-sky-700">
          คลิกรูปเพื่อเปิดขนาดเต็มในแท็บใหม่
        </p>
      </div>
    </Card>
  );
}
