export const setToLocalstorage = (key: string, token: string) => {
  if (!key && !typeof window === undefined) {
    return "";
  }
  return localStorage.setItem(key, token);
};
export const getFromLocalstorage = (key: string) => {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(key);
};
