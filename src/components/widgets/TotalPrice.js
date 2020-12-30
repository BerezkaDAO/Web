import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/react-hooks";
import { fetchCommonAll } from "./fetchCommon";
import { round } from "./round";

const GET_LAST_PRICE = `
query GetTotalPrice($tokens: [String]) {
    dayHistoricalDatas(
      where: {
        token_in: $tokens
      }
      orderBy: dayId,
      orderDirection:desc,
      first:20
    ) {
      token,
      dayId,
      totalPrice
    }
  }
`;

const uniqueBy = (x, f) =>
  Object.values(x.reduce((a, b) => ((a[f(b)] = b), a), {}));

const computeSum = (datas) => {
  const lastDay = datas[0].dayId;
  const lastDayDatas = datas.filter((d) => d.dayId === lastDay);
  const uniqueLastDayDatas = uniqueBy(lastDayDatas, (d) => d.token);
  return uniqueLastDayDatas
    .map((d) => d.totalPrice)
    .map((d) =>
      Number.parseInt(round(Number.parseFloat(d) / 10 ** 18 / 10 ** 6, 0))
    )
    .reduce((a, b) => a + b, 0);
};

const TotalPrice = (props) => {
  const { tokens, legacyTokens } = props;
  const { loading, data } = useQuery(gql(GET_LAST_PRICE), {
    variables: {
      tokens,
    },
  });

  const [historicalData, setHistoricalData] = useState();
  useEffect(() => {
    const fn = async () => {
      const historicalData = await fetchCommonAll(legacyTokens);
      setHistoricalData(historicalData);
    };
    fn();
  }, [legacyTokens]);

  if (loading || !data || !historicalData) {
    return <>...</>;
  }

  const graphPrice = computeSum(data.dayHistoricalDatas);
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
