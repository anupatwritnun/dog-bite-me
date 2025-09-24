import React from "react";
import Card from "../../components/Card";

export default function Services({ t }) {
  const REPORT_PHONE = "063-225-6888"; // ใช้เป็นตัวแปร จะได้แปลข้อความแต่คงเลขได้

  return (
    <Card title={t("sections.service")}>
      <div className="space-y-3">
        <a
          href="https://maps.google.com/?q=clinic+rabies+vaccine+near+me"
          target="_blank"
          rel="noreferrer"
          className="block text-center w-full px-4 py-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800"
        >
          {t("ui.openMap")}
        </a>

        <a
          href="tel:1422"
          className="block text-center w-full px-4 py-3 rounded-2xl bg-slate-100 text-slate-800 hover:bg-slate-200"
        >
          {t("ui.tel1422")}
        </a>

        <p className="text-sm text-red-600">
          {t("services.reportWarning", { phone: REPORT_PHONE })}
        </p>
      </div>
    </Card>
  );
}
