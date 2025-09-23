import React from "react";
import Card from "../../components/Card";

export default function Services({ t }) {
  return (
    <Card title={t("sections.service")}>
      <div className="flex flex-col gap-3">
        <button
          className="px-4 py-2 rounded-xl bg-gray-900 text-white"
          onClick={() => {
            const q = encodeURIComponent("คลินิกทั่วไป/โรงพยาบาล ใกล้ฉัน");
            window.open(`https://www.google.com/maps/search/${q}`, "_blank");
          }}
        >
          {t("ui.openMap")}
        </button>
        <a href="tel:1422" className="px-4 py-2 rounded-xl bg-gray-200 text-center">
          {t("ui.tel1422")}
        </a>
        <p className="text-sm text-rose-700">
          หากพบสัตว์มีอาการสงสัย: ให้แจ้งเจ้าหน้าที่กรมปศุสัตว์ หรือโทร สายด่วน 063-225-6888
        </p>
      </div>
    </Card>
  );
}
