import React from "react";
import { round } from "./round";
import { useTokenData } from "./useTokenData";

const TokenCarry = (props) => {
  const { tokenAddress, separator, dollarSeparator, isLegacy, isAdmin } = props;
  const { loading, merged } = useTokenData(tokenAddress, isLegacy);

  if (loading) {
    return <>...</>;
  }

  const amount = loading
    ? 0
    : Math.max(
        isAdmin ? Number.MIN_SAFE_INTEGER : 0,
        Number.parseInt(round(Number.parseFloat(merged[0].totalCarry), 0))
      );

  return (
    <>
      {`$${dollarSeparator || ""}`}
      {amount
        .toFixed(0)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, separator || ".")}
    </>
  );
};

export default TokenCarry;
