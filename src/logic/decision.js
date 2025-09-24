import { REGIMENS } from "../utils/animal";

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
    return out;
  }

  if (state.exposureCat === "1") {
    out.notes.push("กลุ่มที่ 1: ไม่ต้องฉีดวัคซีน/RIG");
  } else {
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
  }

  const isDog = state.animalType === "dog";
  const isCat = state.animalType === "cat";
  if ((isDog || isCat) && state.animalObservable10d === "yes") {
    out.stopNote = "ถ้าสุนัข/แมวปกติดีครบ 10 วัน แพทย์อาจพิจารณาหยุดคอร์ส";
  }
  if (state.immunocompromised) {
    out.notes.push("ภูมิคุ้มกันบกพร่อง: แนะนำ IM และควบคุมคอร์สให้ครบ");
  }

  // ---------- Tetanus ----------
  const doses = state.tetanusDoses;   // "0" | "1" | "2" | ">=3"
  const recent = state.tetanusRecent; // "<=5y" | ">5y" (use only when doses === ">=3")

  if (doses === "0" || doses === "1" || doses === "2") {
    out.tetanus = {
      need: true,
      label: "ฉีดบาดทะยัก 3 เข็ม (Td/Tdap) — Day 0, 1 เดือน, 6 เดือน",
      offsets: [0, 30, 180],
    };
  } else if (doses === ">=3") {
    if (recent === ">5y") {
      out.tetanus = {
        need: true,
        label: "ฉีดบาดทะยักกระตุ้น 1 เข็ม (Td/Tdap)",
        offsets: [0],
      };
    } else if (recent === "<=5y") {
      out.tetanus = {
        need: false,
        label: "ไม่จำเป็นต้องฉีดบาดทะยักเพิ่ม (ครบ ≥ 3 เข็ม และภายใน 5 ปี)",
        offsets: [],
      };
    } else {
      out.tetanus = {
        need: false,
        label: "กรุณาระบุช่วงเวลาการฉีดเข็มล่าสุด",
        offsets: [],
      };
    }
  } else {
    out.tetanus = {
      need: false,
      label: "ข้อมูลประวัติบาดทะยักไม่ครบ",
      offsets: [],
    };
  }

  return out;
}
