// src/components/Shell.jsx
import React from "react";

export default function Shell({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        {children}
      </div>
    </div>
  );
}
