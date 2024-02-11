import React, { useEffect, useState } from "react";
import { getDaoUserAccount } from "./clients";
import { checkIsBlastDao } from "./checkIsBlastDao";
import { useBlastData } from "./useBlastData";

const AccountPortfolioProvider = (props) => {
  const { dao, wallet, childrenLoading, children } = props;
  const [data, setData] = useState();
  const { blastCurrent, isLoading, blastPrice } = useBlastData(
    wallet,
    dao.address
  );
  const isBlastDao = checkIsBlastDao(dao.address);

  useEffect(() => {
    const fn = async () => {
      const result = await getDaoUserAccount(wallet, dao.id);

      setData(result);
    };
    fn();
  }, [wallet, dao.address]);

  const patcheddata =
    data && isBlastDao
      ? {
          ...data,
          symbol: "points",
          balance: blastCurrent.points,
          investedPortfolioValue: blastCurrent.usd,
          lastPrice: blastPrice,
        }
      : data;
  if (!patcheddata || isLoading) {
    return <>{childrenLoading()}</>;
  }

  return <>{children(patcheddata)}</>;
};

export default AccountPortfolioProvider;
