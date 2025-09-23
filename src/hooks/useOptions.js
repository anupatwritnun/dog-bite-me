import { useMemo } from "react";
import { EXPO_IDS, OBS_IDS, PRIOR_IDS, mapOptions } from "../i18n.jsx";
import { ANIMALS } from "../utils/animal";

export default function useOptions(t) {
  const EXPOSURES = useMemo(() => mapOptions(EXPO_IDS, "exposures", t), [t]);
  const OBS_OPTIONS = useMemo(() => mapOptions(OBS_IDS, "obs10d", t), [t]);
  const PRIOR_VAC = useMemo(() => mapOptions(PRIOR_IDS, "prior", t), [t]);
  const ANIMAL_OPTIONS = useMemo(
    () => ANIMALS.map(a => ({ ...a, label: t(`animals.${a.id}`) || a.label || a.id })),
    [t]
  );
  return { EXPOSURES, OBS_OPTIONS, PRIOR_VAC, ANIMAL_OPTIONS };
}
