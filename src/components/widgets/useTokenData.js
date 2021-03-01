import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/react-hooks";
import { fetchCommon } from "./fetchCommon";
import { mergeByDayID } from "./merger";
import { nameByAddress, tokenInfo, tokens } from "../data/tokens";
import { fetchCarry, computeCarry } from "./carry";

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
      apy,
      supply
    }
  }
`;

// eslint-disable-next-line react-hooks/rules-of-hooks
export const useTokenDatas = (tokenAddresses) => {
  const datas = [];
  for (let address of tokenAddresses) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { loading, merged } = useTokenData(address, false);
    datas.push({
      loading,
      merged,
    });
  }
  if (datas.filter((it) => it.loading).length > 0) {
    return {
      loading: true,
    };
  } else {
    const merged = datas.map((it) => it.merged).flat();
    return {
      loading: false,
      merged,
    };
  }
};

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
  const [carryData, setCarryData] = useState();

  useEffect(() => {
    const fn = async () => {
      console.log(`Getting carry`);
      const carryData = await fetchCarry(tokenAddress);
      setCarryData(carryData);
    };
    fn();
  }, [tokenAddress]);

  useEffect(() => {
    const fn = async () => {
      const historicalData = await fetchCommon(tokenAddress, options.precision);
      setHistoricalData(historicalData);
    };
    fn();
  }, [tokenAddress]);

  if (loading || !historicalData || !carryData) {
    return {
      loading: true,
    };
  }

  const dayHistoricalDatas = data ? data.dayHistoricalDatas : [];
  let merged = mergeByDayID(historicalData, dayHistoricalDatas);

  const tokenName = nameByAddress(tokenAddress);
  const enableCarry = tokenInfo[tokenName].enableCarry;
  if (enableCarry) {
    merged = computeCarry(tokenAddress, merged, carryData);
  }

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
