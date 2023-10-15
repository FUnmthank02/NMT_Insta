import { getLocalStorage } from "@/utilities/helper";
import STORAGE from "@/utilities/storage";

export const BearerToken = () => {
  return `Bearer ${getLocalStorage(STORAGE.accessToken)}`;
};