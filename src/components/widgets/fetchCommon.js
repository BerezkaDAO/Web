import { apiNameByAddress } from "../data/tokens";
import { fetchDedupe } from "fetch-dedupe";
import { round } from "./round";

export const fetchCommonAll = async (tokens) => {
  let result = [];
  for (let token of tokens) {
    const tokenResult = await fetchCommon(token);
    result = [...result, ...tokenResult];
  }
  return result;
};

export const fetchCommon = async (tokenAddress, precision = 3) => {
  if (!tokenAddress) {
    return null;
  } else {
    const apiName = apiNameByAddress(tokenAddress);
    if (!apiName) {
      return [];
    } else {
      const response = await fetchDedupe(
        `/storage/charts/${apiNameByAddress(tokenAddress)}/common.json`
      ).then((res) => res.data);
      const adjusted = response.map((data) => {
        return {
          date: Math.floor(data[0] / 1000),
          dayId: Math.floor(data[0] / 1000 / 86400),
          price: "" + round(data[1] * 10 ** 6, precision),
          token: tokenAddress.toLowerCase(),
          supply: round(Number.parseFloat(data[3] / data[1]) * 10 ** 18, 0),
          apy: data[2],
          totalPrice: round(Number.parseFloat(data[3]) * 10 ** 6 * 10 ** 18, 3),
        };
      });
      return adjusted;
    }
  }
};
