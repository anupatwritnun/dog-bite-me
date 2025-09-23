import React, { createContext, useCallback, useContext, useState } from "react";

// ใช้ใน App กับ LangSwitcher
export const SUPPORTED_LOCALES = ["th", "en", "vi", "km", "lo", "my"];

// ids ที่ใช้สร้างออปชันแบบ i18n ในหน้า Triage
export const EXPO_IDS = ["1", "2", "3"];
export const OBS_IDS = ["yes", "no", "unknown"];
export const PRIOR_IDS = ["never", "<=6m", ">6m"];

// dict หลัก
const dicts = {
  th: {
    ui: {
      language: "ภาษา",
      thai: "ไทย",
      english: "English",
      vietnamese: "Tiếng Việt",
      khmer: "Khmer",
      lao: "Lao",
      myanmar: "Myanmar",
      next: "ยืนยันไปขั้นต่อไป",
      copy: "คัดลอกข้อความ",
      saveImage: "บันทึกเป็นรูป",
      openMap: "เปิดแผนที่ค้นหาคลินิกใกล้ฉัน",
      tel1422: "โทร 1422 (กรมควบคุมโรค)",
      downloadICS: "ดาวน์โหลดไฟล์ .ics",
      calendarSubtitle:
        "สามารถโหลดไฟล์แล้วกดเปิดกับ Google Calendar จะแอดให้อัตโนมัติ",
    },
    sections: {
      triageTitle: "คัดกรอง", // เดิม 'คัดกรองรวม'
      triageSubtitle: "ตอบไม่กี่ข้อเพื่อได้คำแนะนำที่ตรงกับแนวทาง",
      washTitle: "ล้างแผลและดูแลทันที",
      planTitle: "การฉีดวัคซีน", // เดิม 'แผนวัคซีนและ RIG'
      calendarTitle: "ตัวคำนวณนัด (.ics)",
      hospSummary: "ใบสรุปสำหรับไปหาหมอ", // เดิม 'ใบสรุปสำหรับโรงพยาบาล'
      service: "แผนที่ / ช่องทางรับบริการ",
      refs: "อ้างอิง (สรุป)",
    },
    fields: {
      exposureType: "เลือกประเภทการสัมผัส", // เดิม 'ประเภทการสัมผัส'
      animalType: "ชนิดสัตว์",
      exposureDate: "วันถูกกัด/ข่วน",
      startDay0: "จะเริ่มฉีดวันไหน (Day 0)",
      today: "วันนี้",
      yesterday: "เมื่อวาน",
      tomorrow: "พรุ่งนี้",
      pickDate: "เลือกวันที่",
      priorVac: "ประวัติวัคซีนเดิม",
      immunocomp: "มีโรค/ยาที่กดภูมิ",
      group: "กลุ่มที่ {n}",
      realAppt: "วันนัดจริง (เริ่ม {date})",
    },
    exposures: {
      "1": "กลุ่มที่ 1: แค่สัมผัส ผิวปกติ ไม่มีแผล",
      "2": "กลุ่มที่ 2: แผลถลอก/ข่วนเล็กน้อย",
      "3": "กลุ่มที่ 3: แผลลึก มีเลือด หรือน้ำลายเข้าตา/ปาก/แผล",
    },
    obs10d: {
      yes: "กักขังเฝ้าดูได้ 10 วัน",
      no: "กักขังไม่ได้",
      unknown: "ไม่ทราบ",
    },
    prior: {
      never: "ไม่เคยฉีดมาก่อน",
      "<=6m": "เคยฉีดครบ ≤ 6 เดือน",
      ">6m": "เคยฉีดครบ > 6 เดือน",
    },
    messages: {
      cat1NoPEP: "การสัมผัสกลุ่มที่ 1: ไม่จำเป็นต้องฉีดวัคซีนหรือ RIG",
      warning:
        "คำเตือน: ฉีดเร็ว ตรงเวลา ป้องกันได้ 100% — ไม่ฉีด มีโอกาสติดเชื้อ และถ้าแสดงอาการแล้ว เสียชีวิต 100%",
      needRIGTitle: "ต้องพิจารณา RIG (Category 3)",
      needRIGDetail: "ฉีดเข้า/รอบแผลทุกแผล ในวันเดียวกับวัคซีน (Day 0)",
      rigYes: "แนะนำ (Cat 3)",
      rigNo: "ไม่ต้อง",
      summaryPEPNo: "สรุป: ไม่ต้อง PEP",
    },
    labels: {
      plan: "แผนวัคซีน",
      rig: "RIG",
      animalObs10d: "เฝ้าดูสัตว์ 10 วัน",
      immunocompYes: "ใช่",
      immunocompNo: "ไม่ใช่",
      chooseRegimen: "เลือกสูตรวัคซีน",
      dayLine: "Day {d} — {date}",
      icsTitle: "นัดฉีดวัคซีนพิษสุนัขบ้า",
    },
    animals: {
      dog: "สุนัข",
      cat: "แมว",
      bat: "ค้างคาว",
      monkey: "ลิง",
      non_mammal: "สัตว์ไม่ใช่เลี้ยงลูกด้วยนม",
      other: "สัตว์เลี้ยงลูกด้วยนม อื่นๆ เช่น ลิง หนู หมู",
    },
    refs: {
      thaiRedCross:
        "สถานเสาวภา สภากาชาดไทย. แนวทางการดูแลรักษาผู้สัมผัสโรคพิษสุนัขบ้า (พ.ศ. 2561)",
      who: "WHO Exposure Categories I/II/III",
    },
  },
  en: {
    ui: {
      language: "Language",
      thai: "ไทย",
      english: "English",
      vietnamese: "Tiếng Việt",
      khmer: "Khmer",
      lao: "Lao",
      myanmar: "Myanmar",
      next: "Continue",
      copy: "Copy text",
      saveImage: "Save as image",
      openMap: "Open map to find nearby clinics",
      tel1422: "Call 1422 (Department of Disease Control)",
      downloadICS: "Download .ics",
      calendarSubtitle:
        "Download the file and open with Google Calendar; it will be added automatically.",
    },
    sections: {
      triageTitle: "Triage",
      triageSubtitle:
        "Answer a few questions to get guidance aligned with recommendations",
      washTitle: "Immediate Wound Care",
      planTitle: "Vaccination",
      calendarTitle: "Appointment Helper (.ics)",
      hospSummary: "Summary for doctor visit",
      service: "Map / Service Channels",
      refs: "References (brief)",
    },
    fields: {
      exposureType: "Choose exposure category",
      animalType: "Animal type",
      exposureDate: "Exposure date",
      startDay0: "Start vaccination (Day 0)",
      today: "Today",
      yesterday: "Yesterday",
      tomorrow: "Tomorrow",
      pickDate: "Pick a date",
      priorVac: "Prior vaccination",
      immunocomp: "Immunocompromised",
      group: "Category {n}",
      realAppt: "Actual appointments (start {date})",
    },
    exposures: {
      "1": "Cat 1: Touching intact skin only",
      "2": "Cat 2: Minor scratches/abrasions",
      "3": "Cat 3: Deep wounds, bleeding, saliva into eye/mouth/wound",
    },
    obs10d: {
      yes: "Animal can be observed for 10 days",
      no: "Cannot be observed",
      unknown: "Unknown",
    },
    prior: {
      never: "Never completed a prior series",
      "<=6m": "Completed series ≤ 6 months",
      ">6m": "Completed series > 6 months",
    },
    messages: {
      cat1NoPEP: "Category 1 exposure: Vaccine and RIG are not required",
      warning:
        "Warning: Timely vaccination prevents rabies 100%. If symptoms develop, rabies is almost universally fatal.",
      needRIGTitle: "Consider RIG (Category 3)",
      needRIGDetail:
        "Infiltrate into/around all wounds on the same day as vaccine (Day 0)",
      rigYes: "Recommended (Cat 3)",
      rigNo: "Not needed",
      summaryPEPNo: "Summary: PEP not required",
    },
    labels: {
      plan: "Vaccine plan",
      rig: "RIG",
      animalObs10d: "10-day animal observation",
      immunocompYes: "Yes",
      immunocompNo: "No",
      chooseRegimen: "Choose a regimen",
      dayLine: "Day {d} — {date}",
      icsTitle: "Rabies vaccination appointments",
    },
    animals: {
      dog: "Dog",
      cat: "Cat",
      bat: "Bat",
      monkey: "Monkey",
      non_mammal: "Non-mammal",
      other: "Other mammals e.g. monkey, rat, pig",
    },
    refs: {
      thaiRedCross:
        "Queen Saovabha Memorial Institute (Thai Red Cross). Rabies exposure management guideline (2018)",
      who: "WHO Exposure Categories I/II/III",
    },
  },
  vi: {},
  km: {},
  lo: {},
  my: {},
};

// ---------- helpers ----------
function deepGet(obj, path) {
  const parts = path.split(".");
  let cur = obj;
  for (const k of parts) {
    if (cur && typeof cur === "object" && k in cur) cur = cur[k];
    else return undefined;
  }
  return typeof cur === "string" ? cur : undefined;
}

// แปลง id-array เป็น options พร้อม label แปลภาษา
export function mapOptions(ids, baseKey, t) {
  return ids.map((id) => ({
    id,
    label: t(`${baseKey}.${id}`),
  }));
}

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState("th");

  const t = useCallback(
    (key, vars) => {
      const raw = deepGet(dicts[lang], key) ?? deepGet(dicts.en, key) ?? key;
      if (!vars) return raw;
      return Object.entries(vars).reduce(
        (s, [k, v]) => s.replaceAll(`{${k}}`, String(v)),
        raw
      );
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
