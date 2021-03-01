import React, { useState, useEffect } from "react";
import { useTokenDatas } from "./useTokenData";
import { fetchCommonAll } from "./fetchCommon";
import { round } from "./round";

const uniqueBy = (x, f) =>
  Object.values(x.reduce((a, b) => ((a[f(b)] = b), a), {}));

const computeSum = (datas) => {
  const lastDay = datas[0].dayId;
  const lastDayDatas = datas.filter((d) => d.dayId === lastDay);
  const uniqueLastDayDatas = uniqueBy(lastDayDatas, (d) => d.token);
  return uniqueLastDayDatas
    .map(
      (d) =>
        Number.parseInt(
          round(Number.parseFloat(d.totalPrice) / 10 ** 18 / 10 ** 6, 0)
        ) - Number.parseInt(round(Number.parseFloat(d.totalCarry || 0), 0))
    )
    .reduce((a, b) => a + b, 0);
};

const TotalPrice = (props) => {
  const { tokens, legacyTokens } = props;
  const { loading, merged } = useTokenDatas(tokens);

  const [historicalData, setHistoricalData] = useState();
  useEffect(() => {
    const fn = async () => {
      const historicalData = await fetchCommonAll(legacyTokens);
      setHistoricalData(historicalData);
    };
    fn();
  }, [legacyTokens]);

  if (loading || !merged || !historicalData) {
    return <>...</>;
  }

  const graphPrice = computeSum(merged);
  const legacyPrice = computeSum(historicalData);
  const totalPrice = graphPrice + legacyPrice;

  return (
    <>
      ${" "}
      {totalPrice
        .toFixed(0)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
    </>
  );
};

export default TotalPrice;
