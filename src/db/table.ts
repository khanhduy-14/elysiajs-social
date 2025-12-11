import { user } from "./schema/user";

export const table = {
  user,
} as const;

export type Table = typeof table;
