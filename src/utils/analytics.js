// src/utils/analytics.js
export function track(eventName, props) {
  try {
    window.plausible && window.plausible(eventName, props ? { props } : undefined);
  } catch { /* no-op */ }
}

let pageProps = {};
export function setPageProps(newProps) {
  pageProps = { ...pageProps, ...newProps };
  // ส่ง pageview props รอบถัดไป Plausible จะติดไปอัตโนมัติบน SPA
  try {
    window.plausible && window.plausible('pageview', { props: pageProps });
  } catch { /* no-op */ }
}

export function getPageProps() {
  return { ...pageProps };
}
