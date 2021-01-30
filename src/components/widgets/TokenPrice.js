import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/react-hooks";
import { round } from "./round";
import { fetchCommon } from "./fetchCommon";
import { mergeByDayID } from "./merger";

const GET_LAST_PRICE = `
query GetTokenPrice ($tokenAddress: String) {
    dayHistoricalDatas(
      orderBy: dayId, 
      orderDirection:desc,
      where: { token: $tokenAddress }
    ) {
      id,
      dayId,
      price,
      token,
      totalPrice
    }
  }
`;

const TokenPrice = (props) => {
  const { tokenAddress, separator, dollarSeparator, isLegacy } = props;

  const { loading, data } = useQuery(gql(GET_LAST_PRICE), {
    variables: {
      tokenAddress,
    },
    skip: isLegacy,
  });

  const [historicalData, setHistoricalData] = useState();

  useEffect(() => {
    const fn = async () => {
      const historicalData = await fetchCommon(tokenAddress, 3);
      setHistoricalData(historicalData);
    };
    fn();
  }, [tokenAddress]);

  if (loading || !historicalData) {
    return <>...</>;
  }

  const merged = mergeByDayID(
    historicalData,
    data ? data.dayHistoricalDatas : []
  );

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
