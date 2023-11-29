import { notification } from "antd";
import HttpAuth from "./httpAuth";

const HttpHandler = () => {
  HttpAuth.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: any) => {
      if (error?.config && error?.response) {
        if (error.response.data.statusCode !== 422) {
          notification["error"]({
            message: "Error " + error.response.data.statusCode,
            description: error.response?.data?.message || "Error",
          });
        }
      } else {
        notification["error"]({
          message: "Network Error ",
          description:
            "Something is temporarily wrong with your network connection. Please make sure you are connected to the internet and then reload your browser",
        });
      }
      return Promise.reject(error);
    },
  );
  return <></>;
};

export default HttpHandler;
