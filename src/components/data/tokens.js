export const tokenInfo = {
  flex: {
    name: "Flex",
    fullName: "Berezka Flex",
    address: "0x0D7DeA5922535087078dd3D7c554EA9f2655d4cB",
    tableName: "Flex",
    symbol: "FLEX",
    dao: "0xac3f8e8518139f732218ff542d21cd6968e8209d",
    maximumDiff: 10,
    isDexEnabled: true,
  },
  emiflex: {
    name: "EmiFlex",
    address: "0xD68E7b64888F095Ee15f18347ccA7e453E0DBe17",
    tableName: "EmiFlex",
    symbol: "EFLX",
    dao: "0xef5d72e2d0cd8943e02aa4118bf94424017c8fdf",
    maximumDiff: 10,
  },
  dyna: {
    name: "Dynamic",
    address: "0xdc76450fd7e6352733fe8550efabff750b2de0e3",
    tableName: "Dynamic",
    symbol: "DYNA",
    dao: "0x95c4c0bcffd5ff8b5796f395b20db7414b34954c",
    maximumDiff: 10,
    isDexEnabled: true,
  },
  deposit: {
    name: "Deposit",
    address: "0xf6ce9BFA82D1088d3257a76ec2e0ce1C8060BF8c",
    tableName: "Deposit",
    symbol: "BDQ",
    dao: "0xf5ac13a709e7bc86001b7107c8839b6d6f6046a3",
    maximumDiff: 0.01,
    withdrawAgent: "0xac1c30c8ae96a6cdd392bc2593a6e00d964b73c2",
    withdrawEnabled: true,
  },
  skyflex: {
    address: "0x26677EB24FD007Ad279FC55f367De31482E1bF54",
    name: "SkyFlex",
    tableName: "SkyFlex",
    isLegacy: true,
  },
  moneytree: {
    address: "0xc0174b778f5a0792f681e5429730ee7445e8ea9f",
    name: "MoneyTree",
    tableName: "MoneyTree",
    isLegacy: true,
  },
  //rumuflex: {
  //  address: "0xc0174b778f5a0792f681e5429730ee7445e8ea9f",
  //  name: "RumuFlex",
  //  tableName: "RumuFlex",
  //  isLegacy: true,
  //},
  yolka: {
    address: "0x1a8051e22bFEeeE50d01475bf8489Ac489234122",
    name: "Yolka",
    tableName: "Yolka",
    isLegacy: true,
  },
  hedge: {
    address: "0x6408da01CdCE025265652e8a3DAb88C85301111b",
    name: "Hedge DAO",
    tableName: "Hedge DAO",
    isLegacy: true,
  },
  afford: {
    address: "0x949DF40227F764C258557EFD1b5A71A760E42162",
    symbol: "FCLG",
    name: "Afford Capital",
    tableName: "Afford Capital",
    dao: "0xe6563a2e20c6025174d63a5af64b157a59b91c7a",
    maximumDiff: 4,
  },
  btceth: {
    address: "0x0586cfc19dbf0894a7ab0949b7c0cde1608d126c",
    name: "BTC/ETH",
    tableName: "BTC/ETH",
  },
};

export const tokens = [
  "flex",
  "deposit",
  "dyna",
  "emiflex",
  "afford",
  "moneytree",
  "yolka",
  "hedge",
];

export const dashboardTokens = [
  "flex",
  "deposit",
  "dyna",
  "emiflex",
  "afford",
  //"skyflex",
  "moneytree",
  //"rumuflex",
  "yolka",
  "hedge",
];

export const legacyTokens = [];

export const tokenAddresses = tokens.map((token) => tokenInfo[token].address);

export const legacyTokenAddresses = legacyTokens.map(
  (token) => tokenInfo[token].address
);

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

export const nameByAddress = (address) =>
  [...tokens, ...legacyTokens]
    .map((token) => ({
      ...tokenInfo[token],
      name: token,
    }))
    .find((info) => info.address.toLowerCase() === address.toLowerCase()).name;

export const onChainDayIdStart = (address) =>
  tokens
    .map((token) => tokenInfo[token])
    .find((info) => info.address.toLowerCase() === address.toLowerCase())
    ?.onChainDayIdStart;

export const maximumDiff = (address) =>
  tokens
    .map((token) => tokenInfo[token])
    .find((info) => info.address.toLowerCase() === address.toLowerCase())
    ?.maximumDiff;
