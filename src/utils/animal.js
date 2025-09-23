export const REGIMENS = {
  IM_ESSEN: {
    id: "IM_ESSEN",
    days: [0, 3, 7, 14, 28],
    label: "สูตรฉีดเข้ากล้าม 5 วัน — วัน 0,3,7,14,28",
  },
  ID_TRC: {
    id: "ID_TRC",
    days: [0, 3, 7, 28],
    label: "สูตรฉีดใต้ผิวหนัง 4 วัน — วัน 0,3,7,28",
  },
  BOOSTER_1: {
    id: "BOOSTER_1",
    days: [0],
    label: "Booster 1 เข็ม (≤ 6 เดือน) — Day 0",
  },
  BOOSTER_2: {
    id: "BOOSTER_2",
    days: [0, 3],
    label: "Booster 2 เข็ม (> 6 เดือน) — Day 0,3",
  },
};

export const ANIMALS = [
  { id: "dog", label: "สุนัข" },
  { id: "cat", label: "แมว" },
  {
    id: "other",
    label: "สัตว์อื่น ๆ",
    suboptions: [
      "กระต่าย",
      "หนูบ้าน",
      "หนูแฮมสเตอร์",
      "หนูตะเภา",
      "กระรอก",
      "ชูก้าร์ไกลเดอร์",
      "วัว",
      "ควาย",
      "แพะ",
      "แกะ",
      "ม้า",
      "หมู",
      "ค้างคาว",
      "ลิง",
      "กระแต",
    ],
  },
  { id: "non_mammal", label: "ไม่ใช่สัตว์เลี้ยงลูกด้วยนม" },
];

export function animalDisplay(animalType) {
  if (!animalType) return "-";
  if (animalType.startsWith("other:")) return animalType.split(":")[1];
  const found = ANIMALS.find((a) => a.id === animalType);
  return found?.label || "-";
}
