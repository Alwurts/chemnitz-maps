import { createContext, useContext, useEffect, useState } from "react";

import { AuthTokens } from "@/types/auth";
import { useNavigate } from "@tanstack/react-router";
import axios from "axios";

import { getAuthFromToken } from "@/lib/auth";
import { defaultFilters } from "@/lib/filters";

const AuthContext = createContext<{
  authTokens: AuthTokens | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setTokens: (tokens: { access: string; refresh: string }) => void;
}>({
  authTokens: null,
  login: async () => {},
  logout: () => {},
  setTokens: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate({});

  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      return getAuthFromToken(accessToken);
    }
    return null;
  });

  const login = async (username: string, password: string) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await axios.post(`${apiUrl}/api/auth/token/`, {
      username,
      password,
    });
    const { access, refresh } = response.data;
    setAuthTokens(getAuthFromToken(access));
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    navigate({
      to: "/",
      search: {
        filters: defaultFilters,
      },
    });
  };

  const setTokens = (tokens: { access: string; refresh: string }) => {
    setAuthTokens(getAuthFromToken(tokens.access));
    localStorage.setItem("accessToken", tokens.access);
    localStorage.setItem("refreshToken", tokens.refresh);
  };

  const logout = () => {
    setAuthTokens(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  useEffect(() => {
    if (!authTokens) {
      // TODO Read url query params here and check if they are valid for non logged in users
      //navigate('/login');  // Redirect to login if not authenticated
    }
  }, [authTokens]);

  return (
    <AuthContext.Provider
      value={{ authTokens: authTokens, login, logout, setTokens }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
