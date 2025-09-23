import React from "react";

export default function LangSwitcher({ lang, setLang, label }) {
  return (
    <div className="fixed top-2 right-2 z-50">
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="border rounded-lg px-2 py-1 text-xs bg-white shadow-sm"
        title={label}
      >
        <option value="th">ไทย</option>
        <option value="en">English</option>
        <option value="vi">Tiếng Việt</option>
        <option value="km">Khmer</option>
        <option value="lo">Lao</option>
        <option value="my">Myanmar</option>
      </select>
    </div>
  );
}
