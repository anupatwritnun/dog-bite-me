import React from "react";

const AUTHOR_NAME = "Waritnun Anupat";    // ← edit me
const AUTHOR_CONTACT = "namwaafetp@gmail.com"; // ← edit me

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-4 py-6 text-xs sm:text-sm text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} {AUTHOR_NAME}</p>
        <p>
          Contact:{" "}
          <a
            href={`mailto:${AUTHOR_CONTACT}`}
            className="text-rabies-700 hover:text-rabies-800 underline"
          >
            {AUTHOR_CONTACT}
          </a>
        </p>
      </div>
    </footer>
  );
}
