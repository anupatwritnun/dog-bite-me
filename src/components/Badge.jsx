export default function Badge({ children, tone = "default" }) {
  const m = {
    default: "bg-gray-100 text-gray-800",
    green: "bg-emerald-100 text-emerald-800",
    yellow: "bg-amber-100 text-amber-800",
    red: "bg-rose-100 text-rose-800",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${m[tone]}`}
    >
      {children}
    </span>
  );
}
