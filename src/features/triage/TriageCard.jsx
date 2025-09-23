import React from "react";
import Card from "../../components/Card";
import RadioList from "../../components/RadioList";
import SegmentedDate from "../../components/SegmentedDate";

export default function TriageCard({
  t,
  EXPOSURES,
  ANIMAL_OPTIONS,
  todayISO,
  yesterdayISO,
  exposureCat, setExposureCat,
  animalType, setAnimalType,
  expMode, setExpMode,
  exposureDate, setExposureDate,
  startMode, setStartMode,
  startDatePreview,
  onConfirm,         // เรียกเมื่อผู้ใช้กดปุ่มยืนยัน
  confirmed,         // true = กดแล้ว ให้ปุ่มดำค้าง
  onResetConfirm,    // เรียกรีเซ็ตสถานะเมื่อมีการเลือกใหม่
}) {
  // ถ้าเปลี่ยนกลุ่ม ให้รีเซ็ตสถานะยืนยัน
  const handleSetExposure = (val) => {
    if (onResetConfirm) onResetConfirm();
    setExposureCat(val);
  };

  return (
    <Card
      title={t("sections.triageTitle")}
      subtitle={t("sections.triageSubtitle")}
      icon="🐾"
    >
      {/* เผื่อพื้นที่ให้แถบปุ่ม sticky อยู่ในกรอบการ์ดเสมอ */}
      <div className="grid gap-6 pb-16">
        <div>
          <p className="font-medium mb-2">{t("fields.exposureType")}</p>
          <RadioList
            name="expo"
            value={exposureCat}
            onChange={handleSetExposure}
            options={EXPOSURES}
          />
        </div>

        <div>
          <p className="font-medium mb-2">{t("fields.animalType")}</p>
          <RadioList
            name="animal"
            value={animalType}
            onChange={setAnimalType}
            options={ANIMAL_OPTIONS}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <SegmentedDate
            label={t("fields.exposureDate")}
            mode={expMode}
            setMode={setExpMode}
            date={exposureDate}
            setDate={setExposureDate}
            options={[
              { id: "today", label: t("fields.today"), getISO: todayISO },
              { id: "yesterday", label: t("fields.yesterday"), getISO: yesterdayISO },
              { id: "custom", label: t("fields.pickDate") },
            ]}
          />

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("fields.startDay0")}
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {["same", "tomorrow", "custom"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setStartMode(mode)}
                  className={`px-3 py-1.5 rounded-xl border ${
                    startDatePreview.mode === mode
                      ? "bg-slate-900 text-white border-slate-900"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {mode === "same"
                    ? t("fields.today")
                    : mode === "tomorrow"
                    ? t("fields.tomorrow")
                    : t("fields.pickDate")}
                </button>
              ))}
            </div>
            {startDatePreview.customInput}
            {startDatePreview.hint}
            <div className="mt-2 rounded-xl border border-red-200 bg-red-50 text-red-700 p-3 text-xs sm:text-sm">
  <strong className="font-semibold">
    {t("messages.warning").split(":")[0]}:
  </strong>{" "}
  {t("messages.warning").split(":").slice(1).join(":").trim()}
</div>

          </div>
        </div>
      </div>

      {/* แถบปุ่ม sticky ที่ก้นการ์ด */}
      <div className="sticky bottom-3 left-0 right-0 z-10">
        <div className="mx-[-1.25rem] sm:mx-[-1.5rem] rounded-b-2xl">
          <div
            className="px-5 sm:px-6 py-3 flex items-center gap-3
                       bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60
                       border-t border-slate-200 rounded-b-2xl"
          >
            <button
              onClick={onConfirm}
              disabled={!exposureCat}
              className={`px-4 py-2 rounded-xl transition-colors ${
                !exposureCat
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : confirmed
                  ? "bg-black text-white"
                  : "bg-slate-400 hover:bg-slate-500 text-white"
              }`}
            >
              {t("ui.next")}
            </button>

            {exposureCat ? (
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm border ${
                  exposureCat === "1"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : exposureCat === "2"
                    ? "bg-amber-50 text-amber-900 border-amber-200"
                    : "bg-rabies-50 text-rabies-900 border-rabies-200"
                }`}
              >
                {t("fields.group", { n: exposureCat })}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}
