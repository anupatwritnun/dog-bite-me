import React from "react";
import Card from "../../components/Card";
import KeyRow from "../../components/KeyRow";
import { REGIMENS } from "../../utils/animal";
import { formatDateISO } from "../../utils/format";

export default function VaccinePlan({
  t, lang,
  exposureCat, priorVaccination,
  decision, regimenChoice, setRegimenChoice,
  startDate, effectiveDays, addDaysISO
}) {
  const displayRegimen =
    regimenChoice || decision.regimen || decision.suggestedRegimen || null;

  return (
    <Card title={t("sections.planTitle")} icon="💉">
      {exposureCat === "1" ? (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm">
          {t("messages.cat1NoPEP")}
        </div>
      ) : (
        <>
          {priorVaccination !== "never" ? (
            <>
              <KeyRow k={t("labels.plan")} v={displayRegimen?.label || "-"} />
              {decision.needRIG && <KeyRow k="RIG" v={t("messages.needRIGTitle")} />}
            </>
          ) : (
            <>
              <p className="text-sm font-medium mb-2">{t("labels.chooseRegimen")}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[REGIMENS.IM_ESSEN, REGIMENS.ID_TRC].map((r) => (
                  <label
                    key={r.id}
                    className={`p-3 border rounded-xl cursor-pointer ${
                      displayRegimen?.id === r.id
                        ? "bg-slate-900 text-white border-slate-900"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      className="hidden"
                      checked={displayRegimen?.id === r.id}
                      onChange={() => setRegimenChoice(r)}
                    />
                    <p className="font-medium">{r.label}</p>
                    {r.desc ? <p className="text-xs opacity-80 mt-0.5">{r.desc}</p> : null}
                  </label>
                ))}
              </div>

              {decision.needRIG && (
                <div className="p-4 mt-3 rounded-xl bg-rabies-50 border border-rabies-200 text-rabies-900 text-sm">
                  <p className="font-semibold">{t("messages.needRIGTitle")}</p>
                  <p>{t("messages.needRIGDetail")}</p>
                </div>
              )}
            </>
          )}

          {decision.needPEP && startDate && (effectiveDays?.length > 0) && (
            <div className="rounded-2xl border p-4 bg-gray-50 mt-3">
              <p className="text-sm font-medium">
                {t("fields.realAppt", { date: formatDateISO(startDate, lang) })}
              </p>
              <ul className="list-disc pl-5 text-sm mt-1">
                {effectiveDays.map((d, i) => {
                  const iso = addDaysISO(startDate, d);
                  return (
                    <li key={i}>{t("labels.dayLine", { d, date: formatDateISO(iso, lang) })}</li>
                  );
                })}
              </ul>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
