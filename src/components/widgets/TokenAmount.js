import React from "react";
import { round } from "./round";
import { useTokenData } from "./useTokenData";

const TokenPrice = (props) => {
  const { tokenAddress, isLegacy } = props;
  const { loading, merged } = useTokenData(tokenAddress, isLegacy);

  if (loading) {
    return <>...</>;
  }

  const amount = loading
    ? 0
    : round(
        Number.parseFloat(merged[0].priceAfterCarry || merged[0].price) /
          10 ** 6,
        3
      );

  return <>$ {amount.toFixed(2)}</>;
};

export default TokenPrice;
