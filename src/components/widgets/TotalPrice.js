import React from "react";
import { useQuery, gql } from "@apollo/react-hooks";
import { round } from "./round";

const GET_LAST_PRICE = `
query GetTotalPrice {
    dayHistoricalDatas(
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

const TotalPrice = (props) => {
  const { loading, data } = useQuery(gql(GET_LAST_PRICE));

  if (loading && !data) {
    return <>...</>;
  }

  const lastDay = data.dayHistoricalDatas[0].dayId;
  const totalPrice = data.dayHistoricalDatas
    .filter((d) => d.dayId === lastDay)
    .map((d) => d.totalPrice)
    .map((d) =>
      Number.parseInt(round(Number.parseFloat(d) / 10 ** 18 / 10 ** 6, 0))
    )
    .reduce((a, b) => a + b, 0);

  return (
    <>
      ${" "}
      {totalPrice
        .toFixed(0)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
    </>
  );
};

export default TotalPrice;
