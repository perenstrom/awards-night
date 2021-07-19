export const parseFormData = <T extends Object>(formData: FormData): T => {
  const result = {};
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
