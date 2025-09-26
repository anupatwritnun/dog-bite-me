import { REGIMENS } from "../utils/animal";

// ---------- Helper: Tetanus decision ----------
function computeTetanusPlan(doses, recent) {
  // ทำให้ค่าที่รับมาสะอาดก่อนเทียบ
  const norm = (v) => String(v ?? "").toLowerCase().replace(/\s+/g, "");

  const d = norm(doses);   // "0","1","2",">=3","≥3"
  const r = norm(recent);  // "<=5y","≤5y",">5y"

  // แปลงเป็นค่ามาตรฐาน
  const dosesN =
    d === ">=3" || d === "≥3" ? 3 :
    Number.isFinite(Number(d)) ? Number(d) : 0;

  const recentOver5 =
    r === ">5y" || r === ">5yr" || r === ">5years" || r === "gt5y";

  const recentWithin5 =
    r === "<=5y" || r === "≤5y" || r === "le5y";

  // ตัดสินใจ
  if (dosesN < 3) {
    return {
      need: true,
      code: "SERIES",
      label: "ฉีดบาดทะยัก 3 เข็ม (Td/Tdap) — Day 0, 1 เดือน, 6 เดือน",
      offsets: [0, 30, 180],
    };
  }

  // ครบ ≥3 เข็มแล้ว
  if (recentOver5) {
    return {
      need: true,
      code: "BOOSTER",
      label: "ฉีดบาดทะยักกระตุ้น 1 เข็ม (Td/Tdap)",
      offsets: [0],
    };
  }

  if (recentWithin5) {
    return {
      need: false,
      code: "NONE",
      label: "ไม่จำเป็นต้องฉีดบาดทะยักเพิ่ม (ครบ ≥ 3 เข็ม และภายใน 5 ปี)",
      offsets: [],
    };
  }

  return {
    need: false,
    code: "UNKNOWN",
    label: "กรุณาระบุช่วงเวลาการฉีดเข็มล่าสุด",
    offsets: [],
  };
}

// ---------- Main function ----------
export function decide(state) {
  const out = {
    category: state.exposureCat,
    needPEP: false,
    needVaccine: false,
    needRIG: false,
    regimen: null,
    stopNote: null,
    notes: [],
    tetanus: { need: false, label: "", offsets: [] },
  };

  // ---------- Rabies ----------
  if (state.animalType === "non_mammal") {
    out.notes.push("ไม่ใช่สัตว์เลี้ยงลูกด้วยนม โดยทั่วไปไม่ต้องฉีดวัคซีน");
    // Tetanus: ไม่พิจารณาใน non-mammal เช่นกัน (คงเป็น false)
    return out;
  }

  if (state.exposureCat === "1") {
    out.notes.push("กลุ่มที่ 1: ไม่ต้องฉีดวัคซีน/RIG");
    out.needPEP = false;
    out.needVaccine = false;
    out.needRIG = false;

    // ---------- Tetanus ----------
    // ตามข้อกำหนดใหม่: Cat 1 ไม่ต้องพิจารณา Tetanus
    out.tetanus = {
      need: false,
      code: "SKIP_CAT1",
      label: "กลุ่มที่ 1: ไม่จำเป็นต้องฉีดบาดทะยัก",
      offsets: [],
    };

    return out;
  }

  // Cat 2/3
  out.needPEP = true;
  out.needVaccine = true;

  if (state.priorVaccination === "<=6m") {
    out.regimen = REGIMENS.BOOSTER_1;
  } else if (state.priorVaccination === ">6m") {
    out.regimen = REGIMENS.BOOSTER_2;
  } else {
    out.regimen = state.regimenChoice || REGIMENS.IM_ESSEN;
  }

  out.needRIG = state.exposureCat === "3";

  const isDog = state.animalType === "dog";
  const isCat = state.animalType === "cat";
  if ((isDog || isCat) && state.animalObservable10d === "yes") {
    out.stopNote = "ถ้าสุนัข/แมวปกติดีครบ 10 วัน แพทย์อาจพิจารณาหยุดคอร์ส";
  }
  if (state.immunocompromised) {
    out.notes.push("ภูมิคุ้มกันบกพร่อง: แนะนำ IM และควบคุมคอร์สให้ครบ");
  }

  // ---------- Tetanus ----------
  // ใช้ตรรกะ Tetanus เฉพาะ Cat 2/3 เท่านั้น
  out.tetanus = computeTetanusPlan(state.tetanusDoses, state.tetanusRecent);

  return out;
}
