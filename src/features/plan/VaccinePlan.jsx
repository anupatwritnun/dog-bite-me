import React from "react";
import Card from "../../components/Card";
import { REGIMENS } from "../../utils/animal";
import { formatDateISO } from "../../utils/format";
import { track } from "../../utils/analytics";

export default function VaccinePlan({
  t, lang,
  exposureCat, priorVaccination,
  decision, regimenChoice, setRegimenChoice,
  startDate, effectiveDays, addDaysISO
}) {
  // pick regimen to display (existing behavior)
  const displayRegimen =
    regimenChoice || decision.regimen || decision.suggestedRegimen || null;

  // catch phrase box
  const needRabies = decision.needPEP && exposureCat !== "1";
  const highlightClass = needRabies
    ? "bg-red-50 border border-red-200 text-red-900"
    : "bg-emerald-50 border border-emerald-200 text-emerald-900";
  const catchText = needRabies ? t("rabies.needYes") : t("rabies.needNo");

  // helper: build localized label for any regimen object {id, days}
  const labelForRegimen = (r) =>
    r
      ? t(`plan.regimens.${r.id}`, { days: (r.days || []).join(",") })
      : "-";

  // options: only the two primary regimens for naive patients
  const REGIMEN_OPTS = [REGIMENS.IM_ESSEN, REGIMENS.ID_TRC].map((r) => ({
    id: r.id,
    label: labelForRegimen(r),
    _raw: r
  }));

  return (
    <Card title={t("sections.planTitle")} icon="💉">
      <div className={`rounded-xl p-4 mb-3 ${highlightClass}`}>
        <p className="font-bold text-lg mb-3">{catchText}</p>

        {exposureCat === "1" ? (
          <div className="text-sm">{t("messages.cat1NoPEP")}</div>
        ) : (
          <>
            {priorVaccination !== "never" ? (
              <>
                <p className="text-sm font-medium mb-1">
                  {t("labels.plan")}: {labelForRegimen(displayRegimen)}
                </p>
                {decision.needRIG && (
                  <p className="text-sm font-medium">
                    {t("labels.rig")}: {t("messages.needRIGTitle")}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-sm font-medium mb-2">
                  {t("labels.chooseRegimen")}
                </p>

                <div className="grid sm:grid-cols-2 gap-3">
                  {REGIMEN_OPTS.map((opt) => {
                    const selected = displayRegimen?.id === opt.id;
                    return (
                      <label
                        key={opt.id}
                        className={`p-3 border rounded-xl cursor-pointer ${
                          selected
                            ? "bg-slate-900 text-white border-slate-900"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          className="hidden"
                          checked={selected}
                          onChange={() => {
                            setRegimenChoice(opt._raw);
                            track("Select Regimen", { regimen: opt.id });
                          }}
                        />
                        <p className="font-medium">{opt.label}</p>
                      </label>
                    );
                  })}
                </div>

                {decision.needRIG && (
                  <div className="p-4 mt-3 rounded-xl bg-rabies-50 border border-rabies-200 text-rabies-900 text-sm">
                    <p className="font-semibold">{t("messages.needRIGTitle")}</p>
                    <p>{t("messages.needRIGDetail")}</p>
                  </div>
                )}
              </>
            )}

            {needRabies && startDate && (effectiveDays?.length > 0) && (
              <div className="rounded-2xl border p-4 bg-gray-50 mt-3">
                <p className="text-sm font-medium">
                  {t("fields.realAppt", { date: formatDateISO(startDate, lang) })}
                </p>
                <ul className="list-disc pl-5 text-sm mt-1">
                  {effectiveDays.map((d, i) => {
                    const iso = addDaysISO(startDate, d);
                    return (
                      <li key={i}>
                        {t("labels.dayLine", {
                          d,
                          date: formatDateISO(iso, lang),
                        })}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
