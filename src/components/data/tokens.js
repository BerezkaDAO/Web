export const tokenInfo = {
  flex: {
    name: "Flex",
    fullName: "Berezka Flex",
    apiName: "berezka",
    address: "0x0D7DeA5922535087078dd3D7c554EA9f2655d4cB",
    tableName: "Flex",
    symbol: "FLEX",
    dao: "0xac3f8e8518139f732218ff542d21cd6968e8209d",
    onChainDayIdStart: 18550,
    maximumDiff: 3,
  },
  emiflex: {
    name: "EmiFlex",
    apiName: "emiflex",
    address: "0xD68E7b64888F095Ee15f18347ccA7e453E0DBe17",
    tableName: "EmiFlex",
    symbol: "EFLX",
    dao: "0xef5d72e2d0cd8943e02aa4118bf94424017c8fdf",
    onChainDayIdStart: 18550,
    maximumDiff: 3,
  },
  dyna: {
    name: "Dynamic",
    apiName: "dyna",
    address: "0xdc76450fd7e6352733fe8550efabff750b2de0e3",
    tableName: "Dynamic",
    symbol: "DYNA",
    dao: "0x95c4c0bcffd5ff8b5796f395b20db7414b34954c",
    onChainDayIdStart: 18550,
    maximumDiff: 11,
  },
  deposit: {
    name: "Deposit",
    apiName: "deposit",
    address: "0xf6ce9BFA82D1088d3257a76ec2e0ce1C8060BF8c",
    tableName: "Deposit",
    symbol: "BDQ",
    dao: "0xf5ac13a709e7bc86001b7107c8839b6d6f6046a3",
    onChainDayIdStart: 18613,
    maximumDiff: 1,
  },
};

export const tokens = ["flex", "deposit", "dyna", "emiflex"];

export const allTokens = tokens.map((token) => tokenInfo[token]);

export const tokenAddresses = tokens.map((token) => tokenInfo[token].address);

export const currencyInfo = {
  usdt: {
    symbol: "USDT",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
    image: "type4",
  },
  usdc: {
    symbol: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    image: "type5",
  },
  dai: {
    symbol: "DAI",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    decimals: 18,
    image: "type3",
  },
};

export const currencies = ["usdt", "usdc", "dai"];

export const apiNameByAddress = (address) =>
  tokens
    .map((token) => tokenInfo[token])
    .find((info) => info.address.toLowerCase() === address.toLowerCase())
    .apiName;

export const onChainDayIdStart = (address) =>
  tokens
    .map((token) => tokenInfo[token])
    .find((info) => info.address.toLowerCase() === address.toLowerCase())
    .onChainDayIdStart;

export const maximumDiff = (address) =>
  tokens
    .map((token) => tokenInfo[token])
    .find((info) => info.address.toLowerCase() === address.toLowerCase())
    .maximumDiff;
