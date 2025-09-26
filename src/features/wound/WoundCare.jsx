import React from "react";
import Card from "../../components/Card";

export default function WoundCare({ t }) {
  const steps = React.useMemo(() => {
    const arr = t("wound.steps", { returnObjects: true });
    if (Array.isArray(arr) && arr.length) return arr;

    const indexed = [];
    for (let i = 0; i < 12; i++) {
      const key = `wound.steps.${i}`;
      const val = t(key);
      if (!val || val === key) break;
      indexed.push(val);
    }
    if (indexed.length) return indexed;

    const raw = t("wound.text");
    if (typeof raw === "string" && raw && raw !== "wound.text") {
      const clean = raw.replace(/\r/g, "").trim();
      const blocks = clean.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
      if (blocks.length > 1) return blocks;
      return clean.split("\n").map(s => s.trim()).filter(Boolean);
    }

    return [];
  }, [t]);

  const title = t("wound.title");
  const hasTitle = title && title !== "wound.title";

  return (
    <Card title={t("sections.washTitle")} icon="🩹" tone="info" id="wound">
      <div className="space-y-4 bg-sky-50 border border-sky-200 rounded-2xl p-5 text-sky-900">
        {hasTitle && (
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 border-b pb-1">
            {title}
          </h3>
        )}

        {steps.length > 0 ? (
          <ol className="list-decimal pl-6 space-y-3 text-base leading-relaxed">
            {steps.map((step, i) => {
              // ดึงบรรทัดแรกเป็นหัวข้อ
              const [firstLine, ...rest] = step.split("\n");
              return (
                <li key={i} className="whitespace-pre-line">
                  <span className="font-bold">{firstLine}</span>
                  {rest.length > 0 && (
                    <>
                      {"\n"}
                      {rest.join("\n")}
                    </>
                  )}
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="text-base leading-relaxed">{t("wound.text")}</p>
        )}
      </div>
    </Card>
  );
}
