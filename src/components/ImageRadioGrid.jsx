import React, { useState } from "react";

/* Named declaration so we can export both default and named */
function ImageRadioGrid({ name, value, onChange, options = [] }) {
  if (!Array.isArray(options) || options.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
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
  const [imgError, setImgError] = useState(false);
  const hasImgs = images && images.length > 0;
  const showDots = images.length > 1;

  return (
    <label
      onClick={onSelect}
      className={`relative block h-full rounded-3xl overflow-hidden border bg-white transition-all cursor-pointer
        ${active ? "border-slate-900 ring-2 ring-slate-900 shadow-xl" : "border-slate-200 hover:border-slate-300 shadow-sm"}
      `}
    >
      {/* image area: white background; image is block to kill baseline gap */}
      <div className="relative w-full h-56 sm:h-64 bg-white grid place-items-center">
        {hasImgs && !imgError ? (
          <img
            src={images[idx]}
            alt={label}
            className="block max-h-full max-w-full object-contain"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
            ไม่มีรูป
          </div>
        )}

        {/* dots pager */}
        {showDots && !imgError && (
          <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-2">
            {images.map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setImgError(false);
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

      {/* label bar: pulled up slightly to cover any seam */}
      <div className="relative bg-white px-4 py-3 min-h-14 -mt-[3px]">
        <div className="pr-10 text-[15px] font-medium text-slate-800 leading-snug break-words">
          {label}
        </div>
        <span
          className={`absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full border grid place-items-center
            ${active ? "border-slate-900" : "border-slate-300"}
          `}
        >
          <span className={`h-2.5 w-2.5 rounded-full ${active ? "bg-slate-900" : "bg-transparent"}`} />
        </span>
      </div>

      {/* real radio (hidden) */}
      <input
        type="radio"
        name={name}
        checked={active}
        readOnly
        className="sr-only"
      />
    </label>
  );
}

/* Exports: default + named to satisfy any import style */
export default ImageRadioGrid;
export { ImageRadioGrid };
