import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { defaultFilters } from "@/lib/filters";
import { searchAddressSchema } from "@/lib/zod/address";
import {
  filterFacilityTypesSchema,
  locationFacilitySchema,
  selectedFacilitySchema,
} from "@/lib/zod/facility";

const directionPanelSchema = z.object({
  mode: z.enum(["EDIT"]),
});

export type TDirectionPanel = z.infer<typeof directionPanelSchema> | undefined;

const directionsSchema = z.object({
  fromLocation: searchAddressSchema,
  toLocation: locationFacilitySchema,
});

export type TDirections = z.infer<typeof directionsSchema> | undefined;

const filterPanelSchema = z.object({
  mode: z.enum(["EDIT"]),
});

export type TFilterPanel = z.infer<typeof filterPanelSchema> | undefined;

const filtersSchema = z.object({
  facilityTypes: filterFacilityTypesSchema.optional(),
  showOnlyFavorites: z.boolean().optional(),
  searchRadius: z.number().optional(),
  searchLocation: searchAddressSchema,
});

export type TFilters = z.infer<typeof filtersSchema>;

const profilePanelSchema = z.object({
  mode: z.enum(["EDIT"]),
});

const addressPanelSchema = z
  .object({
    type: z.enum(["LIST", "CREATE"]),
  })
  .or(
    z.object({
      type: z.enum(["DETAIL", "EDIT"]),
      id: z.number(),
    })
  );

export type TAddressPanel = z.infer<typeof addressPanelSchema> | undefined;

const selectModeSchema = z.object({
  mode: z.enum(["SELECT", "USE"]),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type TSelectMode = z.infer<typeof selectModeSchema> | undefined;

const indexSearchSchema = z.object({
  showList: z.boolean().optional(),
  selectedFacility: selectedFacilitySchema.optional(),
  filters: filtersSchema.default(defaultFilters),
  directions: directionsSchema.optional(),
  selectMode: selectModeSchema.optional(),
  addressPanel: addressPanelSchema.optional(),
  filterPanel: filterPanelSchema.optional(),
  directionsPanel: directionPanelSchema.optional(),
  profilePanel: profilePanelSchema.optional(),
});

export const Route = createFileRoute("/")({
  validateSearch: indexSearchSchema,
});
