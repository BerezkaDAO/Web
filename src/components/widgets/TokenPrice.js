import React from "react";
import { round } from "./round";
import { useTokenData } from "./useTokenData";

const TokenPrice = (props) => {
  const { tokenAddress, separator, dollarSeparator, isLegacy } = props;
  const { loading, merged } = useTokenData(tokenAddress, isLegacy);

  if (loading) {
    return <>...</>;
  }

  const amount = loading
    ? 0
    : Number.parseInt(
        round(Number.parseFloat(merged[0].totalPrice) / 10 ** 18 / 10 ** 6, 0)
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

export default TokenPrice;
