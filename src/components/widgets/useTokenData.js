import React, { useState, useEffect } from "react";
import { fetchCommon } from "./daoes";

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
  //const [historicalData, setHistoricalData] = useState();
  //const [carryData, setCarryData] = useState();

  /*
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
*/

  useEffect(() => {
    const fn = async () => {
      console.log(`Getting price from daoes`);
      const data = await fetchCommon(tokenAddress, options.precision);
      setData(data);
    };
    setData(null);
    fn();
  }, [tokenAddress]);

  if (!data) {
    return {
      loading: true,
    };
  }

  return {
    loading: false,
    merged: data,
  };
};
