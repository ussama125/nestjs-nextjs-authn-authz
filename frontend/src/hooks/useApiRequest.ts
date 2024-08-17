import { useState } from "react";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { useNotification } from "@/contexts/NotificationContext";
import { signOut, useSession } from "next-auth/react";

const useApiRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useNotification();
  const { data: session } = useSession();

  const makeRequest = async <T>(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: any,
    headers?: any
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    const config: AxiosRequestConfig = {
      url: "http://localhost:3001/api" + url,
      method,
      headers: headers || {
        "Content-Type": "application/json",
      },
      data: body,
    };
    const user = session?.user as any;

    if (user.access_token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${user.access_token}`,
      };
    }

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        const isProtectedRoute =
          location.pathname.includes("login") ||
          location.pathname.includes("complete-registeration");
        if (axiosError.response.status === 401 && !isProtectedRoute) {
          signOut();
        }
        // setError(axiosError?.response?.data?.message || "Request failed");
      } else {
        setError(axiosError.message);
      }

      notify(error, "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, makeRequest };
};

export default useApiRequest;
