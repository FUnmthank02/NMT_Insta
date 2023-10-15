export const removeLocalStorage = () => {
  const IS_SERVER = typeof window === "undefined";

  if (!IS_SERVER) {
    localStorage.clear();
  }
};

export const getLocalStorage = (itemStorage: string) => {
  const IS_SERVER = typeof window === "undefined";

  if (!IS_SERVER) {
    return localStorage.getItem(itemStorage);
  }
};

export const setLocalStorage = (itemStorage: string, data: string) => {
  const IS_SERVER = typeof window === "undefined";

  if (!IS_SERVER) {
    localStorage.setItem(itemStorage, data);
  }
};