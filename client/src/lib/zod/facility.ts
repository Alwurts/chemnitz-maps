import { FacilityTypes } from "@/types/models";
import { z } from "zod";

export const facilityTypeSchema = z.enum(FacilityTypes);

export const selectedFacilitySchema = z.object({
  id: z.number(),
  type: facilityTypeSchema,
});

export const locationFacilitySchema = z.object({
  id: z.number(),
  label: z.string(),
  type: facilityTypeSchema,
  latitude: z.number(),
  longitude: z.number(),
});

export const filterFacilityTypesSchema = z.array(facilityTypeSchema);
