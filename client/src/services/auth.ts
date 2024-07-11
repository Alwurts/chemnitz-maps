import { User } from "@/types/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import apiClient from "@/lib/auth";

import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";

export const useGetProfile = () => {
  return useQuery({
    queryKey: ["auth-profile"],
    queryFn: () => {
      return apiClient
        .get(`/api/auth/profile`)
        .then((res) => res.data as Promise<User>);
    },
  });
};

export const useEditProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (profileDetails: { firstName: string; lastName: string }) => {
      return apiClient
        .put(`/api/auth/profile`, {
          first_name: profileDetails.firstName,
          last_name: profileDetails.lastName,
        })
        .then((res) => res.data as Promise<User>);
    },
    onSuccess: () => {
      toast({
        title: "Updated profile!",
      });
      queryClient.invalidateQueries({
        queryKey: ["auth-profile"],
      });
    },
  });
};

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: () => {
      return apiClient.delete(`/api/auth/profile`).then((res) => res.data);
    },
    onSuccess: () => {
      toast({
        title: "Deleted profile!",
      });
      queryClient.invalidateQueries({
        queryKey: ["auth-profile"],
      });
    },
  });
};

export const useChangePassword = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (passwordDetails: {
      oldPassword: string;
      newPassword: string;
      repeatNewPassword: string;
    }) => {
      return apiClient
        .put(`/api/auth/password`, {
          old_password: passwordDetails.oldPassword,
          new_password: passwordDetails.newPassword,
          repeat_new_password: passwordDetails.repeatNewPassword,
        })
        .then((res) => res.data);
    },
    onSuccess: () => {
      toast({
        title: "Password changed!",
      });
    },
  });
};

export const useSignUp = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (signupDetails: {
      email: string;
      username: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      return axios.post(
        `http://localhost:8000/api/auth/signup`,
        {
          email: signupDetails.email,
          username: signupDetails.username,
          password: signupDetails.password,
          first_name: signupDetails.firstName,
          last_name: signupDetails.lastName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
    onSuccess: () => {
      toast({
        title: "Account created!",
      });
    },
  });
};

export const useUpgradeAccount = () => {
  const { toast } = useToast();
  const { setTokens } = useAuth();
  return useMutation({
    mutationFn: () => {
      return apiClient.put(`/api/auth/upgrade`).then((res) => res.data);
    },
    onSuccess: (data) => {
      setTokens({
        access: data.access,
        refresh: data.refresh,
      });
      toast({
        title: "Account upgraded to premium!",
      });
    },
  });
};
