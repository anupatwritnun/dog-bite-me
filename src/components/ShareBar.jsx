import React from "react";

const APP_URL = "https://dog-bite-me.vercel.app/"; // your deployed domain
const url = encodeURIComponent(APP_URL);
const text = encodeURIComponent("เช็กความเสี่ยงพิษสุนัขบ้าและแผนวัคซีนแบบเร็ว");

function IconBtn({ href, onClick, title, src, alt }) {
  const common =
    "inline-flex items-center justify-center w-10 h-10 rounded-lg border bg-white hover:bg-slate-50";
  if (href) {
    return (
      <a className={common} href={href} target="_blank" rel="noreferrer" title={title}>
        <img src={src} alt={alt} className="w-5 h-5" />
      </a>
    );
  }
  return (
    <button className={common} onClick={onClick} title={title}>
      <img src={src} alt={alt} className="w-5 h-5" />
    </button>
  );
}

export default function ShareBar() {
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(APP_URL);
      alert("คัดลอกลิงก์แล้ว");
    } catch {}
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Facebook */}
      <IconBtn
        href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
        title="แชร์บน Facebook"
        src="/icons/facebook.png"
        alt="Facebook"
      />
      {/* LINE */}
      <IconBtn
        href={`https://line.me/R/msg/text/?${text}%20${url}`}
        title="แชร์บน LINE"
        src="/icons/line.png"
        alt="LINE"
      />
      {/* X/Twitter */}
      <IconBtn
        href={`https://twitter.com/intent/tweet?url=${url}&text=${text}`}
        title="แชร์บน X/Twitter"
        src="/icons/twitter.png"
        alt="X/Twitter"
      />
      {/* General share */}
      <IconBtn
        onClick={async () => {
          if (navigator.share) {
            try {
              await navigator.share({
                title: "Dog Bite Me!",
                text: decodeURIComponent(text),
                url: APP_URL,
              });
            } catch {}
          } else {
            await copyLink();
          }
        }}
        title="แชร์/คัดลอกลิงก์"
        src="/icons/share.png"  // 🔹 use your custom share.png
        alt="Share"
      />
    </div>
  );
}
