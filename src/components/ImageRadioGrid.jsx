import React, { useState } from "react";

export default function ImageRadioGrid({ name, value, onChange, options = [] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((opt) => (
        <ImageRadioCard
          key={opt.id}
          name={name}
          selected={value === opt.id}
          onSelect={() => onChange(opt.id)}
          label={opt.label}
          images={Array.isArray(opt.img) ? opt.img : opt.img ? [opt.img] : []}
        />
      ))}
    </div>
  );
}

function ImageRadioCard({ name, selected, onSelect, label, images }) {
  const [idx, setIdx] = useState(0);
  const hasImgs = images && images.length > 0;

  return (
    <label
      className={`group relative block rounded-3xl overflow-hidden border transition ${
        selected ? "border-slate-900 shadow-lg" : "border-slate-200 hover:border-slate-300 shadow-sm"
      }`}
      onClick={onSelect}
    >
      <input type="radio" name={name} className="sr-only" checked={selected} readOnly />

      <div className="relative aspect-[4/3] bg-slate-100">
        {hasImgs ? (
          <img src={images[idx]} alt={label} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full grid place-content-center text-slate-400">
            <span className="text-sm">No image</span>
          </div>
        )}

        {hasImgs && (
          <div className="absolute -bottom-3 left-0 right-0 flex items-center justify-center">
            <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur border border-slate-200 shadow-sm">
              <div className="flex items-center gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIdx(i);
                    }}
                    className={`w-2.5 h-2.5 rounded-full transition ${
                      i === idx ? "bg-slate-900" : "bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 flex items-center justify-between">
        <p className={`font-semibold ${selected ? "text-slate-900" : "text-slate-800"}`}>{label}</p>
        <span
          className={`inline-flex items-center justify-center w-6 h-6 rounded-full border text-xs ${
            selected ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-500"
          }`}
          aria-hidden
        >
          {selected ? "✓" : ""}
        </span>
      </div>
    </label>
  );
}
