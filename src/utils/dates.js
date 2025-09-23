export function toThaiDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const pad2 = (n) => String(n).padStart(2, "0");
export const toISODate = (d) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

export const todayISO = () => toISODate(new Date());

export const yesterdayISO = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toISODate(d);
};

export const tomorrowISO = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toISODate(d);
};

export function addDaysISO(baseISO, days) {
  if (!baseISO) return null;
  const b = new Date(baseISO);
  const d = new Date(b.getFullYear(), b.getMonth(), b.getDate() + days, 9, 0, 0);
  return d.toISOString();
}
