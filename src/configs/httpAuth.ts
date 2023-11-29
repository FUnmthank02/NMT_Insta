import { ENDPOINT_API, HTTP_STATUS_CODE, ROUTE_PATH } from "@/utilities/enums";
import { getLocalStorage, removeLocalStorage, setLocalStorage } from "@/utilities/helper";
import STORAGE from "@/utilities/storage";
import axios from "axios";
import Http from "./http";


const HttpAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_LINK,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

function refreshToken() {
  const data = {
    accessToken: getLocalStorage(STORAGE.accessToken),
    refreshToken: getLocalStorage(STORAGE.refreshToken)
  }
  return Http.post(ENDPOINT_API.refreshToken, data)
    .then((res) => res.data.data);
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
      response.status === HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR ||
      response.status === HTTP_STATUS_CODE.BAD_REQUEST
    ) {
      return Promise.reject(error);
    }
    if (
      response &&
      response.status === HTTP_STATUS_CODE.NOT_FOUND &&
      !config?.url?.includes(ENDPOINT_API.refreshToken)
    ) {
      return refreshToken()
        .then((res) => {
          const { accessToken = null, refreshToken = null } = res;
          setLocalStorage(STORAGE.accessToken, accessToken);
          setLocalStorage(STORAGE.refreshToken, refreshToken);
          if (config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
          return HttpAuth(config);
        })
        .catch(() => {
          removeLocalStorage();
          window.location.href = ROUTE_PATH.signIn;
        });
    } else {
      delete axios.defaults.headers.common["Authorization"];
      removeLocalStorage();
      window.location.href = ROUTE_PATH.signIn;
    }
    return Promise.reject(error);
  },
);

export default HttpAuth;