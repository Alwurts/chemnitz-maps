import { z } from "zod";

export const searchAddressSchema = z.object({
  id: z.enum(["current-location", "chemnitz-center"]).or(z.number()),
  label: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

export type TSearchAddress = z.infer<typeof searchAddressSchema>;
