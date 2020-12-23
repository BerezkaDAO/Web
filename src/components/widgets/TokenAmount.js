import React from "react";
import { useQuery, gql } from "@apollo/react-hooks";
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

  if (loading) {
    return <>...</>;
  }

  const amount = loading
    ? 0
    : round(Number.parseFloat(data.dayHistoricalDatas[0].price) / 10 ** 6, 3);

  return <>$ {amount.toFixed(2)}</>;
};

export default TokenPrice;
