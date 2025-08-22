import axios, {
    AxiosError,
    InternalAxiosRequestConfig
  } from "axios";
import { useStore } from "../store/userStore";

const REACT_APP_BASE_URL = "https://backend.marketveb.uz";

const api = axios.create({
  baseURL: REACT_APP_BASE_URL,
});

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const storedUser = localStorage.getItem("user-store-market-client");
    const accessToken = storedUser
      ? JSON.parse(storedUser)?.state?.accessToken
      : null;

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest._retry) {

      const storedUser = localStorage.getItem("user-store-market-client");
      const refreshToken = storedUser
      ? JSON.parse(storedUser)?.state?.refreshToken
      : null;
      const { clearUser, updateTokens } = useStore.getState();
      
      
      if (refreshToken) {
        originalRequest._retry = true;
        try {
          const refreshResponse = await axios.post(`${REACT_APP_BASE_URL}/auth/refresh/user`, {
            refresh_token: refreshToken,
          });
          
          const newAccessToken = refreshResponse?.data?.access_token;
          const newRefreshToken = refreshResponse?.data?.refresh_token;

          if (newAccessToken && newRefreshToken) {
            updateTokens(newAccessToken, newRefreshToken);

            api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            }

            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          clearUser();
        }
      } else {
        console.warn("No refresh token available");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
