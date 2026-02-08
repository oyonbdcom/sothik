import { authKey } from "@/constant/authKey";
import {
  getFromLocalstorage,
  setToLocalstorage,
} from "@/lib/auth/local-storage";
import { decodedToken } from "@/lib/utils/jwt";
import { UserJwtPayload } from "@/types";

export const storeUserInfo = ({ accessToken }: { accessToken: string }) => {
  setToLocalstorage(authKey, accessToken);
};

export const getUserInfo = (): UserJwtPayload | null => {
  const authToken = getFromLocalstorage(authKey);

  if (authToken) {
    const userData = decodedToken(authToken) as UserJwtPayload;

    return userData;
  } else {
    return null;
  }
};
export const isLoggedIn = () => {
  const authToken = getFromLocalstorage(authKey);
  return !!authToken;
};
export const removeUserInfo = async () => {
  localStorage.removeItem(authKey);
};
