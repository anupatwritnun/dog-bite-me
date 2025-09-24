import React, { useState } from "react";

/**
 * ImageRadioGrid
 * props:
 *  - name, value, onChange
 *  - options: [{ id, label, img?: string | string[] }]
 */
export default function ImageRadioGrid({ name, value, onChange, options = [] }) {
  if (!Array.isArray(options) || options.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {options.map((opt) => (
        <ImageRadioCard
          key={opt.id}
          name={name}
          active={value === opt.id}
          label={opt.label}
          images={Array.isArray(opt.img) ? opt.img : opt.img ? [opt.img] : []}
          onSelect={() => onChange(opt.id)}
        />
      ))}
    </div>
  );
}

function ImageRadioCard({ name, active, label, images, onSelect }) {
  const [idx, setIdx] = useState(0);
  const hasImgs = images && images.length > 0;
  const showDots = images.length > 1;

  return (
    <label
      className={`relative block rounded-3xl overflow-hidden border transition-all cursor-pointer
        ${active ? "border-slate-900 ring-2 ring-slate-900 shadow-xl" : "border-slate-200 hover:border-slate-300 shadow-sm"}
      `}
      onClick={onSelect}
    >
      {/* image area */}
      <div className="relative w-full h-56 sm:h-64 bg-slate-50">
        {hasImgs ? (
          <img
            src={images[idx]}
            alt={label}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
            ไม่มีรูป
          </div>
        )}

        {/* dots pager */}
        {showDots && (
          <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-2">
            {images.map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIdx(i);
                }}
                className={`h-2.5 w-2.5 rounded-full border ${
                  i === idx ? "bg-slate-900 border-slate-900" : "bg-white/80 border-slate-300"
                }`}
                aria-label={`ภาพที่ ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* label bar */}
      <div className="relative bg-white px-4 py-3">
        <div className="pr-8 text-[15px] font-medium text-slate-800 leading-snug">{label}</div>

        {/* custom radio mark bottom-right */}
        <span
          className={`absolute right-3 bottom-3 h-5 w-5 rounded-full border grid place-items-center
            ${active ? "border-slate-900" : "border-slate-300"}
          `}
        >
          <span className={`h-2.5 w-2.5 rounded-full ${active ? "bg-slate-900" : "bg-transparent"}`} />
        </span>
      </div>

      {/* real radio (hidden but accessible) */}
      <input type="radio" name={name} checked={active} onChange={() => {}} className="sr-only" />
    </label>
  );
}
