import React from "react";
import { useTokenDatas } from "./useTokenData";
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
    const merged = uniqueLastDayDatas;
    const tokenSum = Number.parseInt(
      round(Number.parseFloat(merged[0].totalPrice) / 10 ** 18 / 10 ** 6, 0) -
        (merged[0].totalCarry > 0 ? merged[0].totalCarry : 0 || 0)
    );
    sum += tokenSum;
  }
  return sum;
};

const TotalPrice = (props) => {
  const { tokens } = props;
  const { loading, merged } = useTokenDatas(tokens);

  if (loading || !merged) {
    return <>...</>;
  }

  const totalPrice = computeSum(merged);

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
