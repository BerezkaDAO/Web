import { fetchCurrentPrice } from "./daoes";

export const oracle = async (token) => {
  return await fetchCurrentPrice(token);
};
