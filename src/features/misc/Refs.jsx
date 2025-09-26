import React from "react";
import Card from "../../components/Card";
import { Download } from "lucide-react";


/**
 * References list.
 * Multilang-friendly:
 * - Title: t("sections.refsTitle") or fallback "References"
 * - Optional array of links: t("refs.links") => [{ href, label, note }]
 * - Optional intro text: t("refs.intro")
 * - Fallback: shows the previous single reference card if no i18n links provided
 */
export default function Refs({ t }) {
  const title = t("sections.refs") || "References";
  const intro = t("refs.thaiRedCross");
  const links = t("refs.thaiRedCross"); // expect an array of { href, label, note? }

  const isArray = Array.isArray(links) && links.length > 0;

  return (
    <section className="mt-10">
      <Card icon="🔗"  tone="info">
        {intro ? (
          <p className="text-sm text-slate-700 mb-3">{intro}</p>
        ) : null}

        {isArray ? (
          <ul className="space-y-2 text-sm">
            {links.map((it, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <div>
                  <a
                    href={it.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-800 underline underline-offset-2 hover:text-slate-900"
                  >
                    {it.label || it.href}
                  </a>
                  {it.note ? (
                    <div className="text-xs text-slate-500">{it.note}</div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          /* Fallback to the previous single-link card layout you used */
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src="/ref.png"
              alt={title}
              className="w-full sm:w-40 rounded-lg border border-slate-200 shadow-sm"
            />
            <div className="text-xs sm:text-sm text-slate-700">
              <a
  href="https://drive.google.com/file/d/1xmnQJaKxMxxTQbahXY5CPVguRO42IHLe/view?usp=sharing"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
>
  <Download className="w-4 h-4 opacity-70" />
  <span>{t("refs.defaultLabel") || "Download guideline (Saovabha Institute)"}</span>
</a>

            </div>
          </div>
        )}
      </Card>
    </section>
  );
}
