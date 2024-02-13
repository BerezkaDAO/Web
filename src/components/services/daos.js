import { fetchDedupe } from "fetch-dedupe";

const API_HOST = process.env.REACT_APP_API_HOST || "";
const API_BASE = API_HOST + "/api/v1/public/daos";

export const fetchExchangeRate = async ({
  offeredToken,
  offeredAmount,
  requestedAmount,
  requestedToken,
  callerAddress,
  daoId,
}) => {
  const requestParams = offeredAmount
    ? {
        deposit_token: offeredToken,
        request_token: requestedToken,
        deposit_amount: offeredAmount,
      }
    : {
        deposit_token: offeredToken,
        request_token: requestedToken,
        request_amount: requestedAmount,
      };

  const fetchOptions = {
    headers: {
      "Accept-Encoding": "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      caller: callerAddress,
      ref_code: "",
      ...requestParams,
    }),
  };

  return await fetchDedupe(
    `${API_BASE}/${daoId}/token_request/create`,
    // `https://app.weezi.io/api/v1/public/daos/${daoId}/token_request/create`,

    fetchOptions
  )
    .then((res) => {
      const { deposit_amount, request_amount } = res.data.info;
      return { deposit_amount, request_amount };
    })
    .catch((e) => e);
};
