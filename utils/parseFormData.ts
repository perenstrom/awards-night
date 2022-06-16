import { AnyObject } from "types/utilityTypes";

export const parseFormData = <T extends Object>(formData: FormData): T => {
  const result: AnyObject = {};
  for (let [key, value] of formData.entries()) {
    if (Object.keys(result).includes(key)) {
      if (Array.isArray(result[key])) {
        result[key].push(value);
      } else {
        result[key] = [result[key], value];
      }
    } else {
      result[key] = value;
    }
  }

  return result as T;
};
