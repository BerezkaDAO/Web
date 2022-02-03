import { fetchDedupe } from "fetch-dedupe";
import { tokenInfo, nameByAddress } from "../data/tokens";

/*
          tableName={info.tableName}
          symbol={info.symbol}
          address={info.address}
          balance={info.balance} !
          avgInvPrice={info.avgInvPrice} !
          lastPrice={info.lastPrice} !
          apy={info.apy} !
*/
export const fetchClient = async (address) => {
  const result = await fetchDedupe(
    `/api/v1/public/clients/${address}/info`
  ).then((res) => res.data);

  return result.map((row) => ({
    daoId: row.dao_id,
    tableName: tokenInfo[row.dao_id].tableName,
    symbol: tokenInfo[row.dao_id].symbol,
    address: tokenInfo[row.dao_id].address,
    clientAddress: row.client_address,
    balance: row.client_token_amount,
    purchasedTokensAmount: row.purchased_tokens_amount,
    investedPortfolioCalue: row.invested_portfolio_value,
    avgInvPrice: row.avg_purchase_token_price,
    lastPrice: row.current_token_price,
    profitValue: row.profit_value,
    profitRatio: row.profit_ratio,
    apy: row.apy_percent,
  }));
};

export const fetchClientToken = async (address, token) => {
  const all = await fetchClient(address);
  const result = all.find(
    (x) => x.address.toLowerCase() === token.toLowerCase()
  );
  if (result) {
    return result;
  } else {
    const daoId = nameByAddress(token);
    const info = tokenInfo[daoId];
    return {
      daoId,
      tableName: info.tableName,
      symbol: info.symbol,
      address: info.address,
      clientAddress: address,
      balance: 0,
      purchasedTokensAmount: 0,
      investedPortfolioCalue: 0,
      avgInvPrice: 0,
      lastPrice: 0,
      profitValue: 0,
      profitRatio: 0,
      apy: 0,
    };
  }
};
