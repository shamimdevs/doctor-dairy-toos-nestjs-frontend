// import { jwtDecode } from "jwt-decode";

// export const verifyToken = (token: string) => {
//   if (!token) {
//     return null;
//   }
//   return jwtDecode(token);
// };

import { jwtDecode } from "jwt-decode";

export interface CustomJwtPayload {
  role?: string;
  email?: string;
  exp?: number;
  [key: string]: unknown;
}

export const verifyToken = (token: string): CustomJwtPayload | null => {
  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode<CustomJwtPayload>(token);

    // Expiration check (Unix timestamp in seconds)
    if (decoded.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        return null; // Token has expired
      }
    }

    return decoded;
  } catch (error) {
    return null; // Invalid token string
  }
};
