import { Address } from "@/types/address";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/lib/auth";

export const useGetAddresses = () => {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: () => {
      return apiClient
        .get("/api/addresses")
        .then((res) => res.data as Promise<Address[]>);
    },
  });
};

export const useGetAddress = (addressId: number | undefined) => {
  return useQuery({
    queryKey: ["address-detail", addressId],
    queryFn: () => {
      if (!addressId) {
        return Promise.reject("No address id");
      }
      return apiClient
        .get(`/api/addresses/${addressId}`)
        .then((res) => res.data as Promise<Address>);
    },
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (address: Omit<Address, "id">) => {
      return apiClient
        .post("/api/addresses/", address, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          return res.data;
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (address: Partial<Address>) => {
      return apiClient
        .put(`/api/addresses/${address.id}/`, address, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          return res.data;
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: number) => {
      return apiClient.delete(`/api/addresses/${addressId}`).then((res) => {
        return res.data;
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });
    },
  });
};
