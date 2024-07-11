import { AuthToken, AuthTokens } from "@/types/auth";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const getAuthFromToken = (token: string) => {
  try {
    const decodedToken = jwtDecode(token) as AuthToken;
    const authUser: AuthTokens = {
      userId: decodedToken.user_id,
      userType: decodedToken.user_type,
    };
    return authUser;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

/* export const refreshToken = async (): Promise<{
  access: string;
  refresh: string;
} | void> => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    return;
  }
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { data } = await axios.post(`${apiUrl}/api/auth/token/refresh/`, {
      refresh: refreshToken,
    });
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    return data;
  } catch (error) {
    console.error("Token refresh failed:", error);
  }
}; */

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          // Handle logout here
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          return Promise.reject(error);
        }
        const apiUrl = import.meta.env.VITE_API_URL;

        const { data } = await axios.post(`${apiUrl}/api/auth/token/refresh/`, {
          refresh: refreshToken,
        });
        localStorage.setItem("accessToken", data.access);
        apiClient.defaults.headers.Authorization = `Bearer ${data.access}`;
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Handle logout here
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
