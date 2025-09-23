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
  };

  if (state.animalType === "non_mammal") {
    out.notes.push("ไม่ใช่สัตว์เลี้ยงลูกด้วยนม โดยทั่วไปไม่ต้องฉีดวัคซีน");
    return out;
  }

  if (state.exposureCat === "1") {
    out.notes.push("กลุ่มที่ 1: ไม่ต้องฉีดวัคซีน/RIG");
    return out;
  }

  if (state.priorVaccination === "<=6m") {
    out.needPEP = true;
    out.needVaccine = true;
    out.regimen = REGIMENS.BOOSTER_1;
    return out;
  }

  if (state.priorVaccination === ">6m") {
    out.needPEP = true;
    out.needVaccine = true;
    out.regimen = REGIMENS.BOOSTER_2;
    return out;
  }

  out.needPEP = true;
  out.needVaccine = true;
  out.regimen = state.regimenChoice || REGIMENS.IM_ESSEN;
  out.needRIG = state.exposureCat === "3";

  const isDog = state.animalType === "dog";
  const isCat = state.animalType === "cat";
  if ((isDog || isCat) && state.animalObservable10d === "yes") {
    out.stopNote =
      "ถ้าสุนัข/แมวปกติดีครบ 10 วัน แพทย์อาจพิจารณาหยุดคอร์ส";
  }

  if (state.immunocompromised) {
    out.notes.push("ภูมิคุ้มกันบกพร่อง: แนะนำ IM และควบคุมคอร์สให้ครบ");
  }

  return out;
}
