import React, { useEffect } from "react";
import { round } from "./round";
import { ftmAmount, fmtDollatAmount, fmtDollatAmountSmall } from "./format";
import AccountPortfolioProvider from "./AccountPortfolioProvider";
import TokenTableValueOutput from "./TokenTableValueOutput";

const RowDataC = (props) => {
  const {
    tableName,
    symbol,
    address,
    balance,
    avgInvPrice,
    lastPrice,
    apy,
    profitAccumulator,
    totalAccumulator,
    totalProfitAccumulator,
    totalInvestedAccumulator,
  } = props;

  console.log(`Rendering RowData for 
        tableName ${tableName} 
        symbol ${symbol} 
        address ${address} 
        balance ${balance} 
        avgInvPrice ${avgInvPrice} 
        lastPrice ${lastPrice} 
        apy ${apy} 
    `);

  const iAmount = balance * avgInvPrice;
  const priceUSD = lastPrice;
  const portfolioPrice = balance * priceUSD;
  const profit = portfolioPrice - iAmount;
  const profitPercent = iAmount == 0 ? 0 : (profit / iAmount) * 100;

  useEffect(() => {
    setTimeout(() => {
      profitAccumulator(address, profit);
      totalAccumulator(address, portfolioPrice);
      totalProfitAccumulator(address, profit);
      totalInvestedAccumulator(address, iAmount);
    }, 1);
  }, [profit, portfolioPrice, iAmount]);

  return (
    <tr>
      <td>{tableName}</td>
      <td>{symbol}</td>
      <td>
        <TokenTableValueOutput value={balance} render={ftmAmount} />
      </td>
      <td>
        {" "}
        <TokenTableValueOutput value={iAmount} render={fmtDollatAmount} />
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
      <td>$ ...</td>
      <td>$ ...</td>
      <td>$ ...</td>
      <td>$ ...</td>
      <td>$ ...</td>
      <td>... %</td>
      <td>... %</td>
    </tr>
  );
};

const TokenTableInfoRow = (props) => {
  const {
    walletAddress,
    token,
    profitAccumulator,
    totalAccumulator,
    totalProfitAccumulator,
    totalInvestedAccumulator,
  } = props;

  console.log(`Rendering TokenTableInfoRow for 
        token ${token.tableName}
    `);
  return (
    <AccountPortfolioProvider
      token={token.address}
      wallet={walletAddress}
      childrenLoading={() => <RowLoading token={token} />}
      children={(info) => (
        <RowData
          tableName={info.tableName}
          symbol={info.symbol}
          address={info.address}
          balance={info.balance}
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
