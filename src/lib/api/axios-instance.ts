import Axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getCookie } from "../utils/cookies";

const BASE_API_URL = process.env["NEXT_PUBLIC_API_URL"];

export const axiosClient = Axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface ApiResponse {
  accessToken?: string | null;
  success?: boolean;
}

const handleRequest = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token = getCookie("psm_token");

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
};

const handleResponseRedirect = (
  response: AxiosResponse<ApiResponse>
): AxiosResponse => {
  return response;
};

const handleRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const handleResponseError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};
axiosClient.interceptors.request.use(handleRequest, handleRequestError);
axiosClient.interceptors.response.use(
  handleResponseRedirect,
  handleResponseError
);
