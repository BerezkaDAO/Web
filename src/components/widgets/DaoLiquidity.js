import React from "react";
import { round } from "./round";
import { useTokenData } from "./useTokenData";

export const DaoLiquidity = (props) => {
  const { tokenAddress, separator, inBaseToken } = props;
  const { loading, merged } = useTokenData(tokenAddress);

  if (loading) {
    return <>...</>;
  }

  const currentLiquidity = inBaseToken
    ? merged[0].totalPriceInBaseToken
    : merged[0].totalPrice;
  const currentCarry = inBaseToken
    ? merged[0].totalCarryInBaseToken
    : merged[0].totalCarry;

  const prefix = inBaseToken ? "" : `$ `;

  const amount = Number.parseInt(
    round(Number.parseFloat(currentLiquidity) / 10 ** 18 / 10 ** 6, 0) -
      (currentCarry > 0 ? currentCarry : 0)
  );

  return (
    <>
      {prefix}
      {amount
        .toFixed(0)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, separator || ".")}
    </>
  );
};
