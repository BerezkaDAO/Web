import React from "react";
import { useTokenData } from "./useTokenData";

const APY = (props) => {
  const { tokenAddress, decimals, isLegacy } = props;
  const { loading, merged } = useTokenData(tokenAddress, isLegacy);

  if (loading) {
    return <>...</>;
  }

  const actualDecimals = decimals === undefined ? 2 : 0;
  const last = merged[0];
  const first = merged[merged.length - 1];
  const lastPrice = last.price;
  let firstPrice = first.price;
  const daysBetween = last.dayId - first.dayId;

  // ((Pn/P0)-1)*100% /Nдней*365
  const amount = (((lastPrice / firstPrice - 1) * 100) / daysBetween) * 365;

  return <>{amount.toFixed(actualDecimals)}%</>;
};

export default APY;
