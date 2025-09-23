export default function Stepper() {
  const items = ["A", "E", "B+C", "G", "H", "FAQ", "MAP", "REF"];
  return (
    <div className="grid grid-cols-8 gap-1 text-[10px] text-gray-500 select-none">
      {items.map((it, idx) => (
        <div
          key={it}
          className={`h-1.5 rounded ${idx <= 7 ? "bg-gray-900" : "bg-gray-200"}`}
        ></div>
      ))}
    </div>
  );
}
