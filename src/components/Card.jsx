import React from "react";

export default function Card({ title, subtitle, icon, tone, children }) {
  const toneClass =
    tone === "info"
      ? "border-sky-200 bg-white"
      : tone === "warn"
      ? "border-amber-200 bg-white"
      : tone === "danger"
      ? "border-rabies-200 bg-white"
      : "border-slate-200 bg-white";

  return (
    <section className={`rounded-2xl border ${toneClass} p-5 sm:p-6 mb-6 shadow-sm`}>
      {(title || subtitle) && (
        <header className="mb-3">
          <div className="flex items-center gap-2">
            {icon ? <span className="text-2xl leading-none">{icon}</span> : null}
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">{title}</h2>
          </div>
          {subtitle ? (
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          ) : null}
        </header>
      )}
      <div>{children}</div>
    </section>
  );
}
