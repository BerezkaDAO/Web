import { fetchCached } from "./cache";
import { tokenInfo, nameByAddress } from "../data/tokens";

export const fetchClient = async (address) => {
  const daosUserAccounts = await fetchCached(
    `/api/v1/public/clients/${address}/info`
  ).then((res) => res.data);

  return daosUserAccounts
    .filter((daoUserAccount) => tokenInfo[daoUserAccount.dao_id])
    .map((daoUserAccount) => ({
      daoId: daoUserAccount.dao_id,
      lastPrice: daoUserAccount.current_token_price,
      tableName: daoUserAccount.dao_display_name,
      investedPortfolioValue: daoUserAccount.invested_portfolio_value,

      symbol: tokenInfo[daoUserAccount.dao_id].symbol,
      address: tokenInfo[daoUserAccount.dao_id].address,

      clientAddress: daoUserAccount.client_address,
      balance: daoUserAccount.client_token_amount,
      purchasedTokensAmount: daoUserAccount.purchased_tokens_amount,
      avgInvPrice: daoUserAccount.avg_purchase_token_price,
      profitValue: daoUserAccount.profit_value,
      profitRatio: daoUserAccount.profit_ratio,
      apy: daoUserAccount.apy_percent,
    }));
};

export const getDaoUserAccount = async (address, daoId) => {
  const daosUserAccounts = await fetchClient(address);
  const currentDaoAccount = daosUserAccounts.find(
    (dao) => dao.daoId.toLowerCase() === daoId.toLowerCase()
  );

  if (currentDaoAccount) {
    return currentDaoAccount;
  } else {
    const info = tokenInfo[daoId];
    const nullableDaoAccount = {
      daoId,
      tableName: info.tableName,
      symbol: info.symbol,
      address: info.address,
      clientAddress: address,
      balance: 0,
      purchasedTokensAmount: 0,
      investedPortfolioValue: 0,
      avgInvPrice: 0,
      lastPrice: 0,
      profitValue: 0,
      profitRatio: 0,
      apy: 0,
    };

    return nullableDaoAccount;
  }
};
