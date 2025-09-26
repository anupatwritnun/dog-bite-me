import React from "react";
import Refs from "./Refs.jsx";
import Feedback from "./Feedback.jsx";

/**
 * Backward-compatible wrapper:
 * If some page still imports RefsFeedback, it will render Refs + Feedback.
 * Accepts { t } and passes through to children.
 */
export default function RefsFeedback({ t }) {
  return (
    <>
      <Refs t={t} />
      <Feedback t={t} />
    </>
  );
}
