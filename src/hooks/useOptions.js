import {
  mapOptions, EXPO_IDS, OBS_IDS, PRIOR_IDS,
  TETANUS_DOSE_IDS, TETANUS_RECENT_IDS
} from "../i18n";

export default function useOptions(t) {
  return {
    EXPOSURES: mapOptions(EXPO_IDS, "exposures", t),
    OBS_OPTIONS: mapOptions(OBS_IDS, "obs10d", t),
    PRIOR_VAC: mapOptions(PRIOR_IDS, "prior", t),
    TETANUS_OPTS: mapOptions(TETANUS_DOSE_IDS, "tetanusDosesOptions", t),
    TETANUS_RECENT_OPTS: mapOptions(TETANUS_RECENT_IDS, "tetanusRecentOptions", t),
    ANIMAL_OPTIONS: [
      { id: "dog", label: t("animals.dog") },
      { id: "cat", label: t("animals.cat") },
      { id: "bat", label: t("animals.bat") },
      { id: "monkey", label: t("animals.monkey") },
      { id: "other", label: t("animals.other") },
      { id: "non_mammal", label: t("animals.non_mammal") },
    ],
  };
}
