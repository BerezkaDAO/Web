import React from "react";
import { round } from "./round";
import { useTokenData } from "./useTokenData";

const TokenCarry = (props) => {
  const { tokenAddress, separator, inBaseToken, isAdmin } = props;
  const { loading, merged } = useTokenData(tokenAddress);

  if (loading) {
    return <>...</>;
  }

  const currentCarry = inBaseToken
    ? merged[0].totalCarryInBaseToken
    : merged[0].totalCarry;

  const prefix = inBaseToken ? "" : `$ `;

  const amount = Math.max(
    isAdmin ? Number.MIN_SAFE_INTEGER : 0,
    Number.parseInt(round(Number.parseFloat(currentCarry), 0))
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

export default TokenCarry;
