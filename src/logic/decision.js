import { REGIMENS } from "../utils/animal";

export function decide(state) {
  const out = {
    category: state.exposureCat,
    needPEP: false,
    needVaccine: false,
    needRIG: false,
    regimen: null,              // fixed regimen (ใช้กับบูสเตอร์)
    suggestedRegimen: null,     // แนะนำเริ่มต้นกรณี never
    stopNote: null,
    notes: [],
    tetanus: null,              // เติมจาก logic ของคุณเองได้ ถ้ายังไม่มีปล่อย null
  };

  // Non-mammal: no rabies vax
  if (state.animalType === "non_mammal") {
    out.notes.push("ไม่ใช่สัตว์เลี้ยงลูกด้วยนม โดยทั่วไปไม่ต้องฉีดวัคซีน");
    return out;
  }

  // Cat 1: no PEP
  if (state.exposureCat === "1") {
    out.notes.push("กลุ่มที่ 1: ไม่ต้องฉีดวัคซีน/RIG");
    return out;
  }

  // Prior vaccination: boosters (fixed, no choice)
  if (state.priorVaccination === "<=6m") {
    out.needPEP = true;
    out.needVaccine = true;
    out.needRIG = false;
    out.regimen = REGIMENS.BOOSTER_1;
    return out;
  }
  if (state.priorVaccination === ">6m") {
    out.needPEP = true;
    out.needVaccine = true;
    out.needRIG = state.exposureCat === "3";
    out.regimen = REGIMENS.BOOSTER_2;
    return out;
  }

  // Never vaccinated: let user choose IM/ID
  out.needPEP = true;
  out.needVaccine = true;
  out.needRIG = state.exposureCat === "3";
  out.suggestedRegimen = REGIMENS.IM_ESSEN;

  // 10-day observation note
  const isDogOrCat = state.animalType === "dog" || state.animalType === "cat";
  if (isDogOrCat && state.animalObservable10d === "yes") {
    out.stopNote = "ถ้าสุนัข/แมวปกติดีครบ 10 วัน แพทย์อาจพิจารณาหยุดคอร์ส";
  }

  if (state.immunocompromised) {
    out.notes.push("ภูมิคุ้มกันบกพร่อง: แนะนำ IM และควบคุมคอร์สให้ครบ");
  }

  return out;
}
