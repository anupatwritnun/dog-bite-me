import React from "react";
import Card from "../../components/Card";

/**
 * Feedback section.
 * Embeds the Google Form directly (preview).
 */
export default function Feedback({ t }) {
  const note = t("feedback.subtitle") || "We value your feedback. Please share your thoughts:";

  return (
    <section className="mt-10">
      <Card icon="💬" tone="info">
        {/* Subtitle */}
        <p className="text-sm text-slate-700 mb-3">{note}</p>

        {/* Embedded Google Form */}
        <div className="w-full h-[600px]">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSeJcLkLyEuAM71K65FNjYvrZCUOoyaQzvQgg8PgK4JC1jQGXw/viewform?embedded=true"
            width="100%"
            height="100%"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
          >
            Loading…
          </iframe>
        </div>
      </Card>
    </section>
  );
}
