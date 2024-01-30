import React, { useEffect, useState } from "react";
import { fetchClientToken } from "./clients";
import { checkIsBlastDao } from "./checkIsBlastDao";
import { useBlastData } from "./useBlastData";

const AccountPortfolioProvider = (props) => {
  const { token, wallet, childrenLoading, children } = props;
  const [data, setData] = useState();
  const { blastCurrent, isLoading, blastPrice } = useBlastData(wallet, token);
  const isBlastDao = checkIsBlastDao(token);

  useEffect(() => {
    const fn = async () => {
      const result = await fetchClientToken(wallet, token);

      setData(result);
    };
    fn();
  }, [wallet, token]);

  const patcheddata =
    data && isBlastDao
      ? {
          ...data,
          symbol: "points",
          balance: blastCurrent.points,
          usd: blastCurrent.usd,
          lastPrice: blastPrice,
        }
      : data;

  if (!patcheddata || isLoading) {
    return <>{childrenLoading()}</>;
  }

  return <>{children(patcheddata)}</>;
};

export default AccountPortfolioProvider;
