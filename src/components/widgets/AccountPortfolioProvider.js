import React, { useState, useEffect } from "react";
import { apiNameByAddress } from "../data/tokens";
import { mergeByDayID } from "./merger";
import { round } from "./round";
import { useQuery, gql } from "@apollo/react-hooks";
import { computeDailyPrices } from "./computeCost";

const GET_ACCOUNT_GRAPH = gql`
  query GetTokenAccountGraphAccountPortfolioProfit(
    $wallet: String
    $tokens: [String]
  ) {
    historicalBalances(where: { wallet: $wallet, token_in: $tokens }) {
      id
      date
      dayId
      hourId
      amount
      token
      wallet
    }
  }
`;

const GET_LAST_PRICE = gql`
  query GetAccountPortfolioProfit($tokens: [String]) {
    dayHistoricalDatas(
      orderBy: dayId
      orderDirection: desc
      where: { token_in: $tokens }
    ) {
      id
      date
      dayId
      price
      token
      totalPrice
    }
  }
`;

const GET_PURCHASES = gql`
  query GetAccountPortfolioPurchases($wallet: String, $tokens: [String]) {
    balanceEvents(
      where: {
        counterparty_in: [
          "0x0000000000000000000000000000000000000000"
          "0xf8a8d25049ebfaf36cf1dd7ff51ebd0777fc9b32"
        ]
        wallet: $wallet
        token_in: $tokens
      }
    ) {
      id
      kind
      dayId
      amount
      token
      counterparty
      wallet
    }
  }
`;

const AccountPortfolioProvider = (props) => {
  const { tokens, wallet, childrenLoading, children } = props;

  const { loading: loading1, error: e1, data: balances } = useQuery(
    GET_ACCOUNT_GRAPH,
    {
      variables: {
        tokens,
        wallet,
      },
      skip: !wallet,
    }
  );

  const { loading: loading2, error: e2, data: prices } = useQuery(
    GET_LAST_PRICE,
    {
      variables: {
        tokens,
      },
      skip: !wallet,
    }
  );

  const { loading: loading3, error: e3, data: purchases } = useQuery(
    GET_PURCHASES,
    {
      variables: {
        tokens,
        wallet,
      },
      skip: !wallet,
    }
  );

  const [historicalData, setHistoricalData] = useState();

  useEffect(() => {
    const fn = async () => {
      const all = [];
      for (const token of tokens) {
        const apiName = apiNameByAddress(token);
        if (apiName) {
          const response = await fetch(
            `/storage/charts/${apiName}/common.json`
          ).then((res) => res.json());
          const adjusted = response.map((data) => {
            return {
              date: Math.floor(data[0] / 1000),
              dayId: Math.floor(data[0] / 1000 / 86400),
              price: round(data[1] * 10 ** 6, 3),
              token: token.toLowerCase(),
              totalPrice: round(
                Number.parseFloat(data[3]) * 10 ** 6 * 10 ** 18,
                3
              ),
            };
          });

          adjusted.forEach((a) => {
            all.push(a);
          });
        }
        setHistoricalData(all);
      }
    };
    fn();
  }, [tokens]);

  if (
    loading1 ||
    loading2 ||
    loading3 ||
    !balances ||
    !prices ||
    !historicalData ||
    !purchases
  ) {
    return <>{childrenLoading()}</>;
  }

  const fullData = mergeByDayID(prices.dayHistoricalDatas, historicalData);
  const computedData = computeDailyPrices(balances, fullData).reverse();

  // index computed data
  //
  const dataIndex = {};
  fullData.forEach((data) => {
    dataIndex[`${data.dayId}_${data.token.toLowerCase()}`] = data;
  });
  // add purchase price
  //
  const purchasesWithPrice = purchases.balanceEvents.map((p) => ({
    ...p,
    amount: p.kind === 1 ? p.amount : -p.amount,
    price: dataIndex[`${p.dayId}_${p.token.toLowerCase()}`],
  }));

  // Compute APY
  //
  const last = prices.dayHistoricalDatas[0];
  const first = prices.dayHistoricalDatas[prices.dayHistoricalDatas.length - 1];
  const lastPrice2 = last.price;
  let firstPrice = first.price;
  const daysBetween = last.dayId - first.dayId;
  const apy = (((lastPrice2 / firstPrice - 1) * 100) / daysBetween) * 365;
  const lastPrice = fullData[0].price;
  return (
    <>
      {children({
        fullData,
        computedData,
        purchasesWithPrice,
        lastPrice,
        apy,
      })}
    </>
  );
};

export default AccountPortfolioProvider;
