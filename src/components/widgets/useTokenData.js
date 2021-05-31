import React, { useState, useEffect } from "react";
import { fetchCommon } from "./fetchCommon";
import { mergeByDayID } from "./merger";
import { nameByAddress, tokenInfo, tokens } from "../data/tokens";
import { fetchDedupe } from "fetch-dedupe";
import { fetchCarry, computeCarry } from "./carry";

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
  const [data, setData] = useState();
  const [historicalData, setHistoricalData] = useState();
  const [carryData, setCarryData] = useState();

  useEffect(() => {
    const fn = async () => {
      console.log(`Getting price`);
      if (!isLegacy) {
        const data = await fetchDedupe(`/rawprice/${tokenAddress}`)
          .then((res) => {
            return res;
          })
          .then((res) => res.data);
        setData(data.data);
      } else {
        setData([]);
      }
    };
    setData(null);
    fn();
  }, [tokenAddress]);

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

  if (!data || !historicalData || !carryData) {
    return {
      loading: true,
    };
  }

  let merged = mergeByDayID(historicalData, data);

  const tokenName = nameByAddress(tokenAddress);
  const enableCarry = tokenInfo[tokenName].enableCarry;
  if (enableCarry) {
    merged = computeCarry(tokenAddress, merged, carryData);
  }

  if (options.computeSeparate) {
    const graphOnly = mergeByDayID([], [...data]);
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
