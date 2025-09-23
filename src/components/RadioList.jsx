export default function RadioList({ name, value, onChange, options }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((opt) => {
        if (opt.suboptions) {
          const isActive = typeof value === "string" && value.startsWith("other:");
          return (
            <div
              key={opt.id}
              className={`p-3 rounded-2xl border ${
                isActive
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <label className="font-medium block mb-1">{opt.label}</label>
              <select
                value={isActive ? value : ""}
                onChange={(e) => onChange(e.target.value || "other")}
                className="w-full border rounded-xl p-2 text-sm text-gray-900"
              >
                <option value="">-- เลือก --</option>
                {opt.suboptions.map((s, i) => (
                  <option key={i} value={`other:${s}`}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        return (
          <label
            key={opt.id}
            className={`p-3 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
              value === opt.id
                ? "bg-zinc-900 text-white border-zinc-900"
                : "border-zinc-200 hover:border-zinc-300"
            }`}
          >
            <input
              type="radio"
              className="sr-only"
              name={name}
              checked={value === opt.id}
              onChange={() => onChange(opt.id)}
            />
            <span className="text-sm sm:text-base">{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}
