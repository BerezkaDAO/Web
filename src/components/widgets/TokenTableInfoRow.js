import React, { useEffect } from "react";
import { round } from "./round";
import { ftmAmount, fmtDollatAmount, fmtDollatAmountSmall } from "./format";
import AccountPortfolioProvider from "./AccountPortfolioProvider";
import TokenTableValueOutput from "./TokenTableValueOutput";
import ERC20Provider from "./ERC20Provider";

const getPrice = (purchase) => {
  let price = 0;
  if (
    purchase.counterparty.toLowerCase() ===
    "0xf8a8d25049ebfaf36cf1dd7ff51ebd0777fc9b32"
  ) {
    price = 1;
  } else {
    if (purchase.price) {
      price = purchase.price.price / 10 ** 6;
    }
  }
  return price;
};

const investedAmount = (purchases) => {
  let totalInvestedAmount = 0;
  for (let purchase of purchases) {
    const price = getPrice(purchase);
    if (price) {
      totalInvestedAmount += (purchase.amount / 10 ** 18) * price;
    }
  }
  return totalInvestedAmount;
};

const avgInvestedPrice = (purchases) => {
  if (purchases.length == 0) {
    return 0;
  }
  let totalPrice = 0;
  let total = 0;
  for (let purchase of purchases) {
    const price = getPrice(purchase);
    if (price) {
      const amount = purchase.amount / 10 ** 18;
      totalPrice += price * amount;
      total += amount;
    }
  }
  return totalPrice && total ? totalPrice / total : 0;
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

  const avgInvPrice = avgInvestedPrice(
    purchasesWithPrice.filter((p) => p.kind === 1)
  );
  // const iAmount = investedAmount(purchasesWithPrice);
  const iAmount = balance * avgInvPrice;
  const priceUSD = lastPrice / 10 ** 6;
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
