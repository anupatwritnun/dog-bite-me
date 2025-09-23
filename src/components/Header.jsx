import React from "react";

export default function Header() {
  return (
    <header className="w-full py-10 bg-white">
      <div className="max-w-5xl mx-auto px-4 flex flex-col items-center">
        <div className="flex items-center gap-3">
          <span className="text-5xl leading-none">🐶</span>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900">
            Dog Bite Me!
          </h1>
        </div>
        <p className="mt-3 text-slate-600 text-base sm:text-lg text-center">
          ช่วยประเมินความเสี่ยง วางแผนวัคซีน และขั้นตอนดูแลเมื่อถูกสัตว์กัด
        </p>
      </div>
    </header>
  );
}
