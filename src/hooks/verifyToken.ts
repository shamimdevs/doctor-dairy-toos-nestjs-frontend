import { jwtDecode } from "jwt-decode";

export const verifyToken = (token: string) => {
  if (!token) {
    return null;
  }
  return jwtDecode(token);
};
