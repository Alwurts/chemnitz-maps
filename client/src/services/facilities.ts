import { Facilities, Facility, TSelectedFacility } from "@/types/models";
import { useQuery } from "@tanstack/react-query";

import apiClient from "@/lib/auth";

export const useGetFacilities = () => {
  return useQuery({
    queryKey: ["public-facilities"],
    queryFn: () => {
      return apiClient
        .get("/api/public-facilities")
        .then((res) => res.data as Promise<Facilities>);
    },
  });
};

export const useGetFacility = (facility: TSelectedFacility) => {
  return useQuery({
    queryKey: ["public-facility-detail", facility],
    queryFn: () => {
      return apiClient
        .get(
          `/api/public-facilities/${encodeURI(facility.type)}/${facility.id}`
        )
        .then((res) => {
          return res.data as Promise<Facility>;
        });
    },
  });
};
