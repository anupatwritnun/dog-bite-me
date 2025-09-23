import { useEffect } from "react";
import { toThaiDate } from "../utils/dates";

export default function SegmentedDate({
  label,
  mode,
  setMode,
  date,
  setDate,
  options,
}) {
  useEffect(() => {
    if (mode && options.find((o) => o.id === mode)?.getISO) {
      const iso = options.find((o) => o.id === mode).getISO();
      setDate(iso);
    }
  }, [mode]);

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => setMode(o.id)}
            className={`px-3 py-1.5 rounded-xl border ${
              mode === o.id
                ? "bg-gray-900 text-white border-gray-900"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      {mode === "custom" && (
        <input
          type="date"
          value={date || ""}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border rounded-xl p-2"
        />
      )}
      {date && mode !== "custom" && (
        <p className="text-xs text-gray-500">{toThaiDate(date)}</p>
      )}
    </div>
  );
}
