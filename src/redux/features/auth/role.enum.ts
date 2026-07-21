export const Role = {
  USER: "user",
} as const;

// Type helper
export type Role = (typeof Role)[keyof typeof Role];
