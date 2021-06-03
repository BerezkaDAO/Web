import React, { useState, useEffect } from "react";
import { useTokenDatas } from "./useTokenData";
import { fetchCommonAll } from "./fetchCommon";
import { round } from "./round";

const uniqueBy = (x, f) =>
  Object.values(x.reduce((a, b) => ((a[f(b)] = b), a), {}));

const computeSum = (datas) => {
  let unique = (a) => a.filter((item, i, ar) => ar.indexOf(item) === i);
  let tokens = unique(datas.map((d) => d.token.toLowerCase()));
  let sum = 0;
  for (let token of tokens) {
    const dataz = datas.filter(
      (d) => d.token.toLowerCase() === token.toLowerCase()
    );
    const lastDay = dataz[0].dayId;
    const lastDayDatas = dataz.filter((d) => d.dayId === lastDay);
    const uniqueLastDayDatas = uniqueBy(lastDayDatas, (d) =>
      d.token.toLowerCase()
    );
    const d = uniqueLastDayDatas[0].totalPrice;
    const tokenSum = Number.parseInt(
      round(Number.parseFloat(d) / 10 ** 18 / 10 ** 6, 0)
    );
    sum += tokenSum;
  }
  return sum;
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
