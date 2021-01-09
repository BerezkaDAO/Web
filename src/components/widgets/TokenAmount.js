import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/react-hooks";
import { fetchCommon } from "./fetchCommon";
import { mergeByDayID } from "./merger";
import { round } from "./round";

const GET_LAST_PRICE = gql`
  query Get($tokenAddress: String) {
    dayHistoricalDatas(
      orderBy: dayId
      orderDirection: desc
      where: { token: $tokenAddress }
    ) {
      id
      dayId
      price
      token
      totalPrice
    }
  }
`;

const TokenPrice = (props) => {
  const { tokenAddress } = props;
  const { loading, data } = useQuery(GET_LAST_PRICE, {
    variables: {
      tokenAddress,
    },
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

  const merged = mergeByDayID(historicalData, data.dayHistoricalDatas);

  const amount = loading
    ? 0
    : round(Number.parseFloat(merged[0].price) / 10 ** 6, 3);

  return <>$ {amount.toFixed(2)}</>;
};

export default TokenPrice;
