import React, { useState, useEffect } from "react";
import { fetchCommon } from "../daoes";

const APYLegacy = (props) => {
  const { tokenAddress, decimals } = props;

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

  const actualDecimals = decimals === undefined ? 2 : 0;

  return (
    <>{Number.parseFloat(historicalData[0].apy).toFixed(actualDecimals)}%</>
  );
};

export default APYLegacy;
