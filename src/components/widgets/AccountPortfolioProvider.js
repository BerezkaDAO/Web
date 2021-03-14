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
    balanceEvents(where: { wallet: $wallet, token_in: $tokens, kind: 1 }) {
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

const GET_TOKEN_REQUESTS = gql`
  query GetTokenRequests($wallet: String, $tokens: [String]) {
    tokenRequests(
      where: { requestedToken_in: $tokens, requestor: $wallet, status: 2 }
    ) {
      id
      dateCreated
      dateFinished
      requestor
      dayIdCreated
      dayIdFinished
      offeredToken
      offeredTokenAmount
      offeredTokenPriceUsd
      price
      requestedToken
      requestedTokenAmount
      status
    }
  }
`;

// counterparty_in: [
//  "0x0000000000000000000000000000000000000000"
//  "0xf8a8d25049ebfaf36cf1dd7ff51ebd0777fc9b32"
// ]

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
      context: {
        clientName: "tokens",
      },
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
      context: {
        clientName: "tokens",
      },
    }
  );

  const { loading: loading4, error: e4, data: requests } = useQuery(
    GET_TOKEN_REQUESTS,
    {
      variables: {
        tokens,
        wallet,
      },
      skip: !wallet,
      context: {
        clientName: "request",
      },
    }
  );

  if (
    loading1 ||
    loading2 ||
    loading3 ||
    loading4 ||
    !balances ||
    !purchases ||
    !requests
  ) {
    return <>{childrenLoading()}</>;
  }

  const fullData = merged;
  const computedData = computeDailyPrices(balances, fullData).reverse();

  // Index computed data
  //
  const dataIndex = {};
  fullData.forEach((data) => {
    dataIndex[`${data.dayId}_${data.token.toLowerCase()}`] = data;
  });

  // Hardcode for fist BDQ data point
  //
  dataIndex[
    `${18571}_${"0xf6ce9BFA82D1088d3257a76ec2e0ce1C8060BF8c".toLowerCase()}`
  ] =
    dataIndex[
      `${18575}_${"0xf6ce9BFA82D1088d3257a76ec2e0ce1C8060BF8c".toLowerCase()}`
    ];

  // Index token requsts
  //
  const requestIndex = {};
  requests.tokenRequests.forEach((data) => {
    requestIndex[
      `${data.dayIdFinished}_${data.requestedToken.toLowerCase()}`
    ] = data;
  });

  // Add purchase price
  //
  const purchasesWithPrice = purchases.balanceEvents.map((p) => ({
    ...p,
    amount: p.kind === 1 ? p.amount : -p.amount,
    price:
      requestIndex[`${p.dayId}_${p.token.toLowerCase()}`] ||
      dataIndex[`${p.dayId}_${p.token.toLowerCase()}`],
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
