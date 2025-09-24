import React from "react";

const APP_URL = "https://dog-bite-me.vercel.app/"; // change if you use a custom domain
const url = encodeURIComponent(APP_URL);
const text = encodeURIComponent("เช็กความเสี่ยงพิษสุนัขบ้าและแผนวัคซีนแบบเร็ว");

export default function ShareBar() {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <a
        className="px-3 py-1.5 rounded-lg border bg-white hover:bg-slate-50"
        href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Share on Facebook"
      >
        Facebook
      </a>
      <a
        className="px-3 py-1.5 rounded-lg border bg-white hover:bg-slate-50"
        href={`https://line.me/R/msg/text/?${text}%20${url}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Share on LINE"
      >
        LINE
      </a>
      <a
        className="px-3 py-1.5 rounded-lg border bg-white hover:bg-slate-50"
        href={`https://twitter.com/intent/tweet?url=${url}&text=${text}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Share on X"
      >
        X/Twitter
      </a>
      <button
        onClick={async () => {
          if (navigator.share) {
            try { await navigator.share({ title: "Dog Bite Me!", text: decodeURIComponent(text), url: APP_URL }); } catch {}
          } else {
            await navigator.clipboard.writeText(APP_URL);
            alert("คัดลอกลิงก์แล้ว");
          }
        }}
        className="px-3 py-1.5 rounded-lg border bg-slate-900 text-white hover:bg-slate-800"
      >
        แชร์/คัดลอกลิงก์
      </button>
    </div>
  );
}
