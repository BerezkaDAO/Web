import React from "react";
import { useQuery, gql } from "@apollo/react-hooks";

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

  if (loading && !data) {
    return <>...</>;
  }
  const actualDecimals = decimals === undefined ? 2 : 0;
  const last = data.dayHistoricalDatas[0];
  const first = data.dayHistoricalDatas[data.dayHistoricalDatas.length - 1];
  const lastPrice = last.price;
  let firstPrice = first.price;
  const daysBetween = last.dayId - first.dayId;

  // ((Pn/P0)-1)*100% /Nдней*365
  const amount = (((lastPrice / firstPrice - 1) * 100) / daysBetween) * 365;
  //const amount = loading ? 0 : Number.parseInt(round(Number.parseFloat(data.dayHistoricalDatas[0].apy), 2))

  return <>{amount.toFixed(actualDecimals)}%</>;
};

export default APY;
