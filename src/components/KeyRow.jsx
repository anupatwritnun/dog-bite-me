export default function KeyRow({ k, v }) {
  return (
    <div className="grid grid-cols-3 gap-3 text-sm">
      <div className="text-gray-500">{k}</div>
      <div className="col-span-2 font-medium text-gray-900">{v}</div>
    </div>
  );
}
