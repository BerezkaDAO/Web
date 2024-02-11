import React, { useEffect } from "react";
import { round } from "./round";
import { ftmAmount, fmtDollatAmount, fmtDollatAmountSmall } from "./format";
import AccountPortfolioProvider from "./AccountPortfolioProvider";
import TokenTableValueOutput from "./TokenTableValueOutput";

const RowDataC = (props) => {
  const {
    baseCurrency,
    tableName,
    symbol,
    address,
    balance,
    investedAmount,
    avgInvPrice,
    lastPrice,
    apy,
    profitAccumulator,
    totalAccumulator,
    totalProfitAccumulator,
    totalInvestedAccumulator,
  } = props;

  const priceUSD = lastPrice;

  const portfolioPrice = balance * priceUSD;
  const profit = portfolioPrice - investedAmount;
  const profitPercent = (profit / investedAmount) * 100;

  useEffect(() => {
    setTimeout(() => {
      profitAccumulator(address, profit);
      totalAccumulator(address, portfolioPrice);
      totalProfitAccumulator(address, profit);
      totalInvestedAccumulator(address, investedAmount);
    }, 1);
  }, [profit, portfolioPrice, investedAmount]);

  return (
    <tr>
      <td>{tableName}</td>
      <td>{symbol}</td>
      <td>
        <TokenTableValueOutput value={balance} render={ftmAmount} />
      </td>
      <td>{baseCurrency}</td>
      <td>
        <TokenTableValueOutput value={investedAmount} render={ftmAmount} />
      </td>
      <td>
        {" "}
        <TokenTableValueOutput
          value={avgInvPrice}
          render={fmtDollatAmountSmall}
        />
      </td>
      <td className="nowrap">
        {" "}
        <TokenTableValueOutput value={priceUSD} render={fmtDollatAmountSmall} />
      </td>
      <td className="nowrap">
        {" "}
        <TokenTableValueOutput
          value={portfolioPrice}
          render={fmtDollatAmount}
        />
      </td>
      <td>
        {" "}
        <TokenTableValueOutput value={profit} render={fmtDollatAmount} />
      </td>
      <td>
        {" "}
        <TokenTableValueOutput
          value={profitPercent}
          render={(value) => `${round(value, 2).toFixed(1)} %`}
        />
      </td>
      <td className="nowrap">
        {" "}
        <TokenTableValueOutput
          value={apy}
          render={(value) => `${round(value, 2).toFixed(2)} %`}
        />
      </td>
    </tr>
  );
};

const RowData = React.memo(RowDataC);

const RowLoading = (props) => {
  const { token } = props;

  const tableName = token.tableName;
  const symbol = token.symbol;

  return (
    <tr>
      <td>{tableName}</td>
      <td>{symbol}</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>... %</td>
      <td>... %</td>
    </tr>
  );
};

const TokenTableInfoRow = (props) => {
  const {
    walletAddress,
    dao,
    profitAccumulator,
    totalAccumulator,
    totalProfitAccumulator,
    totalInvestedAccumulator,
  } = props;

  return (
    <AccountPortfolioProvider
      dao={dao}
      wallet={walletAddress}
      childrenLoading={() => <RowLoading token={dao} />}
      children={(info) => (
        <RowData
          baseCurrency={dao.base_currency}
          tableName={info.tableName}
          symbol={info.symbol}
          address={info.address}
          balance={info.balance}
          investedAmount={info.investedPortfolioValue}
          avgInvPrice={info.avgInvPrice}
          lastPrice={info.lastPrice}
          apy={info.apy}
          profitAccumulator={profitAccumulator}
          totalAccumulator={totalAccumulator}
          totalProfitAccumulator={totalProfitAccumulator}
          totalInvestedAccumulator={totalInvestedAccumulator}
        />
      )}
    />
  );
};

export default React.memo(TokenTableInfoRow);
