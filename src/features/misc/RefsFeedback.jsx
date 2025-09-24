import React from "react";
import Card from "../../components/Card";
import refCover from "../../assets/ref.png"; // ปกเอกสาร Thai Red Cross

export default function RefsFeedback({ t }) {
  // TODO: เปลี่ยนเป็นลิงก์ฟอร์มจริงของคุณ
  const FEEDBACK_FORM =
    "https://docs.google.com/forms/d/e/1FAIpQLSf_feedback_form_id/viewform";

  const TRC_PDF =
    "https://saovabha.com/wp-content/uploads/2017/12/rabies_guideline_2018.pdf";

  return (
    <>
      {/* References */}
      <Card title={t("sections.refs")} icon="🔗">
        <div className="flex items-start gap-4">
          <a
            href={TRC_PDF}
            target="_blank"
            rel="noreferrer"
            aria-label={t("refs.thaiRedCross")}
            className="shrink-0"
          >
            <img
              src={refCover}
              alt={t("refs.thaiRedCross")}
              loading="lazy"
              className="w-28 h-36 object-cover rounded-lg shadow"
            />
          </a>

          <div className="flex-1">
            <a
              href={TRC_PDF}
              target="_blank"
              rel="noreferrer"
              className="inline-block px-3 py-1.5 rounded-full border text-sm bg-white hover:bg-slate-50"
            >
              {t("refs.thaiRedCross")}
            </a>

            <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>{t("refs.who")}</li>
              <li>{t("refs.tetanusThai")}</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Feedback */}
      <Card title={t("sections.feedback")} icon="📝">
        <p className="text-sm text-slate-600 mb-3">
          {t("feedback.subtitle")}
        </p>
        <a
          href={FEEDBACK_FORM}
          target="_blank"
          rel="noreferrer"
          className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          aria-label={t("ui.openForm")}
        >
          {t("ui.openForm")}
        </a>
      </Card>
    </>
  );
}
