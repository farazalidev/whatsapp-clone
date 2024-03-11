import { getCookie } from '@/utils/getCookie';
import axios from 'axios';
import axiosRetry from 'axios-retry';

const axiosWithAuth = ({ static_server }: { static_server?: boolean }) => {
  const instance = axios.create({
    baseURL: static_server ? process.env.NEXT_PUBLIC_STATIC_ASSETS_SERVER_URL : process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
      Authorization: `Bearer ${getCookie(process.env.NEXT_PUBLIC_ACCESS_TOKEN_NAME)}`,
    },
    withCredentials: true,
  });
  axiosRetry(instance, { retries: 5, retryDelay: () => 5000 });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Check if the response status is 403 (Unauthorized) indicating token expiration
      if (error.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Call your API route to refresh the access token
           await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`, { withCredentials: true });
          const newAccessToken = getCookie(process.env.NEXT_PUBLIC_ACCESS_TOKEN_NAME);

          // Update the original request with the new access token
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          // Retry the original request
          return axios(originalRequest);
        } catch (refreshError: any) {
          // Handle errors during token refresh
          if (refreshError.response?.status === 401) {
            // Logout the user if the refresh token is expired
            // You may want to redirect or perform other actions here
          } else {
            // Handle other refresh token errors
          }

          // Redirect to the login page or handle the error as needed
          // Example: Router.push('/login');

          throw refreshError;
        }
      }

      // If the error is not related to token expiration, reject the promise
      return Promise.reject(error);
    },
  );

  return instance;
};

export default axiosWithAuth;
