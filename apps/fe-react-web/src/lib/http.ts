import envConfig from "@/schema/config.schema";
import axios from "axios";

const parseParams = (params: any) => {
  const keys = Object.keys(params);
  let options = "";

  keys.forEach((key) => {
    const isParamTypeObject = typeof params[key] === "object";
    const isParamTypeArray = isParamTypeObject && Array.isArray(params[key]) && params[key].length > 0;

    if (!isParamTypeObject) {
      options += `${key}=${params[key]}&`;
    }

    if (isParamTypeObject && isParamTypeArray) {
      params[key].forEach((element: any) => {
        options += `${key}=${element}&`;
      });
    }
  });

  return options ? options.slice(0, -1) : options;
};

export const apiRequest = axios.create({
  baseURL: envConfig.VITE_API_URL,
  paramsSerializer: parseParams,
  withCredentials: false,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

// Interceptor request
apiRequest.interceptors.request.use((options) => {
  const { method, data } = options;

  if (method === "put" || method === "post" || method === "patch") {
    if (data instanceof FormData) {
      Object.assign(options.headers!, {
        "Content-Type": "multipart/form-data",
      });
    } else {
      Object.assign(options.headers!, {
        "Content-Type": "application/json;charset=UTF-8",
      });
    }
  }

  return options;
});

// Interceptor response
apiRequest.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
