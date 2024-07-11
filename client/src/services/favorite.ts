import { Facility } from "@/types/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/lib/auth";

export const useLikeFacility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (facility: Facility) => {
      return apiClient
        .post(
          `/api/public-facilities/${encodeURI(facility.type)}/${facility.id}/like`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          return res.data;
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["public-facility-detail"],
      });
      queryClient.invalidateQueries({
        queryKey: ["public-facilities"],
      });
    },
  });
};
