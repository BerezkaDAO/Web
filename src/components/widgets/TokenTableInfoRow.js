import React, { useEffect } from "react";
import { round } from "./round";
import AccountPortfolioProvider from "./AccountPortfolioProvider";
import ERC20Provider from "./ERC20Provider";

const investedAmount = (purchases) => {
  let totalInvestedAmount = 0;
  for (let purchase of purchases) {
    totalInvestedAmount +=
      ((purchase.amount / 10 ** 18) * purchase.price.price) / 10 ** 6;
  }
  return totalInvestedAmount;
};

const avgInvestedPrice = (purchases) => {
  if (purchases.length == 0) {
    return 0;
  }
  let totalPrice = 0;
  for (let purchase of purchases) {
    totalPrice += purchase.price.price / 10 ** 6;
  }
  return totalPrice / purchases.length;
};

const RowDataC = (props) => {
  const {
    tableName,
    symbol,
    address,
    balance,
    purchasesWithPrice,
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
        purchasesWithPrice ${purchasesWithPrice} 
        lastPrice ${lastPrice} 
        apy ${apy} 
    `);

  const iAmount = investedAmount(purchasesWithPrice);
  const avgInvPrice = avgInvestedPrice(purchasesWithPrice);
  const priceUSD = lastPrice / 10 ** 6;
  const portfolioPrice = balance * priceUSD;
  const profit = portfolioPrice - iAmount;
  const profitPercent = iAmount == 0 ? 0 : (profit / portfolioPrice) * 100;

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
      <td>{round(balance, 2).toFixed(2)}</td>
      <td>$ {round(iAmount, 2).toFixed(2)}</td>
      <td>$ {round(avgInvPrice, 2).toFixed(2)}</td>
      <td className="nowrap">$ {round(priceUSD, 2).toFixed(2)}</td>
      <td className="nowrap">$ {round(portfolioPrice, 2).toFixed(2)}</td>
      <td>$ {round(profit, 2).toFixed(2)}</td>
      <td>{round(profitPercent, 1).toFixed(1)} %</td>
      <td className="nowrap">{round(apy, 2).toFixed(1)} %</td>
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
    web3,
    profitAccumulator,
    totalAccumulator,
    totalProfitAccumulator,
    totalInvestedAccumulator,
  } = props;

  console.log(`Rendering TokenTableInfoRow for 
        token ${token.tableName}
    `);
  return (
    <ERC20Provider
      walletAddress={walletAddress}
      tokenAddress={token.address}
      web3={web3}
      childrenLoading={() => <RowLoading token={token} />}
      children={(balance) => (
        <AccountPortfolioProvider
          tokens={[token.address]}
          wallet={walletAddress}
          childrenLoading={() => <RowLoading token={token} />}
          children={(info) => (
            <RowData
              tableName={token.tableName}
              symbol={token.symbol}
              address={token.address}
              balance={balance}
              purchasesWithPrice={info.purchasesWithPrice}
              lastPrice={info.lastPrice}
              apy={info.apy}
              profitAccumulator={profitAccumulator}
              totalAccumulator={totalAccumulator}
              totalProfitAccumulator={totalProfitAccumulator}
              totalInvestedAccumulator={totalInvestedAccumulator}
            />
          )}
        />
      )}
    />
  );
};

export default React.memo(TokenTableInfoRow);
