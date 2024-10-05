import { nanoid } from "nanoid";

export const generateId = (label: string, length: number) => {
  return `${label}_${nanoid(length)}`;
};
