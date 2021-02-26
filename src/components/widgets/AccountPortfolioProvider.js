import React from "react";
import { useQuery, gql } from "@apollo/react-hooks";
import { computeDailyPrices } from "./computeCost";
import { useTokenDatas } from "./useTokenData";

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

  const { loading: loading2, merged } = useTokenDatas(tokens);

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

  if (loading1 || loading2 || loading3 || !balances || !purchases) {
    return <>{childrenLoading()}</>;
  }

  const fullData = merged;
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
  const last = fullData[0];
  const first = fullData[fullData.length - 1];
  const lastPrice2 = last.price;
  let firstPrice = first.price;
  const daysBetween = last.dayId - first.dayId;
  const apy = (((lastPrice2 / firstPrice - 1) * 100) / daysBetween) * 365;
  const lastPrice = fullData[0].priceAfterCarry || fullData[0].price;
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
