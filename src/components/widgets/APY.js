import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/react-hooks";
import { fetchCommon } from "./fetchCommon";
import { mergeByDayID } from "./merger";

const GET_LAST_PRICE = `
query GetApy ($tokenAddress: String){
    dayHistoricalDatas(
      orderBy: dayId, 
      orderDirection:desc,
      where: { token: $tokenAddress }
    ) {
      id,
      dayId,
      price,
      token,
      totalPrice,
      apy
    }
  }
`;

const APY = (props) => {
  const { tokenAddress, decimals } = props;

  const { loading, data } = useQuery(gql(GET_LAST_PRICE), {
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

  const actualDecimals = decimals === undefined ? 2 : 0;
  const last = merged[0];
  const first = merged[merged.length - 1];
  const lastPrice = last.price;
  let firstPrice = first.price;
  const daysBetween = last.dayId - first.dayId;

  // ((Pn/P0)-1)*100% /Nдней*365
  const amount = (((lastPrice / firstPrice - 1) * 100) / daysBetween) * 365;

  return <>{amount.toFixed(actualDecimals)}%</>;
};

export default APY;
