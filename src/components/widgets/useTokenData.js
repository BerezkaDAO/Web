import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/react-hooks";
import { fetchCommon } from "./fetchCommon";
import { mergeByDayID } from "./merger";

const GET_LAST_PRICE = `
query GetLastDayPrice ($tokenAddress: String){
    dayHistoricalDatas(
      orderBy: dayId, 
      orderDirection:desc,
      where: { token: $tokenAddress }
    ) {
      id,
      date,
      dayId,
      price,
      token,
      totalPrice,
      apy
    }
  }
`;

export const useTokenData = (
  tokenAddress,
  isLegacy,
  options = {
    precision: 3,
    computeSeparate: false,
  }
) => {
  const { loading, data } = useQuery(gql(GET_LAST_PRICE), {
    variables: {
      tokenAddress,
    },
    skip: isLegacy,
  });

  const [historicalData, setHistoricalData] = useState();

  useEffect(() => {
    const fn = async () => {
      const historicalData = await fetchCommon(tokenAddress, options.precision);
      setHistoricalData(historicalData);
    };
    fn();
  }, [tokenAddress]);

  if (loading || !historicalData) {
    return {
      loading: true,
    };
  }

  const dayHistoricalDatas = data ? data.dayHistoricalDatas : [];
  const merged = mergeByDayID(historicalData, dayHistoricalDatas);

  if (options.computeSeparate) {
    const graphOnly = mergeByDayID([], [...dayHistoricalDatas]);
    const excelOnly = mergeByDayID([...historicalData], []);
    return {
      loading: false,
      merged,
      graphOnly,
      excelOnly,
    };
  } else {
    return {
      loading: false,
      merged,
    };
  }
};
