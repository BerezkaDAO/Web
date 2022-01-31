import { fetchDedupe } from "fetch-dedupe";
import { round } from "./round";
import {
  tokenInfo,
  tokens,
  defaultToken,
  tokenAddresses,
} from "../data/tokens";

export const fetchCommonAll = async (tokens) => {
  let result = [];
  for (let token of tokens) {
    const tokenResult = await fetchCommon(token);
    result = [...result, ...tokenResult];
  }
  return result;
};

export const fetchDaos = async () => {
  const daoes = await fetchDedupe(
    `/api/v1/public/daoes?sort=display_position`
  ).then((res) => res.data);
  return daoes.filter((dao) => dao.active).filter((dao) => dao.visible);
};

export const fillTokens = async () => {
  const daoes = await fetchDaos();
  tokens.splice(0, tokens.length);
  tokenAddresses.splice(0, tokenAddresses.length);
  defaultToken[0] = daoes[0].id;
  for (let dao of daoes) {
    tokenInfo[dao.id] = {
      name: dao.display_name,
      fullName: dao.display_name,
      address: dao.token.contract,
      tableName: dao.display_name,
      symbol: dao.token.symbol,
      dao: dao.token_request_contract_address,
      withdrawAgent: dao.withdraw_agent_address,
      withdrawEnabled: dao.withdraw_enabled,
      testWithdrawAgent: "0x7814c16cdf57758070c53d2366deda3a393a6145",
      isDexEnabled: false,
    };

    tokens.push(dao.id);
    tokenAddresses.push(dao.token.contract);
  }
};

export const fetchDao = async (tokenAddress) => {
  const daoes = await fetchDaos();
  const dao = daoes.find(
    (dao) => dao.token.contract.toLowerCase() === tokenAddress.toLowerCase()
  );
  if (!dao) {
    console.error(`Unable to get DAO for token address ${tokenAddress}`);
    return null;
  }
  return dao;
};

export const fetchDaoByName = async (name) => {
  if (!tokenInfo[name]) {
    console.error(`Unable to find DAO for name ${name}`);
    return null;
  }
  return fetchDao(tokenInfo[name].address);
};

export const fetchTokens = async () => {
  const daoes = await fetchDaos();
  const tokenAddresses = daoes.map((dao) => dao.token.contract.toLowerCase());
  const tokenNames = Object.keys(tokenInfo);
  const remoteTokenNames = tokenNames.filter((token) =>
    tokenAddresses.includes(tokenInfo[token].address.toLowerCase())
  );
  return tokens.filter((t) => remoteTokenNames.includes(t));
};

export const fetchTokensFull = async () => {
  const daoes = await fetchDaos();

  const tokenAddresses = daoes.map((dao) => dao.token.contract.toLowerCase());
  const tokenNames = Object.keys(tokenInfo);
  const existingTokenAddresses = tokenNames.map((name) =>
    tokenInfo[name].address.toLowerCase()
  );
  const displayTokenAddresses = tokenAddresses.filter((address) =>
    existingTokenAddresses.includes(address)
  );
  const index = {};
  Object.keys(tokenInfo)
    .map((name) => tokenInfo[name])
    .forEach((info) => {
      index[info.address.toLowerCase()] = info;
    });

  const result = daoes
    .filter((dao) =>
      displayTokenAddresses.includes(dao.token.contract.toLowerCase())
    )
    .map((dao) => ({
      address: dao.token.contract.toLowerCase(),
      name: index[dao.token.contract.toLowerCase()].name,
      fullName: index[dao.token.contract.toLowerCase()].fullName,
      tableName: index[dao.token.contract.toLowerCase()].tableName,
      symbol: dao.token.symbol,
    }));

  return result;
};

export const fetchCommon = async (tokenAddress, precision = 3) => {
  const dao = await fetchDao(tokenAddress);
  if (!dao) {
    return [
      {
        date: round(new Date().getTime() / 1000, 0),
        dayId: round(new Date().getTime() / 1000 / 86400, 0),
        price: "0",
        token: tokenAddress.toLowerCase(),
        supply: "0",
        totalPrice: "0",
        totalCarry: "0",
      },
    ];
  }
  const daoId = dao.id;
  const prices = await fetchDedupe(
    `/api/v1/public/daoes/${daoId}/token_price_history_daily`
  ).then((res) => res.data);
  const adjusted = prices.map((data) => {
    return {
      date: Math.floor(new Date(data.dt).getTime() / 1000, 0),
      dayId: Math.floor(new Date(data.dt).getTime() / 1000 / 86400, 0),
      price:
        "" +
        round(Number.parseFloat(data.dao_token_price) * 10 ** 6, precision),
      token: tokenAddress.toLowerCase(),
      supply: round(Number.parseFloat(data.dao_token_amount) * 10 ** 18, 0),
      totalPrice: round(
        Number.parseFloat(data.gross_liquidity_value_in_usd) *
          10 ** 18 *
          10 ** 6,
        0
      ),
      totalCarry:
        Number.parseFloat(data.carry_accumulated_value_in_usd) -
        Number.parseFloat(data.carry_out_value_in_usd),
    };
  });
  return adjusted;
};

export const fetchWeb3Data = async (tokenAddress) => {
  const dao = await fetchDao(tokenAddress);
  if (!dao) {
    return [
      {
        token: "",
        pricePercentValue: 0,
        name: "",
      },
    ];
  }
  const daoId = dao.id;
  const folio = await fetchDedupe(
    `/api/v1/public/daoes/${daoId}/portfolio`
  ).then((res) => res.data);
  let adjusted = folio.map((data) => {
    return {
      token: data.symbol,
      pricePercentValue: Number.parseFloat(data.percent),
      name: data.symbol,
    };
  });

  adjusted = adjusted.sort((a, b) => b.pricePercentValue - a.pricePercentValue);

  if (adjusted.length > 8) {
    adjusted = adjusted.slice(0, 8);
  }

  return adjusted;
};

export const fetchVaults = async (tokenAddress) => {
  const dao = await fetchDao(tokenAddress);
  if (!dao) {
    return [];
  }
  const daoId = dao.id;

  const folio = await fetchDedupe(`/api/v1/public/daoes/${daoId}/wallets`).then(
    (res) => res.data
  );
  let adjusted = folio.map((data) => data.address);
  return adjusted;
};

export const fetchCurrentPrice = async (tokenAddress) => {
  let daoId = "";
  if (tokenAddress === "0xa579b0ee7f64ea4da01bf43ab173a597d9bb7bd4") {
    daoId = "10000000-0000-0000-0000-000000000000";
  } else {
    const dao = await fetchDao(tokenAddress);
    if (!dao) {
      return [];
    }
    daoId = dao.id;
  }

  const rawPrice = await fetchDedupe(
    `/api/v1/public/daos/${daoId}/current_price`
  ).then((res) => res.data);
  let adjusted = {
    price: rawPrice.PriceBigInt,
    ts: rawPrice.DTBigInt,
    signature: rawPrice.signature,
  };
  return adjusted;
};
