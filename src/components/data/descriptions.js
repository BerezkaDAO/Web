import React from "react";

const flex = {
  name: <>Berezka Flex</>,
  shortDesc: (
    <>Imagine that you own an exchange and earn commission from each trade</>
  ),
  fullDesc: (
    <>
      Stable coins are allocated across
      <br />
      decentralized exchanges
      <br />
      (Uniswap, dydx, etc.) and are split in trading pairs (ETH/USDC, USDC/Dai,
      etc). Each exchange charges a commission on each trade in such pairs and
      shares the commission with you. Flex strategy may include other investment
      instruments which are introduced after DAO voting
    </>
  ),
  benefits: (
    <>
      - instant withdrawal
      <br />- limited exposure to volatile assets (e.g. ETH, if selected in
      traded pair), smoothed by earned trading commissions
      <br />- higher returns with longer investment periods
    </>
  ),
};

const deposit = {
  name: <>Berezka Deposit</>,
  shortDesc: <>Imagine that you place a deposit in a bank</>,
  fullDesc: (
    <>
      Stable coins are deposited across DeFi protocols (Compound, Curve, DDEX,
      Aave, etc.) and moved between resources in search for a higher deposit
      interest rate
    </>
  ),
  benefits: (
    <>
      - instant withdrawal; smart contract can be insured for breach; zero
      volatility risk (unlike BTC, ETH, etc.)
    </>
  ),
};

const dyna = {
  name: <>Berezka Dynamic</>,
  shortDesc: (
    <>
      {" "}
      Automated buy/sell strategy of volatile assets (e.g. ETH,BTC) when a 20
      days moving average asset price point is crossed
    </>
  ),
  fullDesc: (
    <>
      {" "}
      ETH, BTC or other DeFi assets are bought and held up to the point when the
      20 days moving average price is crossed. At this stage the asset is sold
      for stable coin, and repurchased again once the 20 days moving average
      price moves above the price point. Rebalanced not earlier than every 4
      days
    </>
  ),
  benefits: (
    <>
      - possible sharp price drop of selected asset (ETH, BTC, etc) and long low
      market period with zero movement
      <br />- if withdrawal from the asset is made right after the price drop
      the loss may be significant (2020 ETH historical peak price drops = from
      -1,7% to -26,5%)
    </>
  ),
};

const emiflex = {
  name: <>EmiFlex</>,
  shortDesc: (
    <>
      {" "}
      Partnering product with our collegues from EmiSwap copying Berezka Flex
      principles
    </>
  ),
  fullDesc: (
    <>
      Stable coins are allocated across decentralized exchanges (Uniswap, dydx,
      etc.) and are split in trading pairs (ETH/USDC, USDC/Dai, etc). Each
      exchange charges a commission on each trade in such pairs and shares the
      commission with you. Flex strategy may include other investment
      instruments which are introduced after DAO voting
    </>
  ),
  benefits: (
    <>
      - instant withdrawal
      <br />- limited exposure to volatile assets (e.g. ETH, if selected in
      traded pair), smoothed by earned trading commissions
      <br />- higher returns with longer investment periods
    </>
  ),
};

const skyflex = {
  name: <>SkyFlex</>,
  shortDesc: <>Imagine that you place a deposit in a bank</>,
  fullDesc: (
    <>
      Stable coins are deposited across DeFi protocols (Compound, Curve, DDEX,
      Aave, etc.). Profit are reinvesting to synthetics and high volatile
      products
    </>
  ),
  benefits: (
    <>
      - instant withdrawal; smart contract can be insured for breach; zero
      volatility risk (unlike BTC, ETH, etc.)
    </>
  ),
};

const btceth = {
  name: <>BTC/ETH</>,
  shortDesc: (
    <>
      Aggressive strategy that provides additional income on BTC / ETH assets.
      Your amount of BTC / ETH remains unchanged, supplied to DeFi protocols and
      yields interest.
    </>
  ),
  fullDesc: (
    <>
      BTC / ETH deposited to audited DeFi protocols to particiapate in interest
      and yield farming distribtion among all liquidity providers. Your amount
      of BTC / ETH remains unchanged and Berezka does not participate in the BTC
      / ETH price changes. Additional earnings on top of the amount of BTC / ETH
      supplied are either reinvested or distributed to your wallet
    </>
  ),
  benefits: (
    <>
      - possible sharp price drop of supplied asset (ETH, BTC) and long low
      market period with zero movement (regardless the market situation the
      amount of supplied assets (BTC / ETH) remains unchanged
    </>
  ),
};

const moneytree = {
  name: <>MoneyTree</>,
  shortDesc: (
    <>
      {" "}
      Partnering product with our collegues from MoneyTree copying Berezka Flex
      principles
    </>
  ),
  fullDesc: (
    <>
      Stable coins are allocated across decentralized exchanges (Uniswap, dydx,
      etc.) and are split in trading pairs (ETH/USDC, USDC/Dai, etc). Each
      exchange charges a commission on each trade in such pairs and shares the
      commission with you. Flex strategy may include other investment
      instruments which are introduced after DAO voting
    </>
  ),
  benefits: (
    <>
      - instant withdrawal
      <br />- limited exposure to volatile assets (e.g. ETH, if selected in
      traded pair), smoothed by earned trading commissions
      <br />- higher returns with longer investment periods
    </>
  ),
};

const rumuflex = {
  name: <>RumuFlex</>,
  shortDesc: (
    <>
      {" "}
      Partnering product with our collegues from MoneyTree copying Berezka Flex
      principles
    </>
  ),
  fullDesc: (
    <>
      Stable coins are allocated across decentralized exchanges (Uniswap, dydx,
      etc.) and are split in trading pairs (ETH/USDC, USDC/Dai, etc). Each
      exchange charges a commission on each trade in such pairs and shares the
      commission with you. Flex strategy may include other investment
      instruments which are introduced after DAO voting
    </>
  ),
  benefits: (
    <>
      - instant withdrawal
      <br />- limited exposure to volatile assets (e.g. ETH, if selected in
      traded pair), smoothed by earned trading commissions
      <br />- higher returns with longer investment periods
    </>
  ),
};

const yolka = {
  name: <>Yolka</>,
  shortDesc: <>Imagine that you place a deposit in a bank</>,
  fullDesc: (
    <>
      Stable coins are deposited across DeFi protocols (Compound, Curve, DDEX,
      Aave, etc.) and moved between resources in search for a higher deposit
      interest rate
    </>
  ),
  benefits: (
    <>
      - instant withdrawal; smart contract can be insured for breach; zero
      volatility risk (unlike BTC, ETH, etc.)
    </>
  ),
};

const hedge = {
  name: <>Hedge DAO</>,
  shortDesc: <>Imagine that you place a deposit in a bank</>,
  fullDesc: (
    <>
      Stable coins are deposited across DeFi protocols (Compound, Curve, DDEX,
      Aave, etc.) and moved between resources in search for a higher deposit
      interest rate
    </>
  ),
  benefits: (
    <>
      - instant withdrawal; smart contract can be insured for breach; zero
      volatility risk (unlike BTC, ETH, etc.)
    </>
  ),
};

export const texts = {
  flex,
  dyna,
  emiflex,
  deposit,
  skyflex,
  btceth,
  moneytree,
  rumuflex,
  yolka,
  hedge,
};
