import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/react-hooks";
import { fetchCommonAll } from "./fetchCommon";
import { round } from "./round";
import { mergeByDayID } from "./merger";

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
  let unique = (a) => a.filter((item, i, ar) => ar.indexOf(item) === i);
  let tokens = unique(datas.map((d) => d.token));
  let sum = 0;
  for (let token of tokens) {
    const dataz = datas.filter((d) => d.token === token);
    const lastDay = dataz[0].dayId;
    const lastDayDatas = dataz.filter((d) => d.dayId === lastDay);
    const uniqueLastDayDatas = uniqueBy(lastDayDatas, (d) => d.token);
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

  const [historicalData2, setHistoricalData2] = useState();
  useEffect(() => {
    const fn = async () => {
      const historicalData = await fetchCommonAll(tokens);
      setHistoricalData2(historicalData);
    };
    fn();
  }, [legacyTokens]);

  if (loading || !data || !historicalData || !historicalData2) {
    return <>...</>;
  }

  const dayHistoricalDatas = data ? data.dayHistoricalDatas : [];
  const merged = mergeByDayID(historicalData2, dayHistoricalDatas);
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
