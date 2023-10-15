import { ERROR_CODE } from "@/utilities/enums";
import { getLocalStorage, removeLocalStorage, setLocalStorage } from "@/utilities/helper";
import STORAGE from "@/utilities/storage";
import axios from "axios";


const HttpAuth = axios.create({
  baseURL: process.env.API_LINK,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

function refreshToken() {
  return HttpAuth.get("/user/refreshToken").then((res) => res.data);
}

const IS_SERVER = typeof window === "undefined";

HttpAuth.interceptors.request.use(
  (config) => {
    if (!IS_SERVER) {
      const token = getLocalStorage(STORAGE.accessToken);
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

HttpAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    const { config, response } = error;
    if (
      response.status === ERROR_CODE.INTERNAL_SERVER_ERROR ||
      response.status === ERROR_CODE.BAD_REQUEST
    ) {
      return Promise.reject(error);
    }
    if (
      response &&
      response.status === ERROR_CODE.NOT_FOUND &&
      !config?.url?.includes("/user/refreshToken")
    ) {
      return refreshToken()
        .then((res) => {
          const { accessToken = null } = res;
          setLocalStorage("accessToken", accessToken);
          if (config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
          return HttpAuth(config);
        })
        .catch(() => {
          removeLocalStorage();
          window.location.href = "/login";
        });
    } else {
      delete axios.defaults.headers.common["Authorization"];
      removeLocalStorage();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default HttpAuth;