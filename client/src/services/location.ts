import { useQuery } from "@tanstack/react-query";

import { getLocation } from "@/lib/location";

export const useGetLocation = () => {
  return useQuery({
    queryKey: ["user-location"],
    queryFn: getLocation,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });
};
