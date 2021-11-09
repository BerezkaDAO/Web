import React, { useState, useEffect } from "react";
import { fetchCommon } from "../daoes";
import { round } from "../round";

const TokenPriceLegacy = (props) => {
  const { tokenAddress, separator, dollarSeparator } = props;

  const [historicalData, setHistoricalData] = useState();
  useEffect(() => {
    const fn = async () => {
      const historicalData = await fetchCommon(tokenAddress);
      setHistoricalData(historicalData);
    };
    fn();
  }, [tokenAddress]);

  if (!historicalData) {
    return <>...</>;
  }

  const amount = !historicalData
    ? 0
    : Number.parseInt(
        round(
          Number.parseFloat(historicalData[0].totalPrice) / 10 ** 18 / 10 ** 6,
          0
        )
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

export default TokenPriceLegacy;
