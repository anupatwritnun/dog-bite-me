import React from "react";
import Card from "../../components/Card";

export default function WoundCare({ t }) {
  return (
    <Card title={t("sections.washTitle")} icon="🩹" tone="info">
      <div className="text-sm space-y-2 bg-sky-50 border border-sky-200 rounded-xl p-4 text-sky-900">
        <p className="font-medium">การล้างแผล</p>
        <p>
          ล้างแผลด้วยน้ำสะอาด ฟอกด้วยสบู่หลายครั้งทันที ล้างทุกแผลและให้ลึกถึงก้นแผลนานอย่างน้อย
          15 นาที หลีกเลี่ยงการถูแรงจนแผลช้ำ จากนั้นเช็ดแผลด้วยน้ำยาฆ่าเชื้อ เช่น
          <em> povidone iodine</em> หรือ <em>hibitane in water</em> ถ้าไม่มีให้ใช้
          <em> 70% alcohol</em>
        </p>
        <div className="mt-3">
          <iframe
            className="w-full h-64 rounded-xl"
            src="https://www.youtube.com/embed/IlPGGuuWesg"
            title="การล้างแผลพิษสุนัขบ้า"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </div>
    </Card>
  );
}
