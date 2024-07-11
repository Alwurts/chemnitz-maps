import { chemnitzLocation } from "./location";

export const defaultFilters = {
  searchLocation: {
    id: "chemnitz-center" as const,
    label: "Chemnitz",
    latitude: chemnitzLocation.latitude,
    longitude: chemnitzLocation.longitude,
  },
};
