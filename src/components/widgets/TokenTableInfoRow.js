import React, { useEffect } from "react";
import { round } from "./round";
import { ftmAmount, fmtDollatAmount, fmtDollatAmountSmall } from "./format";
import AccountPortfolioProvider from "./AccountPortfolioProvider";
import TokenTableValueOutput from "./TokenTableValueOutput";
import { checkIsBlastDao } from "./checkIsBlastDao";

const RowDataC = (props) => {
  const {
    isBlastDao,
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
    accountInfo,
  } = props;

  const portfolioPrice = balance * lastPrice;
  const profit = isBlastDao ? portfolioPrice : portfolioPrice - investedAmount;
  const profitUSD = isBlastDao
    ? portfolioPrice
    : accountInfo.currentPortfolioValueUSD -
      accountInfo.investedPortfolioValueUSD;
  const profitPercent = (profit / investedAmount) * 100;

  useEffect(() => {
    setTimeout(() => {
      profitAccumulator(address, profitPercent);
      totalAccumulator(address, accountInfo.currentPortfolioValueUSD);
      totalProfitAccumulator(address, profitUSD);
      totalInvestedAccumulator(address, accountInfo.investedPortfolioValueUSD);
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
        <TokenTableValueOutput value={avgInvPrice} render={ftmAmount} />
      </td>
      <td className="nowrap">
        {" "}
        <TokenTableValueOutput value={lastPrice} render={ftmAmount} />
      </td>
      <td className="nowrap">
        {" "}
        <TokenTableValueOutput value={portfolioPrice} render={ftmAmount} />
      </td>
      <td>
        {" "}
        <TokenTableValueOutput value={profit} render={ftmAmount} />
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

  const isBlastDao = checkIsBlastDao(dao.address);

  return (
    <AccountPortfolioProvider
      dao={dao}
      wallet={walletAddress}
      childrenLoading={() => <RowLoading token={dao} />}
      children={(accountInfo) => (
        <RowData
          isBlastDao={isBlastDao}
          baseCurrency={dao.base_currency}
          accountInfo={accountInfo}
          tableName={accountInfo.tableName}
          symbol={accountInfo.symbol}
          address={accountInfo.address}
          balance={accountInfo.balance}
          investedAmount={accountInfo.investedPortfolioValue}
          avgInvPrice={accountInfo.avgInvPrice}
          lastPrice={accountInfo.lastPrice}
          apy={accountInfo.apy}
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
